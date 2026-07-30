import Link from "next/link";
import type { OpsRequest } from "@/lib/types";
import { formatTimeShort } from "@/lib/format";
import { queueStateLabel } from "@/lib/labels";

function residentFromEmail(email: string) {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function locationLine(request: OpsRequest): string {
  const subject = request.subject?.trim() || "";
  const flat = subject.match(/Flat\s+\d+/i)?.[0];
  const site =
    subject.match(/Riverside Court/i)?.[0] ||
    subject.match(/Harbour View/i)?.[0] ||
    subject.match(/Quayside/i)?.[0];
  if (flat && site) return `${flat} · ${site}`;
  if (flat) return `${flat} · Riverside Court`;
  if (site) return site;
  if (request.category === "urgent_hazardous") return "Urgent site";
  return "Site pending";
}

export function RequestQueue({
  requests,
  selectedId,
  filter = "all",
}: {
  requests: OpsRequest[];
  selectedId?: string | null;
  filter?: "all" | "hazards" | "approvals" | "failed";
}) {
  const openCount = requests.filter(
    (r) => !["sent", "executed_lab", "rejected"].includes(r.status),
  ).length;
  const needAction = requests.filter((r) => {
    const state = queueStateLabel(r);
    return (
      state.tone === "approval" ||
      state.tone === "hazard" ||
      state.tone === "failed" ||
      r.status === "proposed" ||
      r.status === "approved" ||
      r.status === "awaiting_execution" ||
      r.status === "needs_attention"
    );
  }).length;

  let filtered = requests;
  if (filter === "hazards") {
    filtered = requests.filter((r) => r.category === "urgent_hazardous");
  } else if (filter === "approvals") {
    filtered = requests.filter(
      (r) =>
        r.category === "controlled_chargeable" ||
        r.status === "proposed" ||
        r.status === "awaiting_execution",
    );
  } else if (filter === "failed") {
    filtered = requests.filter((r) => r.status === "needs_attention");
  }

  return (
    <aside className="triage" aria-label="Request queue">
      <div className="triage-header">
        <h1>Request queue</h1>
        <p className="triage-sub">
          {openCount} open · {needAction} need action
        </p>
      </div>

      <div className="triage-tools" role="tablist" aria-label="Queue filters">
        <Link
          href={selectedId ? `/requests/${selectedId}` : "/"}
          className={`chip${filter === "all" ? " active" : ""}`}
          scroll={false}
        >
          My queue
        </Link>
        <Link
          href={`${selectedId ? `/requests/${selectedId}` : "/"}?filter=hazards`}
          className={`chip${filter === "hazards" ? " active" : ""}`}
          scroll={false}
        >
          Hazards
        </Link>
        <Link
          href={`${selectedId ? `/requests/${selectedId}` : "/"}?filter=approvals`}
          className={`chip${filter === "approvals" ? " active" : ""}`}
          scroll={false}
        >
          Approvals
        </Link>
        <span className="chip-icon" title="Filters" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="queue-empty">
          No requests in this view. Seed the walkthrough from Lab controls, or
          send a live email through Gmail → n8n.
        </p>
      ) : (
        <ul className="queue-list">
          {filtered.map((request) => {
            const state = queueStateLabel(request);
            const title = request.subject?.trim() || "(no subject)";

            return (
              <li key={request.id}>
                <Link
                  href={`/requests/${request.id}${filter !== "all" ? `?filter=${filter}` : ""}`}
                  className={`queue-item${selectedId === request.id ? " active" : ""}`}
                >
                  <p className="queue-item-title">{title}</p>
                  <p className="queue-item-meta">{locationLine(request)}</p>
                  <div className="queue-item-foot">
                    <span className="queue-item-who">
                      {residentFromEmail(request.sender_email)} ·{" "}
                      {formatTimeShort(request.received_at)}
                    </span>
                    <span className={`state-pill ${state.tone}`}>
                      {state.label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
