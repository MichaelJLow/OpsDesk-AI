"use server";

import { revalidatePath } from "next/cache";
import {
  draftTextToHtml,
  polishDraftText,
} from "@/lib/draft-polish";
import { formatEvidencePackMarkdown } from "@/lib/evidence-pack";
import {
  buildRetrievalQuery,
  retrieveKnowledge,
  stripCustomerCitationFootnotes,
  type RetrievalHit,
} from "@/lib/retrieval/search";
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
  return decideOnProposedAction({
    ...input,
    allowedActionType: "draft_reply",
    onApproveRequestStatus: "approved",
    onRejectRequestStatus: "rejected",
    timelineOnApprove: null,
  });
}

export async function decideOnChargeableWork(input: {
  proposedActionId: string;
  requestId: string;
  decision: "approve" | "reject";
  note?: string;
}): Promise<DecisionResult> {
  return decideOnProposedAction({
    ...input,
    allowedActionType: "chargeable_work",
    onApproveRequestStatus: "awaiting_execution",
    onRejectRequestStatus: "rejected",
    timelineOnApprove: {
      event_type: "execution_deferred",
      step_name: "chargeable_approval",
      status: "success",
      payload: {
        note: "Chargeable work approved — execution deferred (no auto-invoice or dispatch)",
      },
    },
  });
}

async function decideOnProposedAction(input: {
  proposedActionId: string;
  requestId: string;
  decision: "approve" | "reject";
  note?: string;
  allowedActionType: string;
  onApproveRequestStatus: string;
  onRejectRequestStatus: string;
  timelineOnApprove: {
    event_type: string;
    step_name: string;
    status: string;
    payload: Record<string, unknown>;
  } | null;
}): Promise<DecisionResult> {
  const { proposedActionId, requestId, decision, allowedActionType } = input;
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

  if (existing.action_type !== allowedActionType) {
    return {
      ok: false,
      error: `Only ${allowedActionType} actions can be decided here.`,
    };
  }

  if (existing.status !== "proposed") {
    return {
      ok: false,
      error: `Action is already "${existing.status}".`,
    };
  }

  const nextStatus = decision === "approve" ? "approved" : "rejected";
  const nextRequestStatus =
    decision === "approve"
      ? input.onApproveRequestStatus
      : input.onRejectRequestStatus;

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

  if (decision === "approve" && input.timelineOnApprove) {
    await supabase.from("workflow_events").insert({
      request_id: requestId,
      event_type: input.timelineOnApprove.event_type,
      step_name: input.timelineOnApprove.step_name,
      status: input.timelineOnApprove.status,
      payload: {
        ...input.timelineOnApprove.payload,
        proposed_action_id: proposedActionId,
        decided_by: reviewerId,
      },
    });
  } else if (
    decision === "reject" &&
    allowedActionType === "chargeable_work"
  ) {
    await supabase.from("workflow_events").insert({
      request_id: requestId,
      event_type: "chargeable_rejected",
      step_name: "chargeable_approval",
      status: "success",
      payload: {
        proposed_action_id: proposedActionId,
        decided_by: reviewerId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath(`/requests/${requestId}`);

  return { ok: true };
}

export async function updateDraftReply(input: {
  proposedActionId: string;
  requestId: string;
  draftText: string;
}): Promise<DecisionResult> {
  const { proposedActionId, requestId } = input;
  const draftText = input.draftText.trim();

  if (!proposedActionId || !requestId) {
    return { ok: false, error: "Missing proposed action or request id." };
  }

  if (!draftText) {
    return { ok: false, error: "Draft text cannot be empty." };
  }

  const editor = await getSessionUser();
  if (!editor) {
    return { ok: false, error: "Sign in required to edit a draft." };
  }
  const editorId = editor.email?.trim() || editor.id;

  const supabase = getSupabaseAdmin();

  const { data: existing, error: loadError } = await supabase
    .from("proposed_actions")
    .select("id, status, request_id, action_type, payload")
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
    return { ok: false, error: "Only draft replies can be edited here." };
  }

  if (existing.status !== "proposed" && existing.status !== "approved") {
    return {
      ok: false,
      error: `Draft cannot be edited while status is "${existing.status}".`,
    };
  }

  const previousPayload =
    existing.payload && typeof existing.payload === "object"
      ? (existing.payload as Record<string, unknown>)
      : {};
  const previousText =
    typeof previousPayload.draftText === "string"
      ? previousPayload.draftText
      : "";

  if (previousText.trim() === draftText) {
    return { ok: true };
  }

  const nextPayload = {
    ...previousPayload,
    draftText,
    editedAt: new Date().toISOString(),
    editedBy: editorId,
  };

  const { error: updateError } = await supabase
    .from("proposed_actions")
    .update({ payload: nextPayload })
    .eq("id", proposedActionId)
    .in("status", ["proposed", "approved"]);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  await supabase.from("workflow_events").insert({
    request_id: requestId,
    event_type: "draft_edited",
    step_name: "opsdesk_dashboard",
    status: "success",
    payload: {
      proposed_action_id: proposedActionId,
      edited_by: editorId,
      previous_length: previousText.length,
      next_length: draftText.length,
    },
  });

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
    .select("id, sender_email, subject, status, contact_id, raw_body, category")
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
    citations?: unknown;
    retrievalQuery?: string;
    [key: string]: unknown;
  };
  const rawDraft = payload.draftText?.trim();
  if (!rawDraft) {
    return { ok: false, error: "Draft text missing from proposed action payload." };
  }

  let draftForSend = stripCustomerCitationFootnotes(rawDraft);

  // Ensure citations exist on the action for desk/dispute; never put them in email body
  if (!Array.isArray((payload as { citations?: unknown }).citations)) {
    const { data: extractions } = await supabase
      .from("request_extractions")
      .select("structured_output")
      .eq("request_id", requestId)
      .order("created_at", { ascending: false })
      .limit(1);
    const so = (extractions?.[0]?.structured_output ?? null) as {
      issueSummary?: string;
      category?: string;
      assetType?: string;
      siteReference?: string | null;
    } | null;
    const query = buildRetrievalQuery({
      subject: request.subject,
      issueSummary: so?.issueSummary,
      category: so?.category || request.category,
      assetType: so?.assetType,
      siteReference: so?.siteReference,
      rawBody: request.raw_body,
    });
    const hits = retrieveKnowledge(query, { limit: 3 });
    if (hits.length > 0) {
      await supabase
        .from("proposed_actions")
        .update({
          payload: {
            ...payload,
            draftText: draftForSend,
            citations: hits,
            retrievalQuery: query,
          },
        })
        .eq("id", proposedActionId);
    }
  }

  const draftText = polishDraftText(
    draftForSend,
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

export type CreateWorkOrderResult =
  | { ok: true; jobId: string }
  | { ok: false; error: string };

/**
 * Protected lab execution after chargeable approval.
 * Creates a jobs row + audit event. Does NOT invoice, email, or dispatch.
 */
export async function createLabWorkOrder(input: {
  proposedActionId: string;
  requestId: string;
}): Promise<CreateWorkOrderResult> {
  const { proposedActionId, requestId } = input;

  if (!proposedActionId || !requestId) {
    return { ok: false, error: "Missing proposed action or request id." };
  }

  const actor = await getSessionUser();
  if (!actor) {
    return { ok: false, error: "You must be signed in to create a work order." };
  }

  const supabase = getSupabaseAdmin();

  const { data: action, error: actionError } = await supabase
    .from("proposed_actions")
    .select("id, request_id, action_type, status, payload")
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

  if (action.action_type !== "chargeable_work") {
    return { ok: false, error: "Only chargeable work can create a lab work order." };
  }

  if (action.status !== "approved") {
    return {
      ok: false,
      error: `Chargeable action must be approved first (current: ${action.status}).`,
    };
  }

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select("id, status, subject")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    return { ok: false, error: requestError.message };
  }

  if (!request) {
    return { ok: false, error: "Request not found." };
  }

  if (request.status !== "awaiting_execution" && request.status !== "executed_lab") {
    return {
      ok: false,
      error: `Request must be awaiting_execution (current: ${request.status}).`,
    };
  }

  const { data: existingJob } = await supabase
    .from("jobs")
    .select("id")
    .eq("proposed_action_id", proposedActionId)
    .maybeSingle();

  if (existingJob) {
    return { ok: true, jobId: existingJob.id };
  }

  const title =
    typeof action.payload === "object" &&
    action.payload &&
    "subject" in action.payload &&
    typeof (action.payload as { subject?: unknown }).subject === "string"
      ? (action.payload as { subject: string }).subject
      : request.subject || "Chargeable work order (lab)";

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      request_id: requestId,
      proposed_action_id: proposedActionId,
      job_type: "chargeable_work_order",
      title,
      status: "queued",
      lab_only: true,
      created_by: actor.email?.trim() || actor.id,
      payload: {
        lab: true,
        billing: "none",
        note: "Lab execution only — no invoice, dispatch, or contractor email.",
      },
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return {
      ok: false,
      error: jobError?.message || "Failed to create work order.",
    };
  }

  const { error: requestUpdateError } = await supabase
    .from("requests")
    .update({ status: "executed_lab" })
    .eq("id", requestId);

  if (requestUpdateError) {
    return { ok: false, error: requestUpdateError.message };
  }

  await supabase.from("workflow_events").insert({
    request_id: requestId,
    event_type: "execution_recorded",
    step_name: "protected_execution_lab",
    status: "success",
    payload: {
      job_id: job.id,
      proposed_action_id: proposedActionId,
      lab_only: true,
      billing: "none",
      executed_by: actor.email?.trim() || actor.id,
    },
  });

  revalidatePath("/");
  revalidatePath(`/requests/${requestId}`);

  return { ok: true, jobId: job.id };
}

export type EvidencePackResult =
  | { ok: true; markdown: string }
  | { ok: false; error: string };

/** Desk audit export — no email, invoice, or dispatch. */
export async function buildEvidencePack(input: {
  requestId: string;
}): Promise<EvidencePackResult> {
  const { requestId } = input;
  if (!requestId) {
    return { ok: false, error: "Missing request id." };
  }

  const actor = await getSessionUser();
  if (!actor) {
    return { ok: false, error: "You must be signed in to generate an evidence pack." };
  }

  const supabase = getSupabaseAdmin();

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select(
      "id, subject, sender_email, status, urgency, category, received_at",
    )
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    return { ok: false, error: requestError.message };
  }
  if (!request) {
    return { ok: false, error: "Request not found." };
  }

  const [
    { data: extractions },
    { data: actions },
    { data: jobs },
    { data: events },
  ] = await Promise.all([
    supabase
      .from("request_extractions")
      .select(
        "validation_status, model_name, structured_output, created_at",
      )
      .eq("request_id", requestId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("proposed_actions")
      .select("id, action_type, status, risk_level, reason, payload, created_at")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true }),
    supabase
      .from("jobs")
      .select("id, job_type, title, status, lab_only, created_at")
      .eq("request_id", requestId)
      .order("created_at", { ascending: true }),
    supabase
      .from("workflow_events")
      .select(
        "occurred_at, event_type, step_name, status, error, payload",
      )
      .eq("request_id", requestId)
      .order("occurred_at", { ascending: true })
      .limit(100),
  ]);

  const actionIds = (actions ?? []).map((a) => a.id);
  let approvals: Array<{
    decision: string;
    reviewer_id: string | null;
    reason: string | null;
    decided_at: string;
    proposed_action_id: string;
  }> = [];

  if (actionIds.length > 0) {
    const { data: approvalRows } = await supabase
      .from("approvals")
      .select(
        "decision, reviewer_id, reason, decided_at, proposed_action_id",
      )
      .in("proposed_action_id", actionIds)
      .order("decided_at", { ascending: true });
    approvals = approvalRows ?? [];
  }

  const markdown = formatEvidencePackMarkdown({
    request: {
      id: request.id,
      subject: request.subject,
      sender_email: request.sender_email,
      status: request.status,
      urgency: request.urgency,
      category: request.category,
      received_at: request.received_at,
    },
    extraction: extractions?.[0]
      ? {
          validation_status: extractions[0].validation_status,
          model_name: extractions[0].model_name,
          structured_output: extractions[0].structured_output as {
            issueSummary?: string;
            siteReference?: string | null;
            urgency?: string;
            category?: string;
            suggestedRoute?: string;
          } | null,
        }
      : null,
    actions: (actions ?? []).map((a) => ({
      id: a.id,
      action_type: a.action_type,
      status: a.status,
      risk_level: a.risk_level,
      reason: a.reason,
      payload: (a.payload ?? null) as Record<string, unknown> | null,
    })),
    jobs: jobs ?? [],
    events: events ?? [],
    approvals,
    generatedAt: new Date().toISOString(),
  });

  return { ok: true, markdown };
}

export type RetrieveContextResult =
  | { ok: true; query: string; hits: RetrievalHit[] }
  | { ok: false; error: string };

/** Keyword retrieval over Quayside lab corpus + timeline audit event. */
export async function retrieveRequestContext(input: {
  requestId: string;
}): Promise<RetrieveContextResult> {
  const { requestId } = input;
  if (!requestId) {
    return { ok: false, error: "Missing request id." };
  }

  const actor = await getSessionUser();
  if (!actor) {
    return { ok: false, error: "You must be signed in to retrieve context." };
  }

  const supabase = getSupabaseAdmin();

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select("id, subject, raw_body, category")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    return { ok: false, error: requestError.message };
  }
  if (!request) {
    return { ok: false, error: "Request not found." };
  }

  const { data: extractions } = await supabase
    .from("request_extractions")
    .select("structured_output")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false })
    .limit(1);

  const so = (extractions?.[0]?.structured_output ?? null) as {
    issueSummary?: string;
    category?: string;
    assetType?: string;
    siteReference?: string | null;
  } | null;

  const query = buildRetrievalQuery({
    subject: request.subject,
    issueSummary: so?.issueSummary,
    category: so?.category || request.category,
    assetType: so?.assetType,
    siteReference: so?.siteReference,
    rawBody: request.raw_body,
  });

  const hits = retrieveKnowledge(query, { limit: 3 });

  await supabase.from("workflow_events").insert({
    request_id: requestId,
    event_type: "retrieval_ran",
    step_name: "keyword_retrieval",
    status: "success",
    payload: {
      query: query.slice(0, 400),
      hit_ids: hits.map((h) => h.id),
      hit_count: hits.length,
      method: "keyword",
      retrieved_by: actor.email?.trim() || actor.id,
    },
  });

  revalidatePath(`/requests/${requestId}`);

  return { ok: true, query, hits };
}
