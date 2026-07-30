import Link from "next/link";
import { redirect } from "next/navigation";
import { RequestQueue } from "@/app/components/request-queue";
import { loadInboxRequests, parseQueueFilter } from "@/lib/inbox";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ filter?: string | string[]; stay?: string }>;
};

export default async function OperationsInboxPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = parseQueueFilter(sp.filter);
  const { requests, loadError } = await loadInboxRequests();

  const preferred =
    requests.find((r) => r.status === "needs_attention") ||
    requests.find(
      (r) =>
        r.category === "controlled_chargeable" && r.status === "proposed",
    ) ||
    requests.find((r) => r.category === "urgent_hazardous") ||
    requests.find((r) => r.status === "proposed" || r.status === "approved") ||
    requests[0];

  // Land operators on a live case so the desk matches the command-centre mock.
  if (preferred && sp.stay !== "1") {
    const qs = filter !== "all" ? `?filter=${filter}` : "";
    redirect(`/requests/${preferred.id}${qs}`);
  }

  return (
    <div className="desk">
      <RequestQueue requests={requests} filter={filter} />
      <div className="case-canvas">
        <div className="case-scroll">
          {loadError ? (
            <div className="error-banner" role="alert">
              Could not load requests: {loadError}
            </div>
          ) : null}
          <div className="case-empty">
            <h2>Select a request</h2>
            <p className="muted" style={{ margin: "0 0 1rem", maxWidth: "22rem" }}>
              Triage from the queue. Hazards and approvals surface first so you
              can decide with evidence in view.
            </p>
            {preferred ? (
              <Link
                href={`/requests/${preferred.id}${filter !== "all" ? `?filter=${filter}` : ""}`}
                className="btn btn-approve"
                style={{ textDecoration: "none" }}
              >
                Open next case
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
