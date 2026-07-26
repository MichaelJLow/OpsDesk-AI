"use server";

import { revalidatePath } from "next/cache";
import {
  draftTextToHtml,
  polishDraftText,
} from "@/lib/draft-polish";
import { ensureServerEnv, getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";

export type DecisionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function decideOnDraft(input: {
  proposedActionId: string;
  requestId: string;
  decision: "approve" | "reject";
  note?: string;
}): Promise<DecisionResult> {
  const { proposedActionId, requestId, decision } = input;
  const note = input.note?.trim() || undefined;

  if (!proposedActionId || !requestId) {
    return { ok: false, error: "Missing proposed action or request id." };
  }

  if (decision !== "approve" && decision !== "reject") {
    return { ok: false, error: "Decision must be approve or reject." };
  }

  const reviewer = await getSessionUser();
  if (!reviewer) {
    return { ok: false, error: "Sign in required to approve or reject." };
  }
  const reviewerId = reviewer.email?.trim() || reviewer.id;

  const supabase = getSupabaseAdmin();

  const { data: existing, error: loadError } = await supabase
    .from("proposed_actions")
    .select("id, status, request_id, action_type")
    .eq("id", proposedActionId)
    .maybeSingle();

  if (loadError) {
    return { ok: false, error: loadError.message };
  }

  if (!existing) {
    return { ok: false, error: "Proposed action not found." };
  }

  if (existing.request_id !== requestId) {
    return { ok: false, error: "Proposed action does not belong to this request." };
  }

  if (existing.action_type !== "draft_reply") {
    return { ok: false, error: "Only draft_reply actions can be decided here." };
  }

  if (existing.status !== "proposed") {
    return {
      ok: false,
      error: `Action is already "${existing.status}".`,
    };
  }

  const nextStatus = decision === "approve" ? "approved" : "rejected";
  const nextRequestStatus =
    decision === "approve" ? "approved" : "rejected";

  const { error: updateError } = await supabase
    .from("proposed_actions")
    .update({ status: nextStatus })
    .eq("id", proposedActionId)
    .eq("status", "proposed");

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  const { error: requestError } = await supabase
    .from("requests")
    .update({ status: nextRequestStatus })
    .eq("id", requestId);

  if (requestError) {
    return { ok: false, error: requestError.message };
  }

  const { error: insertError } = await supabase.from("approvals").insert({
    proposed_action_id: proposedActionId,
    reviewer_id: reviewerId,
    decision,
    reason:
      note ??
      (decision === "approve"
        ? "Approved via OpsDesk dashboard"
        : "Rejected via OpsDesk dashboard"),
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  revalidatePath("/");
  revalidatePath(`/requests/${requestId}`);

  return { ok: true };
}

export async function sendApprovedDraft(input: {
  proposedActionId: string;
  requestId: string;
}): Promise<DecisionResult> {
  const { proposedActionId, requestId } = input;

  if (!proposedActionId || !requestId) {
    return { ok: false, error: "Missing proposed action or request id." };
  }

  const sender = await getSessionUser();
  if (!sender) {
    return { ok: false, error: "Sign in required to send a reply." };
  }

  ensureServerEnv();
  const resolvedWebhookUrl = process.env.N8N_SEND_WEBHOOK_URL;
  if (!resolvedWebhookUrl) {
    return {
      ok: false,
      error:
        "N8N_SEND_WEBHOOK_URL is not set in the monorepo root .env (n8n webhook for protected send).",
    };
  }

  const supabase = getSupabaseAdmin();

  const { data: action, error: actionError } = await supabase
    .from("proposed_actions")
    .select("id, status, request_id, action_type, payload")
    .eq("id", proposedActionId)
    .maybeSingle();

  if (actionError) {
    return { ok: false, error: actionError.message };
  }

  if (!action) {
    return { ok: false, error: "Proposed action not found." };
  }

  if (action.request_id !== requestId) {
    return { ok: false, error: "Proposed action does not belong to this request." };
  }

  if (action.action_type !== "draft_reply") {
    return { ok: false, error: "Only draft_reply actions can be sent." };
  }

  if (action.status !== "approved") {
    return {
      ok: false,
      error: `Send blocked — action status is "${action.status}" (must be approved).`,
    };
  }

  const { data: request, error: requestLoadError } = await supabase
    .from("requests")
    .select("id, sender_email, subject, status, contact_id")
    .eq("id", requestId)
    .maybeSingle();

  if (requestLoadError) {
    return { ok: false, error: requestLoadError.message };
  }

  if (!request) {
    return { ok: false, error: "Request not found." };
  }

  let contactName: string | null = null;
  if (request.contact_id) {
    const { data: contact } = await supabase
      .from("contacts")
      .select("name")
      .eq("id", request.contact_id)
      .maybeSingle();
    contactName = contact?.name ?? null;
  }
  if (!contactName && request.sender_email) {
    const { data: contactByEmail } = await supabase
      .from("contacts")
      .select("name")
      .eq("email", request.sender_email)
      .maybeSingle();
    contactName = contactByEmail?.name ?? null;
  }

  const payload = (action.payload ?? {}) as {
    draftText?: string;
  };
  const rawDraft = payload.draftText?.trim();
  if (!rawDraft) {
    return { ok: false, error: "Draft text missing from proposed action payload." };
  }

  const draftText = polishDraftText(
    rawDraft,
    request.sender_email,
    contactName,
  );
  const htmlBody = draftTextToHtml(draftText);

  const replySubject = request.subject?.trim()
    ? request.subject.toLowerCase().startsWith("re:")
      ? request.subject
      : `Re: ${request.subject}`
    : "Re: Your maintenance request";

  let webhookResponse: Response;
  try {
    webhookResponse = await fetch(resolvedWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "x-opsdesk-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        requestId,
        proposedActionId,
        to: request.sender_email,
        subject: replySubject,
        body: draftText,
        htmlBody,
      }),
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `n8n webhook unreachable: ${error.message}`
          : "n8n webhook unreachable",
    };
  }

  if (!webhookResponse.ok) {
    const detail = await webhookResponse.text().catch(() => "");
    return {
      ok: false,
      error: `n8n webhook failed (${webhookResponse.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    };
  }

  const { error: actionUpdateError } = await supabase
    .from("proposed_actions")
    .update({ status: "sent" })
    .eq("id", proposedActionId)
    .eq("status", "approved");

  if (actionUpdateError) {
    return { ok: false, error: actionUpdateError.message };
  }

  const { error: requestUpdateError } = await supabase
    .from("requests")
    .update({ status: "sent" })
    .eq("id", requestId);

  if (requestUpdateError) {
    return { ok: false, error: requestUpdateError.message };
  }

  await supabase.from("workflow_events").insert({
    request_id: requestId,
    event_type: "draft_sent",
    step_name: "protected_send",
    status: "success",
    payload: {
      proposed_action_id: proposedActionId,
      to: request.sender_email,
      via: "n8n_webhook",
      sent_by: sender.email?.trim() || sender.id,
    },
  });

  revalidatePath("/");
  revalidatePath(`/requests/${requestId}`);

  return { ok: true };
}
