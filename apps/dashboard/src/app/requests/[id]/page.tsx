import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { ActionDock } from "@/app/components/action-dock";
import { CaseTabs } from "@/app/components/case-tabs";
import { RequestQueue } from "@/app/components/request-queue";
import { lookupHubSpotContactByEmail } from "@/lib/hubspot";
import { loadInboxRequests, parseQueueFilter } from "@/lib/inbox";
import { formatWhen } from "@/lib/format";
import {
  caseStatusLabel,
  categoryLabel,
  eventLabel,
  requestStatusLabel,
  routeLabel,
  urgencyLabel,
} from "@/lib/labels";
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
import { DraftReplyPanel } from "./draft-reply-panel";
import { EvidencePackForm } from "./evidence-pack-form";
import { FailureBanner } from "./failure-banner";
import { RetrievalPanel } from "./retrieval-panel";
import { DecisionForm } from "./decision-form";
import { requestStatusBadgeClass } from "@/lib/status";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ filter?: string | string[] }>;
};

function ExtractionFields({ data }: { data: StructuredExtraction | null }) {
  if (!data) {
    return <p className="muted">No structured fields.</p>;
  }

  const rows: Array<[string, string]> = [
    ["Category", categoryLabel(String(data.category ?? ""))],
    ["Urgency", urgencyLabel(String(data.urgency ?? ""))],
    ["Route", routeLabel(String(data.suggestedRoute ?? ""))],
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

function CaseFactsCompact({ data }: { data: StructuredExtraction | null }) {
  const rows: Array<[string, string]> = [
    ["Category", categoryLabel(data?.category ? String(data.category) : null)],
    ["Site", String(data?.siteReference ?? "—")],
    ["Unit", String(data?.unitReference ?? "—")],
    ["Asset", String(data?.assetType ?? "—")],
    ["Access", String(data?.accessNotes ?? "—")],
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

export default async function RequestWorkspacePage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const filter = parseQueueFilter(sp.filter);
  const { requests, loadError } = await loadInboxRequests();

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
      <div className="desk">
        <RequestQueue requests={requests} selectedId={id} filter={filter} />
        <div className="case-canvas">
          <div className="case-scroll">
            <div className="error-banner" role="alert">
              {requestError.message}
            </div>
            <Link href="/">Back to requests</Link>
          </div>
        </div>
      </div>
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

  const extractedSite =
    typeof extraction?.structured_output?.siteReference === "string"
      ? extraction.structured_output.siteReference.trim()
      : null;
  const extractedUnit =
    typeof extraction?.structured_output?.unitReference === "string"
      ? extraction.structured_output.unitReference.trim()
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
  const residentName =
    hubspot?.fullName ||
    contact?.name ||
    typedRequest.sender_email.split("@")[0] ||
    "Resident";

  const isHazard = typedRequest.category === "urgent_hazardous";
  const isChargeable = typedRequest.category === "controlled_chargeable";
  const chargeableNeedsApproval =
    Boolean(chargeable) && chargeable?.status === "proposed";
  const chargeableReadyToExecute =
    Boolean(chargeable) &&
    chargeable?.status === "approved" &&
    typedRequest.status === "awaiting_execution";
  const sendLocked = chargeableNeedsApproval;

  const confidence =
    typeof typedRequest.confidence === "number"
      ? Math.round(typedRequest.confidence * 100)
      : typeof extraction?.structured_output?.confidence === "number"
        ? Math.round(Number(extraction.structured_output.confidence) * 100)
        : null;

  let dockMode: ComponentProps<typeof ActionDock>["mode"] = {
    kind: "idle",
    message: "No pending decision on this case.",
  };
  if (typedRequest.status === "needs_attention") {
    dockMode = { kind: "retry", requestId: typedRequest.id };
  } else if (chargeableNeedsApproval && chargeable) {
    dockMode = {
      kind: "chargeable_approve",
      proposedActionId: chargeable.id,
      requestId: typedRequest.id,
    };
  } else if (chargeableReadyToExecute && chargeable) {
    dockMode = {
      kind: "chargeable_execute",
      proposedActionId: chargeable.id,
      requestId: typedRequest.id,
    };
  } else if (draft?.status === "proposed") {
    dockMode = {
      kind: "draft_approve",
      proposedActionId: draft.id,
      requestId: typedRequest.id,
    };
  } else if (draft?.status === "approved") {
    dockMode = {
      kind: "draft_send",
      proposedActionId: draft.id,
      requestId: typedRequest.id,
    };
  }

  const overview = (
    <div className="case-grid">
      <div>
        <section className="section-block">
          <h3>Resident message</h3>
          <pre className="message-body">
            {typedRequest.raw_body || "(empty body)"}
          </pre>
          <div className="attachment-row">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a2 2 0 1 1-2.83-2.83l7.78-7.78" />
            </svg>
            email-thread.txt
          </div>
        </section>

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
            embedActions={!chargeableNeedsApproval}
            sendLocked={sendLocked}
          />
        ) : (
          <section className="section-block">
            <h3>Proposed reply</h3>
            <p className="muted" style={{ margin: 0 }}>
              No draft reply proposed yet.
            </p>
          </section>
        )}
      </div>

      <aside className="evidence-rail" aria-label="Case evidence">
        <div className="section-block flat">
          <h3>Case facts</h3>
          <CaseFactsCompact data={extraction?.structured_output ?? null} />
        </div>

        <div className="section-block flat">
          <h3>Verified context</h3>
          <ul className="verify-list">
            <li>
              <span className="verify-ok" aria-hidden="true">
                {contact || hubspot ? "✓" : "·"}
              </span>
              <span>
                Resident{" "}
                <strong>
                  {contact || hubspot ? "Matched" : "Not matched"}
                </strong>
                {residentName ? ` · ${residentName}` : ""}
              </span>
            </li>
            <li>
              <span className="verify-ok" aria-hidden="true">
                {site ? "✓" : "·"}
              </span>
              <span>
                Site{" "}
                <strong>
                  {site
                    ? site.status === "active"
                      ? "Active"
                      : site.status
                    : extractedSite
                      ? "Unverified"
                      : "Unknown"}
                </strong>
                {extractedSite ? ` · ${extractedSite}` : ""}
              </span>
            </li>
            <li>
              <span className="verify-ok" aria-hidden="true">
                ·
              </span>
              <span>
                Authorised changes{" "}
                <strong>
                  {contact
                    ? contact.authorised_for_account_changes
                      ? "Yes"
                      : "No"
                    : "—"}
                </strong>
              </span>
            </li>
          </ul>
        </div>

        <div className="section-block flat" style={{ borderBottom: "none" }}>
          <h3>Policy evidence</h3>
          {draftCitations && draftCitations.length > 0 ? (
            draftCitations.map((c, i) => (
              <div className="policy-card" key={c.id || String(i)}>
                <span className="badge">Policy</span>
                <strong>{c.title || "Policy citation"}</strong>
                <p>{c.snippet || "Internal policy used to ground this reply."}</p>
              </div>
            ))
          ) : isChargeable ? (
            <div className="policy-card">
              <span className="badge">Policy</span>
              <strong>Chargeable works policy</strong>
              <p>
                Tenant-chargeable work requires recorded operational authority
                before a work order is created. No invoice or contractor
                dispatch occurs at approval.
              </p>
            </div>
          ) : (
            <p className="muted" style={{ margin: 0, fontSize: "0.8rem" }}>
              No policy citations attached to this draft.
            </p>
          )}
        </div>
      </aside>
    </div>
  );

  const conversation = (
    <div>
      <section className="section-block">
        <h3>Resident message</h3>
        <pre className="message-body">
          {typedRequest.raw_body || "(empty body)"}
        </pre>
      </section>
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
          embedActions
          sendLocked={sendLocked}
        />
      ) : null}
    </div>
  );

  const evidence = (
    <div className="case-grid">
      <section className="section-block">
        <h3>Case facts</h3>
        {extraction ? (
          <>
            <p className="muted" style={{ marginTop: 0, fontSize: "0.8rem" }}>
              Validation: {extraction.validation_status || "—"}
              {confidence != null ? ` · Confidence ${confidence}%` : ""}
            </p>
            <ExtractionFields data={extraction.structured_output} />
          </>
        ) : (
          <p className="muted">No extraction stored for this request yet.</p>
        )}
        <details className="tech-details">
          <summary>Technical details</summary>
          <pre>
            {JSON.stringify(
              {
                category: typedRequest.category,
                urgency: typedRequest.urgency,
                status: typedRequest.status,
                structured_output: extraction?.structured_output ?? null,
              },
              null,
              2,
            )}
          </pre>
        </details>
      </section>
      <aside className="evidence-rail">
        <div className="section-block flat">
          <h3>Organisation</h3>
          <dl className="kv">
            <div style={{ display: "contents" }}>
              <dt>Name</dt>
              <dd>{company?.name || hubspot?.company || "—"}</dd>
            </div>
            <div style={{ display: "contents" }}>
              <dt>Domain</dt>
              <dd>{company?.domain || "—"}</dd>
            </div>
            <div style={{ display: "contents" }}>
              <dt>Status</dt>
              <dd>{company?.status || "—"}</dd>
            </div>
          </dl>
        </div>
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
      </aside>
    </div>
  );

  const activity = (
    <section className="section-block">
      <h3>Activity</h3>
      <p className="muted" style={{ marginTop: 0, fontSize: "0.8rem" }}>
        Operational timeline for this case. Who decided what, and when.
      </p>
      {timeline.length === 0 ? (
        <p className="muted">No workflow events for this request.</p>
      ) : (
        <ul className="timeline">
          {timeline.map((event) => (
            <li
              key={event.id}
              className={event.status === "error" ? "timeline-error" : undefined}
            >
              <strong>
                {eventLabel(event.event_type, event.step_name)}
              </strong>
              {" · "}
              <span className={requestStatusBadgeClass(event.status)}>
                {requestStatusLabel(event.status)}
              </span>
              <div className="activity-actor">
                {formatWhen(event.occurred_at)}
                {event.step_name
                  ? ` · Actor: OpsDesk · ${event.step_name.replace(/_/g, " ")}`
                  : " · Actor: OpsDesk"}
              </div>
              {event.error ? (
                <div style={{ color: "var(--danger)", marginTop: "0.25rem" }}>
                  {event.error}
                </div>
              ) : null}
              <details className="tech-details">
                <summary>Raw event</summary>
                <pre>{JSON.stringify(event.payload ?? {}, null, 2)}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <div className="desk">
      <RequestQueue
        requests={requests}
        selectedId={typedRequest.id}
        filter={filter}
      />

      <div className="case-canvas">
        <div className="case-scroll">
          {loadError ? (
            <div className="error-banner" role="alert">
              Could not refresh queue: {loadError}
            </div>
          ) : null}

          <p className="breadcrumb">
            <Link href="/">Requests</Link>
            {" / "}
            {extractedSite || site?.name || "Site"}
            {extractedUnit ? ` / ${extractedUnit}` : ""}
          </p>

          <header className="case-header">
            <div>
              <h1>
                {typedRequest.subject?.trim() || "(no subject)"}
              </h1>
              <p className="case-header-meta">
                <span>{residentName}</span>
                <span aria-hidden="true">·</span>
                <span>received {formatWhen(typedRequest.received_at)}</span>
                <span
                  className={requestStatusBadgeClass(typedRequest.status)}
                >
                  {caseStatusLabel(typedRequest)}
                </span>
              </p>
            </div>
            <div className="case-header-aside">
              {isHazard || chargeableNeedsApproval ? (
                <span className="sla-chip">Respond by 14:00</span>
              ) : null}
            </div>
          </header>

          <FailureBanner
            requestId={typedRequest.id}
            requestStatus={typedRequest.status}
            latestError={latestError}
          />

          {chargeableNeedsApproval && chargeable ? (
            <div className="decision-banner">
              <div>
                <p className="decision-kicker">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
                  </svg>
                  Authority required
                </p>
                <h2>Tenant-chargeable work needs approval</h2>
                <p>
                  Approving records operational authority only. No invoice or
                  contractor dispatch will occur.
                </p>
                <div className="decision-meta">
                  <span>
                    Risk: <strong>{chargeable.risk_level || "medium"}</strong>
                  </span>
                  <span>
                    Policy: <strong>Chargeable works</strong>
                  </span>
                  <span>
                    Resident authority:{" "}
                    <strong>
                      {contact?.authorised_for_account_changes
                        ? "Verified"
                        : "Not verified"}
                    </strong>
                  </span>
                  <span>
                    Site:{" "}
                    <strong>
                      {site?.status === "active" ? "Active" : site?.status || "—"}
                    </strong>
                  </span>
                  <span>
                    Route:{" "}
                    <strong>
                      {routeLabel(
                        extraction?.structured_output?.suggestedRoute
                          ? String(extraction.structured_output.suggestedRoute)
                          : "approval_queue",
                      )}
                    </strong>
                  </span>
                  {confidence != null ? (
                    <span>
                      Confidence: <strong>{confidence}%</strong>
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="decision-actions">
                <DecisionForm
                  proposedActionId={chargeable.id}
                  requestId={typedRequest.id}
                  mode="chargeable_work"
                  compact
                />
              </div>
            </div>
          ) : null}

          {isHazard && !chargeableNeedsApproval ? (
            <div className="decision-banner hazard">
              <div>
                <p className="decision-kicker">Safety escalation</p>
                <h2>Hazard reported — prioritise resident safety</h2>
                <p>
                  Water near electrics or similar hazards should be escalated
                  immediately. Confirm Slack notification and next safe action.
                </p>
              </div>
            </div>
          ) : null}

          {typedRequest.status === "needs_attention" ? (
            <div className="decision-banner failed">
              <div>
                <p className="decision-kicker">Workflow failed</p>
                <h2>Integration failure needs attention</h2>
                <p>
                  {latestError?.error?.trim() ||
                    "A connected system failed. Retry the failed step to continue."}
                </p>
              </div>
            </div>
          ) : null}

          {chargeable &&
          chargeable.status === "approved" &&
          chargeableJob ? (
            <div className="section-block" style={{ marginBottom: "0.9rem" }}>
              <h3>Simulated work order</h3>
              <p className="muted" style={{ marginTop: 0 }}>
                Lab execution only — no billing or contractor dispatch.
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
          ) : null}

          <CaseTabs
            overview={overview}
            conversation={conversation}
            evidence={evidence}
            activity={activity}
          />
        </div>

        <ActionDock mode={dockMode} />
      </div>
    </div>
  );
}
