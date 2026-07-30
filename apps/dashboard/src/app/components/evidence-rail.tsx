import Link from "next/link";
import {
  HubSpotContextBadge,
  NoMatchContextBadge,
} from "@/app/components/source-marks";
import { categoryLabel } from "@/lib/labels";

export type PolicyCitation = {
  id?: string;
  title?: string;
  snippet?: string;
  namespace?: string;
};

type Props = {
  siteName: string | null;
  unitName: string | null;
  assetType: string | null;
  accessNotes: string | null;
  category: string | null;
  confidence: number | null;
  residentName: string;
  residentMatched: boolean;
  hubspotMatched?: boolean;
  opsdeskMatched?: boolean;
  siteActive: boolean | null;
  siteLabel: string | null;
  authorisedChanges: boolean | null;
  citations: PolicyCitation[] | null;
  isHazard: boolean;
  isChargeable: boolean;
  requestId: string;
  filterQuery?: string;
  nextStepTitle: string;
  nextStepDetail: string;
};

function PolicyBlock({
  title,
  snippet,
  tone,
  usedInDraft,
}: {
  title: string;
  snippet: string;
  tone: "hazard" | "approval" | "neutral";
  usedInDraft: boolean;
}) {
  return (
    <div className={`policy-accent policy-accent-${tone}`}>
      <strong>{title}</strong>
      <p>{snippet}</p>
      <div className="policy-meta">
        {usedInDraft ? <span className="meta-chip">Used in draft</span> : null}
        <span className="meta-chip quiet">View policy</span>
      </div>
    </div>
  );
}

export function EvidenceRail({
  siteName,
  unitName,
  assetType,
  accessNotes,
  category,
  confidence,
  residentName,
  residentMatched,
  hubspotMatched: _hubspotMatched = false,
  opsdeskMatched: _opsdeskMatched = false,
  siteActive,
  siteLabel,
  authorisedChanges,
  citations,
  isHazard,
  isChargeable,
  requestId,
  filterQuery = "",
  nextStepTitle,
  nextStepDetail,
}: Props) {
  const place = [siteName, unitName].filter(Boolean).join(" · ") || "Site pending";
  const subtitleParts = [
    assetType ? assetType.charAt(0).toUpperCase() + assetType.slice(1) : null,
    accessNotes ? `Access ${accessNotes}` : null,
  ].filter(Boolean);

  const categoryText = categoryLabel(category);
  const toneClass = isHazard ? "hazard" : isChargeable ? "approval" : "neutral";

  const defaultPolicy = isHazard
    ? {
        title: "Urgent hazard escalation policy",
        snippet:
          "Water near electrical fittings are urgent hazards. Route to urgent maintenance immediately.",
      }
    : isChargeable
      ? {
          title: "Chargeable works policy",
          snippet:
            "Tenant-chargeable work requires recorded operational authority before a work order is created. No invoice or contractor dispatch occurs at approval.",
        }
      : null;

  const policies =
    citations && citations.length > 0
      ? citations.map((c) => ({
          title: c.title || "Policy citation",
          snippet:
            c.snippet || "Internal policy used to ground this recommendation.",
        }))
      : defaultPolicy
        ? [defaultPolicy]
        : [];

  const contextVerified = residentMatched && siteActive === true;
  const activityHref = `/requests/${requestId}${filterQuery ? `?filter=${filterQuery}&tab=activity` : "?tab=activity"}`;

  const factRows: Array<[string, string, string?]> = [
    ["Category", categoryText, isHazard ? "hazard" : undefined],
    ["Asset", assetType ? assetType.charAt(0).toUpperCase() + assetType.slice(1) : "—"],
    ["Access", accessNotes || "—"],
  ];

  return (
    <aside className="evidence-rail" aria-label="Case evidence">
      <div className="evidence-identity">
        <p className="evidence-place">{place}</p>
        {subtitleParts.length > 0 ? (
          <p className="evidence-sub">{subtitleParts.join(" · ")}</p>
        ) : null}
        <div className="evidence-chips">
          <span className={`state-pill ${isHazard ? "hazard" : isChargeable ? "approval" : "neutral"}`}>
            {categoryText}
          </span>
          {confidence != null ? (
            <span className="evidence-confidence">{confidence}% confidence</span>
          ) : null}
        </div>
      </div>

      <div className="evidence-section">
        <p className="evidence-label">Case facts</p>
        <dl className="kv kv-tight">
          {factRows.map(([label, value, valueTone]) => (
            <div key={label} style={{ display: "contents" }}>
              <dt>{label}</dt>
              <dd className={valueTone === "hazard" ? "value-hazard" : undefined}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="evidence-section">
        <div className="context-strip">
          <div className="context-copy">
            <p className="evidence-label" style={{ marginBottom: "0.25rem" }}>
              Context
            </p>
            <p className="context-status">
              {contextVerified ? (
                <>
                  <span className="verify-ok" aria-hidden="true">
                    ✓
                  </span>{" "}
                  <strong>Verified</strong>
                </>
              ) : (
                <strong>Needs review</strong>
              )}
            </p>
            <div className="context-detail-row">
              {residentMatched ? (
                <p className="context-detail">
                  Resident matched · {residentName}
                </p>
              ) : (
                <p className="context-detail">Resident not matched</p>
              )}
              <p className="context-detail">
                {siteActive === true
                  ? `Site active${siteLabel ? ` · ${siteLabel}` : ""}`
                  : siteLabel
                    ? `Site unverified · ${siteLabel}`
                    : "Site unknown"}
              </p>
            </div>
          </div>
          {residentMatched ? (
            <HubSpotContextBadge />
          ) : (
            <NoMatchContextBadge />
          )}
        </div>
        <dl className="kv kv-tight" style={{ marginTop: "0.65rem" }}>
          <div style={{ display: "contents" }}>
            <dt>Authorised changes</dt>
            <dd>
              {authorisedChanges === null
                ? "—"
                : authorisedChanges
                  ? "Yes"
                  : "No"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="evidence-section">
        <p className="evidence-label">Policy evidence</p>
        {policies.length > 0 ? (
          policies.map((policy, index) => (
            <PolicyBlock
              key={`${policy.title}-${index}`}
              title={policy.title}
              snippet={policy.snippet}
              tone={toneClass === "neutral" ? "neutral" : toneClass}
              usedInDraft={Boolean(citations && citations.length > 0) || isHazard || isChargeable}
            />
          ))
        ) : (
          <p className="muted" style={{ margin: 0, fontSize: "0.8rem" }}>
            No policy citations attached to this case.
          </p>
        )}
      </div>

      <div className="evidence-section evidence-next">
        <p className="evidence-label">Recommended next step</p>
        <p className="next-title">{nextStepTitle}</p>
        <p className="next-detail">{nextStepDetail}</p>
        <Link href={activityHref} className="next-link" scroll={false}>
          Open full Activity
        </Link>
      </div>
    </aside>
  );
}
