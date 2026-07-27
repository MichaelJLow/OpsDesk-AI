import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  isChargeableRequest,
  isUrgentRequest,
  requestStatusBadgeClass,
  urgencyBadgeClass,
} from "@/lib/status";
import type { OpsRequest } from "@/lib/types";

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
          <h1>Operations inbox</h1>
          <p className="lede">
            Quayside maintenance requests: classify, route, approve, and keep an
            audit trail.
          </p>
        </div>
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
            No Quayside requests in the inbox yet. Seed the walkthrough cases, or
            send a live email through the Gmail → n8n path.
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
                    ) : isChargeableRequest(request.category) ? (
                      <span
                        className={urgencyBadgeClass(
                          request.urgency,
                          request.category,
                        )}
                      >
                        chargeable
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
