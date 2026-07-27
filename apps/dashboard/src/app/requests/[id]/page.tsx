import Link from "next/link";
import { notFound } from "next/navigation";
import { lookupHubSpotContactByEmail } from "@/lib/hubspot";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  OpsCompany,
  OpsContact,
  OpsJob,
  OpsRequest,
  OpsSite,
  ProposedAction,
  RequestExtraction,
  StructuredExtraction,
  WorkflowEvent,
} from "@/lib/types";
import { CaseToolsDisclosure } from "./case-tools";
import { CrmContextPanel } from "./crm-panel";
import { DecisionForm } from "./decision-form";
import { DraftReplyPanel } from "./draft-reply-panel";
import { EvidencePackForm } from "./evidence-pack-form";
import { ExecuteWorkOrderForm } from "./execute-form";
import { FailureBanner } from "./failure-banner";
import { RetrievalPanel } from "./retrieval-panel";
import {
  requestStatusBadgeClass,
  urgencyBadgeClass,
} from "@/lib/status";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function badgeClass(status: string) {
  return requestStatusBadgeClass(status);
}

function humanizeToken(value: string) {
  return value.replace(/_/g, " ");
}

function CaseChips({
  request,
  extraction,
}: {
  request: OpsRequest;
  extraction: RequestExtraction | null;
}) {
  const data = extraction?.structured_output;
  const category =
    (typeof data?.category === "string" && data.category) ||
    request.category ||
    null;
  const site =
    typeof data?.siteReference === "string" && data.siteReference.trim()
      ? data.siteReference.trim()
      : null;
  const route =
    typeof data?.suggestedRoute === "string" && data.suggestedRoute.trim()
      ? data.suggestedRoute.trim()
      : null;
  const urgency =
    (typeof data?.urgency === "string" && data.urgency) ||
    request.urgency ||
    null;

  const chips: Array<{ key: string; label: string; value: string; className?: string }> =
    [];

  if (category) {
    chips.push({
      key: "category",
      label: "Category",
      value: humanizeToken(category),
      className:
        category === "urgent_hazardous"
          ? "badge badge-urgent"
          : category === "controlled_chargeable"
            ? "badge badge-chargeable"
            : "badge",
    });
  }
  if (urgency) {
    chips.push({
      key: "urgency",
      label: "Urgency",
      value: humanizeToken(urgency),
      className: urgencyBadgeClass(urgency, category),
    });
  }
  if (site) {
    chips.push({
      key: "site",
      label: "Site",
      value: site,
      className: "badge",
    });
  }
  if (route) {
    chips.push({
      key: "route",
      label: "Route",
      value: humanizeToken(route),
      className: "badge",
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul className="case-chips">
      {chips.map((chip) => (
        <li key={chip.key}>
          <span className="case-chip-label">{chip.label}</span>
          <span className={chip.className}>{chip.value}</span>
        </li>
      ))}
    </ul>
  );
}

function ExtractionFields({ data }: { data: StructuredExtraction | null }) {
  if (!data) {
    return <p className="muted">No structured fields.</p>;
  }

  const rows: Array<[string, string]> = [
    ["Category", String(data.category ?? "—")],
    ["Urgency", String(data.urgency ?? "—")],
    ["Route", String(data.suggestedRoute ?? "—")],
    ["Site", String(data.siteReference ?? "—")],
    ["Unit", String(data.unitReference ?? "—")],
    ["Asset", String(data.assetType ?? "—")],
    ["Issue", String(data.issueSummary ?? "—")],
    ["Access", String(data.accessNotes ?? "—")],
    [
      "Heating OK",
      data.heatingStillWorking === null || data.heatingStillWorking === undefined
        ? "—"
        : data.heatingStillWorking
          ? "Yes"
          : "No",
    ],
    [
      "Missing",
      Array.isArray(data.missingInformation) && data.missingInformation.length
        ? data.missingInformation.join(", ")
        : "—",
    ],
  ];

  return (
    <dl className="kv">
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: "contents" }}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function RequestWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .select(
      "id, external_message_id, sender_email, subject, raw_body, category, confidence, status, urgency, received_at, created_at, company_id, contact_id",
    )
    .eq("id", id)
    .maybeSingle();

  if (requestError) {
    return (
      <main>
        <div className="error-banner" role="alert">
          {requestError.message}
        </div>
        <Link href="/">Back to inbox</Link>
      </main>
    );
  }

  if (!request) {
    notFound();
  }

  const typedRequest = request as OpsRequest;

  const [
    { data: extractions },
    { data: actions },
    { data: chargeableActions },
    { data: events },
    { data: jobs },
  ] = await Promise.all([
    supabase
      .from("request_extractions")
      .select(
        "id, request_id, model_provider, model_name, prompt_version, structured_output, validation_status, created_at",
      )
      .eq("request_id", id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("proposed_actions")
      .select(
        "id, request_id, action_type, payload, reason, risk_level, requires_approval, status, created_at",
      )
      .eq("request_id", id)
      .eq("action_type", "draft_reply")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("proposed_actions")
      .select(
        "id, request_id, action_type, payload, reason, risk_level, requires_approval, status, created_at",
      )
      .eq("request_id", id)
      .eq("action_type", "chargeable_work")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("workflow_events")
      .select(
        "id, request_id, event_type, step_name, status, payload, error, occurred_at",
      )
      .eq("request_id", id)
      .order("occurred_at", { ascending: false })
      .limit(20),
    supabase
      .from("jobs")
      .select(
        "id, request_id, proposed_action_id, job_type, title, status, lab_only, payload, created_by, created_at",
      )
      .eq("request_id", id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const extraction = (extractions?.[0] ?? null) as RequestExtraction | null;
  const draft = (actions?.[0] ?? null) as ProposedAction | null;
  const chargeable = (chargeableActions?.[0] ?? null) as ProposedAction | null;
  const timeline = (events ?? []) as WorkflowEvent[];
  const labJobs = (jobs ?? []) as OpsJob[];
  const chargeableJob =
    labJobs.find((job) => job.proposed_action_id === chargeable?.id) ??
    labJobs[0] ??
    null;
  const latestError =
    timeline.find((event) => event.status === "error") ?? null;
  const draftText =
    typeof draft?.payload?.draftText === "string"
      ? draft.payload.draftText
      : null;
  const draftCitations = Array.isArray(draft?.payload?.citations)
    ? (draft.payload.citations as Array<{
        id?: string;
        title?: string;
        snippet?: string;
        namespace?: string;
        score?: number;
      }>)
    : null;
  const chargeableSummary =
    typeof chargeable?.payload?.summary === "string"
      ? chargeable.payload.summary
      : typeof chargeable?.reason === "string"
        ? chargeable.reason
        : null;

  const extractedSite =
    typeof extraction?.structured_output?.siteReference === "string"
      ? extraction.structured_output.siteReference.trim()
      : null;

  let contact: OpsContact | null = null;
  if (typedRequest.contact_id) {
    const { data } = await supabase
      .from("contacts")
      .select(
        "id, name, email, role, authorised_for_account_changes, company_id",
      )
      .eq("id", typedRequest.contact_id)
      .maybeSingle();
    contact = (data as OpsContact | null) ?? null;
  }
  if (!contact && typedRequest.sender_email) {
    const { data } = await supabase
      .from("contacts")
      .select(
        "id, name, email, role, authorised_for_account_changes, company_id",
      )
      .eq("email", typedRequest.sender_email)
      .maybeSingle();
    contact = (data as OpsContact | null) ?? null;
  }

  const companyId = typedRequest.company_id || contact?.company_id || null;
  let company: OpsCompany | null = null;
  if (companyId) {
    const { data } = await supabase
      .from("companies")
      .select("id, name, domain, industry, lifecycle_stage, status")
      .eq("id", companyId)
      .maybeSingle();
    company = (data as OpsCompany | null) ?? null;
  }

  let site: OpsSite | null = null;
  if (extractedSite) {
    const { data } = await supabase
      .from("sites")
      .select("id, name, address_line, status")
      .ilike("name", extractedSite)
      .maybeSingle();
    site = (data as OpsSite | null) ?? null;
  }

  const hubspot = await lookupHubSpotContactByEmail(typedRequest.sender_email);

  return (
    <main className="stack">
      <header className="case-header">
        <p className="workspace-back">
          <Link href="/">← Operations inbox</Link>
        </p>
        <h1 className="workspace-title">
          {typedRequest.subject?.trim() || "(no subject)"}
        </h1>
        <p className="muted case-meta">
          {typedRequest.sender_email} · {formatWhen(typedRequest.received_at)} ·{" "}
          <span className={requestStatusBadgeClass(typedRequest.status)}>
            {typedRequest.status}
          </span>
        </p>
        <CaseChips request={typedRequest} extraction={extraction} />
      </header>

      <FailureBanner
        requestId={typedRequest.id}
        requestStatus={typedRequest.status}
        latestError={latestError}
      />

      <div className="grid-2">
        <section className="panel">
          <h2>Inbound message</h2>
          <pre className="pre">{typedRequest.raw_body || "(empty body)"}</pre>
        </section>

        <CrmContextPanel
          senderEmail={typedRequest.sender_email}
          hubspot={hubspot}
          contact={contact}
          company={company}
          site={site}
          extractedSite={extractedSite}
        />
      </div>

      <div className="decide-grid">
        <section className="panel panel-decide">
          <h2>Draft reply</h2>
          {draft ? (
            <DraftReplyPanel
              proposedActionId={draft.id}
              requestId={typedRequest.id}
              status={draft.status}
              riskLevel={draft.risk_level}
              draftText={draftText}
              citations={draftCitations}
              editedBy={
                typeof draft.payload?.editedBy === "string"
                  ? draft.payload.editedBy
                  : null
              }
            />
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              No draft reply proposed yet.
            </p>
          )}
        </section>

        <section className="panel panel-quiet">
          <h2>Extraction</h2>
          {extraction ? (
            <>
              <p className="muted extraction-meta">
                {extraction.validation_status
                  ? `Validated: ${extraction.validation_status}`
                  : "Structured fields from intake"}
              </p>
              <ExtractionFields data={extraction.structured_output} />
            </>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              No extraction stored for this request yet.
            </p>
          )}
        </section>
      </div>

      {chargeable ? (
        <section className="panel panel-decide">
          <h2>Chargeable work: approval required</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Status{" "}
            <span className={badgeClass(chargeable.status)}>
              {chargeable.status}
            </span>
            {chargeable.risk_level ? ` · risk ${chargeable.risk_level}` : null}
            {" · "}
            <span className="badge badge-chargeable">HITL</span>
          </p>
          <pre className="pre">
            {chargeableSummary ||
              "(no chargeable summary in payload — see reason / extraction)"}
          </pre>
          {chargeable.status === "proposed" ? (
            <>
              <p className="muted">
                Approve records landlord/ops authority. This does{" "}
                <strong>not</strong> invoice or dispatch contractors.
              </p>
              <DecisionForm
                proposedActionId={chargeable.id}
                requestId={typedRequest.id}
                mode="chargeable_work"
              />
            </>
          ) : chargeable.status === "approved" && chargeableJob ? (
            <div>
              <p className="muted" style={{ marginBottom: 8 }}>
                Lab work order created.{" "}
                <strong>Lab execution only — no billing.</strong>
              </p>
              <dl className="kv">
                <div style={{ display: "contents" }}>
                  <dt>Job id</dt>
                  <dd>
                    <code>{chargeableJob.id}</code>
                  </dd>
                </div>
                <div style={{ display: "contents" }}>
                  <dt>Status</dt>
                  <dd>{chargeableJob.status}</dd>
                </div>
                <div style={{ display: "contents" }}>
                  <dt>Type</dt>
                  <dd>{chargeableJob.job_type}</dd>
                </div>
              </dl>
            </div>
          ) : chargeable.status === "approved" &&
            typedRequest.status === "awaiting_execution" ? (
            <ExecuteWorkOrderForm
              proposedActionId={chargeable.id}
              requestId={typedRequest.id}
            />
          ) : chargeable.status === "approved" ? (
            <p className="muted" style={{ marginBottom: 0 }}>
              Approved — execution deferred (no auto-invoice or dispatch).
            </p>
          ) : (
            <p className="muted" style={{ marginBottom: 0 }}>
              Decision recorded as <strong>{chargeable.status}</strong>.
            </p>
          )}
        </section>
      ) : null}

      <section className="panel panel-audit">
        <h2>Audit trail</h2>
        <p className="muted panel-lede">
          Workflow events for this case. Who decided what, and when.
        </p>
        {timeline.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No workflow events for this request.
          </p>
        ) : (
          <ul className="timeline">
            {timeline.map((event) => (
              <li
                key={event.id}
                className={
                  event.status === "error" ? "timeline-error" : undefined
                }
              >
                <strong>{event.event_type}</strong>
                {event.step_name ? ` · ${event.step_name}` : null}
                {" · "}
                <span className={requestStatusBadgeClass(event.status)}>
                  {event.status}
                </span>
                <div className="muted mono">{formatWhen(event.occurred_at)}</div>
                {event.error ? (
                  <div style={{ color: "var(--danger)" }}>{event.error}</div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <CaseToolsDisclosure>
        <div className="case-tools-grid">
          <div>
            <h3 className="panel-subhead">Context retrieval</h3>
            <RetrievalPanel requestId={typedRequest.id} />
          </div>
          <div>
            <h3 className="panel-subhead">Evidence pack</h3>
            <EvidencePackForm requestId={typedRequest.id} />
          </div>
        </div>
      </CaseToolsDisclosure>
    </main>
  );
}
