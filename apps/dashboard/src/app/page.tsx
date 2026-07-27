import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  isUrgentRequest,
  requestStatusBadgeClass,
  urgencyBadgeClass,
} from "@/lib/status";
import type { OpsRequest } from "@/lib/types";
import { ResetDemoButton } from "./reset-demo-button";

export const dynamic = "force-dynamic";

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

export default async function OperationsInboxPage() {
  let requests: OpsRequest[] = [];
  let loadError: string | null = null;
  let attentionCount = 0;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("requests")
      .select(
        "id, external_message_id, sender_email, subject, raw_body, category, confidence, status, urgency, received_at, created_at",
      )
      .order("received_at", { ascending: false })
      .limit(50);

    if (error) {
      loadError = error.message;
    } else {
      requests = (data ?? []) as OpsRequest[];
      attentionCount = requests.filter(
        (r) => r.status === "needs_attention",
      ).length;
    }
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load requests";
  }

  return (
    <main>
      <div className="inbox-header">
        <div>
          <h1 style={{ marginTop: 0, fontSize: "1.6rem" }}>Operations Inbox</h1>
          <p className="muted" style={{ marginTop: "-0.35rem" }}>
            Latest maintenance requests from the shared inbox pipeline.
          </p>
        </div>
        <ResetDemoButton />
      </div>

      {loadError ? (
        <div className="error-banner" role="alert">
          Could not load requests: {loadError}
        </div>
      ) : null}

      {!loadError && attentionCount > 0 ? (
        <p className="attention-count">
          <span className="badge badge-attention">{attentionCount}</span>{" "}
          request{attentionCount === 1 ? "" : "s"} need
          {attentionCount === 1 ? "s" : ""} attention (integration failure).
        </p>
      ) : null}

      <section className="panel">
        {requests.length === 0 && !loadError ? (
          <p className="muted" style={{ margin: 0 }}>
            No requests yet. Run the n8n boiler path so a row lands in{" "}
            <code>requests</code>.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Urgency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="mono">{formatWhen(request.received_at)}</td>
                  <td>{request.sender_email}</td>
                  <td>
                    <Link href={`/requests/${request.id}`}>
                      {request.subject?.trim() || "(no subject)"}
                    </Link>
                  </td>
                  <td>
                    {isUrgentRequest(request.urgency, request.category) ? (
                      <span
                        className={urgencyBadgeClass(
                          request.urgency,
                          request.category,
                        )}
                      >
                        {request.category === "urgent_hazardous"
                          ? "hazard"
                          : request.urgency}
                      </span>
                    ) : (
                      <span className="muted">
                        {request.urgency?.trim() || "—"}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={requestStatusBadgeClass(request.status)}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
