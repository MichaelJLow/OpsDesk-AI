/** Shared request/action status badge class names. */
export function requestStatusBadgeClass(status: string): string {
  if (status === "needs_attention") return "badge badge-attention";
  if (status === "proposed") return "badge badge-proposed";
  if (status === "approved") return "badge badge-approved";
  if (status === "rejected") return "badge badge-rejected";
  if (status === "sent") return "badge badge-sent";
  if (status === "error") return "badge badge-attention";
  return "badge";
}

export function urgencyBadgeClass(
  urgency: string | null | undefined,
  category?: string | null,
): string {
  if (category === "urgent_hazardous") return "badge badge-urgent";
  if (urgency === "critical") return "badge badge-urgent";
  if (urgency === "high") return "badge badge-urgent-soft";
  return "badge";
}

export function isUrgentRequest(
  urgency: string | null | undefined,
  category?: string | null,
): boolean {
  return (
    category === "urgent_hazardous" ||
    urgency === "critical" ||
    urgency === "high"
  );
}

export function isAttentionStatus(status: string): boolean {
  return status === "needs_attention";
}
