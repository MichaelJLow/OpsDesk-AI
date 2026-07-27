/** Build a markdown audit summary for a request (desk evidence pack). */

export type EvidencePackRequest = {
  id: string;
  subject: string | null;
  sender_email: string;
  status: string;
  urgency: string | null;
  category: string | null;
  received_at: string;
};

export type EvidencePackExtraction = {
  validation_status: string;
  model_name: string | null;
  structured_output: {
    issueSummary?: string;
    siteReference?: string | null;
    urgency?: string;
    category?: string;
    suggestedRoute?: string;
  } | null;
};

export type EvidencePackAction = {
  id: string;
  action_type: string;
  status: string;
  risk_level: string | null;
  reason: string | null;
  payload: Record<string, unknown> | null;
};

export type EvidencePackJob = {
  id: string;
  job_type: string;
  title: string | null;
  status: string;
  lab_only: boolean;
  created_at: string;
};

export type EvidencePackEvent = {
  occurred_at: string;
  event_type: string;
  step_name: string | null;
  status: string;
  error: string | null;
  payload: unknown;
};

export type EvidencePackApproval = {
  decision: string;
  reviewer_id: string | null;
  reason: string | null;
  decided_at: string;
  proposed_action_id: string;
};

export type EvidencePackInput = {
  request: EvidencePackRequest;
  extraction: EvidencePackExtraction | null;
  actions: EvidencePackAction[];
  jobs: EvidencePackJob[];
  events: EvidencePackEvent[];
  approvals: EvidencePackApproval[];
  generatedAt: string;
};

function dash(value: string | null | undefined): string {
  const t = value?.trim();
  return t ? t : "—";
}

function shortPayloadNote(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "—";
  const p = payload as Record<string, unknown>;
  const bits: string[] = [];
  for (const key of [
    "note",
    "job_id",
    "via",
    "to",
    "billing",
    "lab_only",
    "executed_by",
    "sent_by",
    "reviewed_by",
  ]) {
    if (typeof p[key] === "string" || typeof p[key] === "boolean") {
      bits.push(`${key}=${String(p[key])}`);
    }
  }
  if (bits.length) return bits.slice(0, 4).join(", ");
  const keys = Object.keys(p).slice(0, 4);
  return keys.length ? `keys: ${keys.join(", ")}` : "—";
}

function actionSummary(action: EvidencePackAction): string {
  const p = action.payload ?? {};
  if (typeof p.draftText === "string" && p.draftText.trim()) {
    const oneLine = p.draftText.trim().replace(/\s+/g, " ");
    return oneLine.length > 120 ? `${oneLine.slice(0, 117)}…` : oneLine;
  }
  if (typeof p.summary === "string" && p.summary.trim()) {
    return p.summary.trim();
  }
  return dash(action.reason);
}

export function formatEvidencePackMarkdown(input: EvidencePackInput): string {
  const { request, extraction, actions, jobs, events, approvals, generatedAt } =
    input;
  const so = extraction?.structured_output;

  const lines: string[] = [
    `# OpsDesk evidence pack`,
    ``,
    `Generated: ${generatedAt}`,
    ``,
    `## Request`,
    ``,
    `| Field | Value |`,
    `|---|---|`,
    `| Id | \`${request.id}\` |`,
    `| Subject | ${dash(request.subject)} |`,
    `| Sender | ${dash(request.sender_email)} |`,
    `| Status | ${request.status} |`,
    `| Urgency | ${dash(request.urgency)} |`,
    `| Category | ${dash(request.category)} |`,
    `| Received | ${request.received_at} |`,
    ``,
    `## Extraction`,
    ``,
  ];

  if (!extraction) {
    lines.push(`No extraction recorded.`, ``);
  } else {
    lines.push(
      `| Field | Value |`,
      `|---|---|`,
      `| Validation | ${dash(extraction.validation_status)} |`,
      `| Model | ${dash(extraction.model_name)} |`,
      `| Issue | ${dash(so?.issueSummary)} |`,
      `| Site | ${dash(so?.siteReference ?? undefined)} |`,
      `| Urgency | ${dash(so?.urgency)} |`,
      `| Category | ${dash(so?.category)} |`,
      `| Route | ${dash(so?.suggestedRoute)} |`,
      ``,
    );
  }

  lines.push(`## Proposed actions`, ``);
  if (actions.length === 0) {
    lines.push(`None.`, ``);
  } else {
    for (const action of actions) {
      lines.push(
        `### ${action.action_type} (\`${action.id}\`)`,
        ``,
        `- Status: **${action.status}**`,
        `- Risk: ${dash(action.risk_level)}`,
        `- Summary: ${actionSummary(action)}`,
        ``,
      );
    }
  }

  lines.push(`## Approvals`, ``);
  if (approvals.length === 0) {
    lines.push(`None recorded in approvals table.`, ``);
  } else {
    for (const a of approvals) {
      lines.push(
        `- **${a.decision}** by ${dash(a.reviewer_id)} at ${a.decided_at}` +
          (a.reason ? ` — ${a.reason}` : "") +
          ` (action \`${a.proposed_action_id}\`)`,
      );
    }
    lines.push(``);
  }

  lines.push(`## Jobs`, ``);
  if (jobs.length === 0) {
    lines.push(`None.`, ``);
  } else {
    for (const job of jobs) {
      lines.push(
        `- \`${job.id}\` — ${job.job_type} · **${job.status}**` +
          (job.lab_only ? ` · lab_only` : "") +
          (job.title ? ` · ${job.title}` : "") +
          ` · ${job.created_at}`,
      );
    }
    lines.push(``);
  }

  lines.push(`## Timeline`, ``);
  if (events.length === 0) {
    lines.push(`No workflow events.`, ``);
  } else {
    for (const event of events) {
      const step = event.step_name ? ` · ${event.step_name}` : "";
      const err = event.error ? ` · error: ${event.error}` : "";
      lines.push(
        `- ${event.occurred_at} — **${event.event_type}**${step} · ${event.status}${err} · ${shortPayloadNote(event.payload)}`,
      );
    }
    lines.push(``);
  }

  lines.push(
    `---`,
    ``,
    `_Synthetic / lab demo data. This evidence pack is an audit view only — it does not send email, invoice, or dispatch._`,
    ``,
  );

  return lines.join("\n");
}
