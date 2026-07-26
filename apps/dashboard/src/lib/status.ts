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

export function isAttentionStatus(status: string): boolean {
  return status === "needs_attention";
}
