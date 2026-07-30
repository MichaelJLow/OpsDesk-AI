import type { WorkflowEvent } from "@/lib/types";
import { eventLabel, humanizeToken, requestStatusLabel } from "@/lib/labels";

export type ActivityTone =
  | "human"
  | "system"
  | "hazard"
  | "success"
  | "failed"
  | "intake";

export type ActivityItem = {
  id: string;
  headline: string;
  detail: string;
  actor: string;
  tone: ActivityTone;
  statusLabel: string;
  occurredAt: string;
  error: string | null;
  rawPayload: unknown;
};

type ActivityContext = {
  residentName?: string | null;
  siteName?: string | null;
  unitName?: string | null;
  issueSummary?: string | null;
};

function payloadRecord(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return {};
}

function stringField(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function describeActivityEvent(
  event: WorkflowEvent,
  ctx: ActivityContext = {},
): ActivityItem {
  const type = event.event_type.trim();
  const step = event.step_name?.trim() || "";
  const payload = payloadRecord(event.payload);
  const editedBy =
    stringField(payload, "editedBy") ||
    stringField(payload, "actor") ||
    stringField(payload, "created_by");
  const site = ctx.siteName || "Site";
  const unit = ctx.unitName || null;
  const place = unit ? `${site} and ${unit}` : site;

  let headline = eventLabel(type, step);
  let detail = "";
  let actor = "OpsDesk";
  let tone: ActivityTone = "system";

  if (event.status === "error" || type === "needs_attention") {
    tone = "failed";
    headline = "Workflow failed";
    detail =
      event.error?.trim() ||
      "A connected system failed. Retry the failed step to continue.";
    actor = "OpsDesk";
  } else if (
    type === "draft_edited" ||
    type === "draft_updated" ||
    (step.includes("draft") && type.includes("edit"))
  ) {
    tone = "human";
    headline = "Reply draft edited";
    detail = editedBy
      ? `${editedBy} updated the resident response`
      : "Operator updated the resident response";
    actor = editedBy || "Operator";
  } else if (
    type === "route_escalated" ||
    step.includes("urgent") ||
    step.includes("hazard")
  ) {
    tone = "hazard";
    headline = "Escalated to urgent maintenance";
    detail = "Hazard route applied; Slack channel notified";
    actor = "OpsDesk";
  } else if (
    type === "slack_notified" ||
    step.includes("slack")
  ) {
    tone = "hazard";
    headline = "Slack escalation sent";
    detail = "Urgent maintenance channel notified";
    actor = "Slack";
  } else if (
    type === "request_stored" ||
    type === "received" ||
    step.includes("intake")
  ) {
    tone = "intake";
    headline = ctx.residentName
      ? `Request received from ${ctx.residentName}`
      : "Request received";
    detail =
      ctx.issueSummary?.trim() ||
      stringField(payload, "subject") ||
      "Inbound maintenance request stored";
    actor = ctx.residentName || "Resident";
  } else if (
    type === "extraction_completed" ||
    type === "extraction_validated" ||
    type === "extracted" ||
    step.includes("extract")
  ) {
    tone = "system";
    headline = "Request details extracted";
    detail = "Category, site, unit and access notes captured";
    actor = "OpsDesk";
  } else if (
    type === "retrieval_ran" ||
    step.includes("retrieval")
  ) {
    tone = "system";
    headline = "Policy evidence retrieved";
    detail = "Relevant site and policy notes attached to the draft";
    actor = "OpsDesk";
  } else if (
    type === "hubspot_enriched" ||
    type === "crm_enriched" ||
    (step.includes("hubspot") && event.status !== "error") ||
    step.includes("crm")
  ) {
    tone = "success";
    headline = `${place} verified`;
    detail = "Resident matched · Site active";
    actor = "HubSpot";
  } else if (
    type === "draft_proposed" ||
    (type.includes("draft") && step.includes("propos"))
  ) {
    tone = "system";
    headline = "Resident reply prepared";
    detail = "Grounded by policy evidence for this route";
    actor = "OpsDesk";
  } else if (type === "draft_approved" || step.includes("draft_approv")) {
    tone = "human";
    headline = "Reply approved";
    detail = editedBy
      ? `Approved by ${editedBy}`
      : "Operator approved the resident reply";
    actor = editedBy || "Operator";
  } else if (type === "draft_sent" || step.includes("send")) {
    tone = "success";
    headline = "Reply sent";
    detail = "Email delivered to the original resident";
    actor = "OpsDesk";
  } else if (
    type === "chargeable_approved" ||
    (type.includes("approv") && step.includes("chargeable"))
  ) {
    tone = "human";
    headline = "Authority approved";
    detail = editedBy
      ? `Authority recorded by ${editedBy}`
      : "Operational authority recorded. No invoice or contractor dispatch.";
    actor = editedBy || "Operator";
  } else if (
    type === "chargeable_rejected" ||
    (type.includes("reject") && step.includes("chargeable"))
  ) {
    tone = "failed";
    headline = "Authority rejected";
    detail = "Tenant-chargeable work was not authorised";
    actor = editedBy || "Operator";
  } else if (
    type === "execution_deferred" ||
    step.includes("chargeable")
  ) {
    tone = "system";
    headline = "Automatic execution paused";
    detail = "Tenant-chargeable work waiting for authority approval";
    actor = "OpsDesk";
  } else if (type === "work_order_created" || step.includes("work_order")) {
    tone = "success";
    headline = "Work order created";
    detail = "Simulated work order recorded for lab execution";
    actor = "OpsDesk";
  } else if (type === "validation_passed") {
    tone = "success";
    headline = "Validation passed";
    detail = "Structured fields passed Zod checks";
    actor = "OpsDesk";
  } else {
    // Fallbacks for unknown demo events with readable step names
    if (step.includes("route") || humanizeToken(type).includes("route")) {
      tone = "hazard";
      headline = "Escalated to urgent maintenance";
      detail = step ? `Route: ${humanizeToken(step)}` : "Route updated";
    } else if (step.includes("edit") || humanizeToken(type).includes("edit")) {
      tone = "human";
      headline = "Reply draft edited";
      detail = "Operator updated the resident response";
      actor = editedBy || "Operator";
    } else {
      detail = step ? humanizeToken(step) : "Workflow event recorded";
    }
  }

  const statusLabel =
    event.status === "success" || event.status === "ok"
      ? "Completed"
      : event.status === "error"
        ? "Failed"
        : requestStatusLabel(event.status);

  return {
    id: event.id,
    headline,
    detail,
    actor,
    tone,
    statusLabel,
    occurredAt: event.occurred_at,
    error: event.error,
    rawPayload: event.payload ?? {},
  };
}

export function summariseActivity(items: ActivityItem[]) {
  const escalations = items.filter((item) => item.tone === "hazard").length;
  const humanEdits = items.filter((item) => item.tone === "human").length;
  return {
    events: items.length,
    escalations,
    humanEdits,
  };
}
