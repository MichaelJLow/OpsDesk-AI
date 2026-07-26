import type {
  OpsCompany,
  OpsContact,
  OpsSite,
} from "@/lib/types";
import type { HubSpotContactSummary } from "@/lib/hubspot";

function Kv({
  rows,
}: {
  rows: Array<[string, string]>;
}) {
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

export function CrmContextPanel({
  senderEmail,
  hubspot,
  contact,
  company,
  site,
  extractedSite,
}: {
  senderEmail: string;
  hubspot: HubSpotContactSummary | null;
  contact: OpsContact | null;
  company: OpsCompany | null;
  site: OpsSite | null;
  extractedSite: string | null;
}) {
  const displayName =
    hubspot?.fullName ||
    contact?.name ||
    null;

  return (
    <section className="panel">
      <h2>CRM context</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        HubSpot + OpsDesk records for this sender / site.
      </p>

      <h3 className="panel-subhead">Contact</h3>
      {hubspot || contact ? (
        <Kv
          rows={[
            ["Name", displayName ?? "—"],
            ["Email", hubspot?.email || contact?.email || senderEmail],
            [
              "Role",
              hubspot?.jobTitle || contact?.role || "—",
            ],
            ["Phone", hubspot?.phone || "—"],
            [
              "Source",
              [
                hubspot ? "HubSpot" : null,
                contact ? "OpsDesk contacts" : null,
              ]
                .filter(Boolean)
                .join(" · ") || "—",
            ],
            [
              "Authorised changes",
              contact
                ? contact.authorised_for_account_changes
                  ? "Yes"
                  : "No"
                : "—",
            ],
          ]}
        />
      ) : (
        <p className="muted" style={{ marginTop: 0 }}>
          No CRM contact for <span className="mono">{senderEmail}</span>.
          HubSpot miss or token not loaded — intake still has the email.
        </p>
      )}

      <h3 className="panel-subhead">Organisation</h3>
      {company || hubspot?.company ? (
        <Kv
          rows={[
            ["Name", company?.name || hubspot?.company || "—"],
            ["Domain", company?.domain || "—"],
            ["Industry", company?.industry || "—"],
            ["Lifecycle", company?.lifecycle_stage || "—"],
            ["Status", company?.status || "—"],
          ]}
        />
      ) : (
        <p className="muted" style={{ marginTop: 0 }}>
          No organisation linked on this request yet.
        </p>
      )}

      <h3 className="panel-subhead">Site</h3>
      {site ? (
        <Kv
          rows={[
            ["Name", site.name],
            ["Address", site.address_line || "—"],
            ["Status", site.status],
          ]}
        />
      ) : (
        <p className="muted" style={{ marginTop: 0 }}>
          {extractedSite
            ? `Extraction cited “${extractedSite}” but no matching row in sites.`
            : "No site reference on the extraction yet."}
        </p>
      )}
    </section>
  );
}
