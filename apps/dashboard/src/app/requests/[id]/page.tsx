import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ComponentProps } from "react";
import { ActionDock } from "@/app/components/action-dock";
import { ActivityTimeline } from "@/app/components/activity-timeline";
import { CaseTabs } from "@/app/components/case-tabs";
import { EvidenceRail } from "@/app/components/evidence-rail";
import { RequestQueue } from "@/app/components/request-queue";
import { ResidentMessagePanel } from "@/app/components/resident-message-panel";
import { describeActivityEvent } from "@/lib/activity";
import { lookupHubSpotContactByEmail } from "@/lib/hubspot";
import { loadInboxRequests, parseQueueFilter } from "@/lib/inbox";
import { formatWhen } from "@/lib/format";
import {
  caseStatusLabel,
  categoryLabel,
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
import { RetryFailureButton } from "./retry-form";
import { RetrievalPanel } from "./retrieval-panel";
import { DecisionForm } from "./decision-form";
import { ExecuteWorkOrderForm } from "./execute-form";
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

function nextStepForCase(input: {
  isHazard: boolean;
  needsAttention: boolean;
  chargeableNeedsApproval: boolean;
  chargeableReadyToExecute: boolean;
  draftStatus: string | null;
  citationCount: number;
  accessNotes: string | null;
  siteName: string | null;
  unitName: string | null;
  residentName: string;
  residentMatched: boolean;
  failedStepLabel: string | null;
}): { title: string; detail: string } {
  if (input.needsAttention) {
    return {
      title: "Retry the failed workflow step",
      detail: input.failedStepLabel
        ? `${input.failedStepLabel} failed — use Retry in the decision banner to restore the integration path.`
        : "Use Retry in the decision banner to restore the integration path, then continue the case.",
    };
  }
  if (input.chargeableNeedsApproval) {
    return {
      title: "Approve tenant-chargeable authority first",
      detail:
        "Chargeable work is blocked until authority is recorded. Approve or reject in the decision banner — no invoice or dispatch.",
    };
  }
  if (input.chargeableReadyToExecute) {
    return {
      title: "Create the simulated work order",
      detail:
        "Authority is approved. Use Create work order in the decision banner — lab execution only, no billing or contractor dispatch.",
    };
  }
  if (input.isHazard) {
    return {
      title: "Escalate — do not send a routine reply",
      detail:
        "Treat as urgent hazard. Confirm Slack alert and urgent maintenance routing before any resident-facing message.",
    };
  }
  if (input.draftStatus === "proposed") {
    const place = [input.unitName, input.siteName].filter(Boolean).join(", ");
    const policyLine =
      input.citationCount > 0
        ? `Grounded by ${input.citationCount} polic${input.citationCount === 1 ? "y" : "ies"}`
        : "No policy citations attached";
    const accessLine = input.accessNotes
      ? ` · check access notes (${input.accessNotes}) match the draft`
      : "";
    return {
      title: "Review the draft, then approve in Proposed reply",
      detail: `${policyLine}${accessLine}${place ? ` · ${place}` : ""}. Edit the wording if needed before approving.`,
    };
  }
  if (input.draftStatus === "approved") {
    const recipient = input.residentMatched
      ? input.residentName
      : "the original sender";
    const place = [input.unitName, input.siteName].filter(Boolean).join(", ");
    return {
      title: "Send the approved reply",
      detail: `Ready for ${recipient}${place ? ` at ${place}` : ""}. Use Send in the Proposed reply panel — emails via n8n.`,
    };
  }
  return {
    title: "No blocking decision",
    detail: "Review Activity if you need the full case history.",
  };
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
    dockMode = { kind: "hidden" };
  } else if (
    chargeableNeedsApproval ||
    chargeableReadyToExecute
  ) {
    // Chargeable approve / execute live in the decision banner — hide the bottom dock.
    dockMode = { kind: "hidden" };
  } else if (
    (draft?.status === "proposed" || draft?.status === "approved") &&
    !chargeableNeedsApproval
  ) {
    // Approve/send live in the Proposed reply panel — hide the bottom dock.
    dockMode = { kind: "hidden" };
  }

  const accessNotes =
    typeof extraction?.structured_output?.accessNotes === "string"
      ? extraction.structured_output.accessNotes
      : null;

  const nextStep = nextStepForCase({
    isHazard,
    needsAttention: typedRequest.status === "needs_attention",
    chargeableNeedsApproval,
    chargeableReadyToExecute,
    draftStatus: draft?.status ?? null,
    citationCount: draftCitations?.length ?? 0,
    accessNotes,
    siteName: extractedSite || site?.name || null,
    unitName: extractedUnit,
    residentName,
    residentMatched: Boolean(contact || hubspot),
    failedStepLabel: latestError?.step_name
      ? latestError.step_name.replace(/_/g, " ")
      : null,
  });

  const activityItems = timeline.map((event) =>
    describeActivityEvent(event, {
      residentName,
      siteName: extractedSite || site?.name,
      unitName: extractedUnit,
      issueSummary:
        typeof extraction?.structured_output?.issueSummary === "string"
          ? extraction.structured_output.issueSummary
          : typedRequest.subject,
    }),
  );

  const evidenceRail = (
    <EvidenceRail
      siteName={extractedSite || site?.name || null}
      unitName={extractedUnit}
      assetType={
        typeof extraction?.structured_output?.assetType === "string"
          ? extraction.structured_output.assetType
          : null
      }
      accessNotes={
        typeof extraction?.structured_output?.accessNotes === "string"
          ? extraction.structured_output.accessNotes
          : null
      }
      category={
        (typeof extraction?.structured_output?.category === "string"
          ? extraction.structured_output.category
          : typedRequest.category) || null
      }
      confidence={confidence}
      residentName={residentName}
      residentMatched={Boolean(contact || hubspot)}
      hubspotMatched={Boolean(hubspot)}
      opsdeskMatched={Boolean(contact && !hubspot)}
      siteActive={site ? site.status === "active" : null}
      siteLabel={extractedSite || site?.name || null}
      authorisedChanges={
        contact ? contact.authorised_for_account_changes : null
      }
      citations={draftCitations}
      isHazard={isHazard}
      isChargeable={isChargeable}
      requestId={typedRequest.id}
      filterQuery={filter !== "all" ? filter : ""}
      nextStepTitle={nextStep.title}
      nextStepDetail={nextStep.detail}
    />
  );

  const activityHref = `/requests/${typedRequest.id}${filter !== "all" ? `?filter=${filter}&tab=activity` : "?tab=activity"}`;

  const overview = (
    <div>
      <div className="case-grid">
      <div>
        <ResidentMessagePanel
          body={typedRequest.raw_body}
          senderName={residentName}
          senderEmail={typedRequest.sender_email}
          receivedAt={typedRequest.received_at}
        />

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
          <section className="message-panel outbound">
            <div className="message-panel-inner">
              <h3>Proposed reply</h3>
              <p className="muted" style={{ margin: 0 }}>
                No draft reply proposed yet.
              </p>
            </div>
          </section>
        )}
      </div>

      {evidenceRail}
      </div>

      <ActivityTimeline
        items={activityItems}
        limit={5}
        compact
        viewAllHref={activityHref}
      />
    </div>
  );

  const conversation = (
    <div>
      <ResidentMessagePanel
        body={typedRequest.raw_body}
        senderName={residentName}
        senderEmail={typedRequest.sender_email}
        receivedAt={typedRequest.received_at}
      />
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
      <div>
        {evidenceRail}
        <div style={{ marginTop: "0.85rem" }}>
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
        </div>
        <section className="section-block" style={{ marginTop: "0.85rem" }}>
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
        </section>
      </div>
    </div>
  );

  const activity = <ActivityTimeline items={activityItems} />;

  return (
    <div className="desk">
      <RequestQueue
        requests={requests}
        selectedId={typedRequest.id}
        filter={filter}
      />

      <div
        className={`case-canvas${dockMode.kind === "hidden" ? " case-canvas--no-dock" : ""}`}
      >
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

          {chargeableNeedsApproval && chargeable ? (
            <div className="decision-banner decision-strip">
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
                <p>Records authority only · no invoice or dispatch</p>
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

          {chargeableReadyToExecute && chargeable && !chargeableJob ? (
            <div className="decision-banner decision-strip">
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
                  Ready to execute
                </p>
                <h2>Authority approved — create work order</h2>
                <p>Lab execution only · no invoice or contractor dispatch</p>
              </div>
              <div className="decision-actions">
                <ExecuteWorkOrderForm
                  proposedActionId={chargeable.id}
                  requestId={typedRequest.id}
                  compact
                />
              </div>
            </div>
          ) : null}

          {isHazard && !chargeableNeedsApproval ? (
            <div className="decision-banner decision-strip hazard">
              <div>
                <p className="decision-kicker">Safety escalation</p>
                <h2>Hazard reported — prioritise resident safety</h2>
                <p>Confirm Slack alert and next safe action</p>
              </div>
            </div>
          ) : null}

          {typedRequest.status === "needs_attention" ? (
            <div className="decision-banner decision-strip failed">
              <div>
                <p className="decision-kicker">Workflow failed</p>
                <h2>Integration failure needs attention</h2>
                <p>
                  {latestError?.error?.trim() ||
                    "A connected system failed. Retry the failed step to continue."}
                </p>
                {latestError?.step_name ? (
                  <div className="decision-meta">
                    <span>
                      Failed step:{" "}
                      <strong>
                        {latestError.step_name.replace(/_/g, " ")}
                      </strong>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="decision-actions">
                <RetryFailureButton
                  requestId={typedRequest.id}
                  compact
                />
              </div>
            </div>
          ) : null}

          <Suspense
            fallback={
              <p className="muted" style={{ margin: "1rem 0" }}>
                Loading case sections…
              </p>
            }
          >
            <CaseTabs
              overview={overview}
              conversation={conversation}
              evidence={evidence}
              activity={activity}
            />
          </Suspense>
        </div>

        <ActionDock mode={dockMode} />
      </div>
    </div>
  );
}
