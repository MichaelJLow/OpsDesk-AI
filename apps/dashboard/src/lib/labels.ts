/** Operator-facing labels for OpsDesk (hide implementation tokens). */

const CATEGORY_LABELS: Record<string, string> = {
  routine_maintenance: "Routine maintenance",
  urgent_hazardous: "Hazard",
  controlled_chargeable: "Chargeable work",
  unknown: "Needs classification",
};

const URGENCY_LABELS: Record<string, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  critical: "Critical",
};

const ROUTE_LABELS: Record<string, string> = {
  maintenance_intake: "Maintenance intake",
  urgent_maintenance: "Urgent maintenance",
  approval_queue: "Approval required",
  human_triage: "Human triage",
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
  received: "Received",
  proposed: "Proposed",
  approved: "Approved",
  rejected: "Rejected",
  sent: "Sent",
  awaiting_execution: "Ready for work order",
  executed_lab: "Work order created",
  needs_attention: "Workflow failed",
  error: "Error",
};

const ACTION_STATUS_LABELS: Record<string, string> = {
  proposed: "Proposed",
  approved: "Approved",
  rejected: "Rejected",
  sent: "Sent",
};

const EVENT_LABELS: Record<string, string> = {
  request_stored: "Request received",
  execution_deferred: "Automatic execution paused",
  draft_proposed: "Resident reply prepared",
  draft_approved: "Reply approved",
  draft_rejected: "Reply rejected",
  draft_sent: "Reply sent",
  chargeable_approved: "Authority approved",
  chargeable_rejected: "Authority rejected",
  work_order_created: "Work order created",
  extraction_completed: "Request details extracted",
  validation_passed: "Validation passed",
  hubspot_enriched: "CRM context verified",
  slack_notified: "Slack escalation sent",
  retry_requested: "Retry requested",
  needs_attention: "Workflow failed",
};

export function humanizeToken(value: string | null | undefined): string {
  if (!value?.trim()) return "—";
  return value.replace(/_/g, " ");
}

export function categoryLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return CATEGORY_LABELS[value] ?? humanizeToken(value);
}

export function urgencyLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return URGENCY_LABELS[value] ?? humanizeToken(value);
}

export function routeLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return ROUTE_LABELS[value] ?? humanizeToken(value);
}

export function requestStatusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return REQUEST_STATUS_LABELS[status] ?? humanizeToken(status);
}

export function actionStatusLabel(status: string | null | undefined): string {
  if (!status) return "—";
  return ACTION_STATUS_LABELS[status] ?? humanizeToken(status);
}

export function eventLabel(
  eventType: string,
  stepName?: string | null,
): string {
  const key = eventType.trim();
  if (EVENT_LABELS[key]) return EVENT_LABELS[key];
  if (stepName && EVENT_LABELS[stepName]) return EVENT_LABELS[stepName];
  if (key === "execution_deferred" && stepName === "chargeable_approval") {
    return "Automatic execution paused";
  }
  if (key === "request_stored") return "Request received";
  return humanizeToken(key);
}

/** Compact queue-row operational state for triage. */
export function queueStateLabel(request: {
  status: string;
  category?: string | null;
  urgency?: string | null;
}): { label: string; tone: "hazard" | "approval" | "draft" | "proposed" | "sent" | "failed" | "neutral" } {
  if (request.status === "needs_attention") {
    return { label: "Workflow failed", tone: "failed" };
  }
  if (request.category === "urgent_hazardous") {
    return { label: "Hazard", tone: "hazard" };
  }
  if (
    request.status === "awaiting_execution" ||
    (request.category === "controlled_chargeable" &&
      (request.status === "proposed" || request.status === "approved"))
  ) {
    if (request.status === "awaiting_execution") {
      return { label: "Ready for work order", tone: "approval" };
    }
    if (request.status === "proposed") {
      return { label: "Approval needed", tone: "approval" };
    }
  }
  if (request.status === "proposed") {
    return { label: "Proposed", tone: "proposed" };
  }
  if (request.status === "approved") {
    return { label: "Draft ready", tone: "draft" };
  }
  if (request.status === "sent") {
    return { label: "Sent", tone: "sent" };
  }
  if (request.status === "executed_lab") {
    return { label: "Work order created", tone: "sent" };
  }
  if (request.status === "rejected") {
    return { label: "Rejected", tone: "failed" };
  }
  return { label: requestStatusLabel(request.status), tone: "neutral" };
}

export function caseStatusLabel(request: {
  status: string;
  category?: string | null;
}): string {
  if (
    request.category === "controlled_chargeable" &&
    request.status === "proposed"
  ) {
    return "Awaiting approval";
  }
  if (request.status === "awaiting_execution") {
    return "Ready for work order";
  }
  return requestStatusLabel(request.status);
}
