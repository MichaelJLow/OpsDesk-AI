"use server";

import { revalidatePath } from "next/cache";
import { ensureServerEnv, getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";

export type RetryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function retryFailedRequest(input: {
  requestId: string;
}): Promise<RetryResult> {
  const { requestId } = input;

  if (!requestId) {
    return { ok: false, error: "Missing request id." };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in required to retry." };
  }

  ensureServerEnv();
  const webhookUrl = process.env.N8N_RETRY_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      ok: false,
      error:
        "N8N_RETRY_WEBHOOK_URL is not set in the monorepo root .env (n8n webhook for retry).",
    };
  }

  const supabase = getSupabaseAdmin();

  const { data: request, error: loadError } = await supabase
    .from("requests")
    .select("id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (loadError) {
    return { ok: false, error: loadError.message };
  }

  if (!request) {
    return { ok: false, error: "Request not found." };
  }

  const { data: latestError } = await supabase
    .from("workflow_events")
    .select("id, event_type, step_name, error, status")
    .eq("request_id", requestId)
    .eq("status", "error")
    .order("occurred_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (request.status !== "needs_attention" && !latestError) {
    return {
      ok: false,
      error:
        "Retry only applies when status is needs_attention or an error event exists.",
    };
  }

  const triggeredBy = user.email?.trim() || user.id;

  let webhookResponse: Response;
  try {
    webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET
          ? { "x-opsdesk-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        requestId,
        triggeredBy,
        lastErrorEventId: latestError?.id ?? null,
        lastStep: latestError?.step_name ?? null,
      }),
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `n8n retry webhook unreachable: ${error.message}`
          : "n8n retry webhook unreachable",
    };
  }

  if (!webhookResponse.ok) {
    const detail = await webhookResponse.text().catch(() => "");
    return {
      ok: false,
      error: `n8n retry webhook failed (${webhookResponse.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    };
  }

  await supabase
    .from("requests")
    .update({ status: "processing" })
    .eq("id", requestId);

  await supabase.from("workflow_events").insert({
    request_id: requestId,
    event_type: "retry_requested",
    step_name: "dashboard",
    status: "success",
    payload: {
      triggered_by: triggeredBy,
      last_error_event_id: latestError?.id ?? null,
      via: "n8n_retry_webhook",
    },
  });

  revalidatePath("/");
  revalidatePath(`/requests/${requestId}`);

  return { ok: true };
}
