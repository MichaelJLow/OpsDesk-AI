import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { OpsRequest } from "@/lib/types";

export async function loadInboxRequests(limit = 50): Promise<{
  requests: OpsRequest[];
  loadError: string | null;
  approvalCount: number;
  attentionCount: number;
}> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("requests")
      .select(
        "id, external_message_id, sender_email, subject, raw_body, category, confidence, status, urgency, received_at, created_at",
      )
      .order("received_at", { ascending: false })
      .limit(limit);

    if (error) {
      return {
        requests: [],
        loadError: error.message,
        approvalCount: 0,
        attentionCount: 0,
      };
    }

    const requests = (data ?? []) as OpsRequest[];
    const approvalCount = requests.filter(
      (r) =>
        r.category === "controlled_chargeable" &&
        (r.status === "proposed" || r.status === "awaiting_execution"),
    ).length;
    const attentionCount = requests.filter(
      (r) => r.status === "needs_attention",
    ).length;

    return { requests, loadError: null, approvalCount, attentionCount };
  } catch (error) {
    return {
      requests: [],
      loadError:
        error instanceof Error ? error.message : "Failed to load requests",
      approvalCount: 0,
      attentionCount: 0,
    };
  }
}

export function parseQueueFilter(
  value: string | string[] | undefined,
): "all" | "hazards" | "approvals" | "failed" {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "hazards" || raw === "approvals" || raw === "failed") return raw;
  return "all";
}
