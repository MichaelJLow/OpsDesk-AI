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
import { CrmContextPanel } from "./crm-panel";
import { DecisionForm } from "./decision-form";
import { EvidencePackForm } from "./evidence-pack-form";
import { ExecuteWorkOrderForm } from "./execute-form";
import { FailureBanner } from "./failure-banner";
import { RetrievalPanel } from "./retrieval-panel";
import { SendForm } from "./send-form";
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
      <div>
        <p className="muted" style={{ margin: "0 0 0.35rem" }}>
          <Link href="/">← Operations Inbox</Link>
        </p>
        <h1 style={{ margin: "0 0 0.35rem", fontSize: "1.45rem" }}>
          {typedRequest.subject?.trim() || "(no subject)"}
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          {typedRequest.sender_email} · {formatWhen(typedRequest.received_at)} ·{" "}
          <span className={requestStatusBadgeClass(typedRequest.status)}>
            {typedRequest.status}
          </span>
          {typedRequest.urgency ||
          typedRequest.category === "urgent_hazardous" ||
          typedRequest.category === "controlled_chargeable"
            ? (
                <>
                  {" "}
                  ·{" "}
                  <span
                    className={urgencyBadgeClass(
                      typedRequest.urgency,
                      typedRequest.category,
                    )}
                  >
                    {typedRequest.category === "urgent_hazardous"
                      ? "urgent hazard"
                      : typedRequest.category === "controlled_chargeable"
                        ? "chargeable"
                        : typedRequest.urgency}
                  </span>
                </>
              )
            : null}
        </p>
      </div>

      <FailureBanner
        requestId={typedRequest.id}
        requestStatus={typedRequest.status}
        latestError={latestError}
      />

      <div className="grid-2">
        <section className="panel">
          <h2>Inbound message</h2>
          <pre className="pre">{typedRequest.raw_body || "(empty body)"}</pre>
          <p className="muted" style={{ marginBottom: 0, marginTop: "0.75rem" }}>
            <span className="mono">id {typedRequest.id}</span>
          </p>
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

      <div className="grid-2">
        <section className="panel">
          <h2>Structured extraction</h2>
          {extraction ? (
            <>
              <p className="muted" style={{ marginTop: 0 }}>
                {extraction.model_name ?? "model"} · validation{" "}
                <span className="badge">{extraction.validation_status}</span>
              </p>
              <ExtractionFields data={extraction.structured_output} />
            </>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              No extraction stored for this request yet.
            </p>
          )}
        </section>

        <section className="panel">
          <h2>Draft reply</h2>
          {draft ? (
            <>
              <p className="muted" style={{ marginTop: 0 }}>
                Status{" "}
                <span className={badgeClass(draft.status)}>{draft.status}</span>
                {draft.risk_level ? ` · risk ${draft.risk_level}` : null}
              </p>
              <pre className="pre">{draftText || "(no draft text in payload)"}</pre>
              {draftCitations && draftCitations.length > 0 ? (
                <div style={{ marginTop: "0.75rem" }}>
                  <p className="muted" style={{ marginBottom: "0.35rem" }}>
                    <strong>Internal grounding</strong> — not included in the
                    customer email. Keep for disputes / follow-up if needed.
                  </p>
                  <ul className="timeline">
                    {draftCitations.map((c, i) => (
                      <li key={c.id || String(i)}>
                        <strong>{c.title || c.id || "policy"}</strong>
                        {c.namespace ? (
                          <>
                            {" · "}
                            <span className="badge">{c.namespace}</span>
                          </>
                        ) : null}
                        {c.id ? (
                          <div className="muted mono">{c.id}</div>
                        ) : null}
                        {c.snippet ? (
                          <p style={{ margin: "0.35rem 0 0" }}>{c.snippet}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {draft.status === "proposed" ? (
                <DecisionForm
                  proposedActionId={draft.id}
                  requestId={typedRequest.id}
                  mode="draft_reply"
                />
              ) : draft.status === "approved" ? (
                <SendForm
                  proposedActionId={draft.id}
                  requestId={typedRequest.id}
                />
              ) : draft.status === "sent" ? (
                <p className="muted" style={{ marginBottom: 0 }}>
                  Reply marked as sent. Check the recipient inbox / Sent folder.
                </p>
              ) : (
                <p className="muted" style={{ marginBottom: 0 }}>
                  Decision recorded as <strong>{draft.status}</strong>. No send
                  available.
                </p>
              )}
            </>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              No <code>draft_reply</code> proposed action yet.
            </p>
          )}
        </section>
      </div>

      {chargeable ? (
        <section className="panel">
          <h2>Chargeable work — approval required</h2>
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

      <section className="panel">
        <h2>Workflow timeline</h2>
        {timeline.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No workflow events for this request.
          </p>
        ) : (
          <ul className="timeline">
            {timeline.map((event) => (
              <li
                key={event.id}
                className={event.status === "error" ? "timeline-error" : undefined}
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

      <section className="panel">
        <h2>Context retrieval</h2>
        <RetrievalPanel requestId={typedRequest.id} />
      </section>

      <section className="panel">
        <h2>Evidence pack</h2>
        <EvidencePackForm requestId={typedRequest.id} />
      </section>
    </main>
  );
}
