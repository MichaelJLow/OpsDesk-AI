import Link from "next/link";
import { formatTimeShort, formatWhen } from "@/lib/format";
import type { ActivityItem } from "@/lib/activity";
import { summariseActivity } from "@/lib/activity";

export function ActivityTimeline({
  items,
  limit,
  viewAllHref,
  compact = false,
}: {
  items: ActivityItem[];
  limit?: number;
  viewAllHref?: string;
  compact?: boolean;
}) {
  const summary = summariseActivity(items);
  const visible =
    typeof limit === "number" && limit > 0 ? items.slice(0, limit) : items;
  const hiddenCount = Math.max(0, items.length - visible.length);

  if (items.length === 0) {
    return (
      <section className={`activity-panel${compact ? " compact" : ""}`}>
        <header className="activity-header">
          <div>
            <h3>Activity</h3>
            <p className="muted">Who did what, and when.</p>
          </div>
        </header>
        <p className="muted">No workflow events for this request.</p>
      </section>
    );
  }

  return (
    <section className={`activity-panel${compact ? " compact" : ""}`}>
      <header className="activity-header">
        <div>
          <h3>Activity</h3>
          <p className="muted">Who did what, and when.</p>
        </div>
        <p className="activity-summary">
          {summary.events} event{summary.events === 1 ? "" : "s"}
          {summary.escalations > 0
            ? ` · ${summary.escalations} escalation${summary.escalations === 1 ? "" : "s"}`
            : ""}
          {summary.humanEdits > 0
            ? ` · ${summary.humanEdits} human edit${summary.humanEdits === 1 ? "" : "s"}`
            : ""}
        </p>
      </header>

      <ol className="activity-timeline">
        {visible.map((item) => (
          <li key={item.id} className={`activity-item tone-${item.tone}`}>
            <div className="activity-time" title={formatWhen(item.occurredAt)}>
              {formatTimeShort(item.occurredAt)}
            </div>
            <div className="activity-node" aria-hidden="true" />
            <div className="activity-body">
              <div className="activity-topline">
                <strong className="activity-headline">{item.headline}</strong>
                <span className={`activity-status status-${item.tone}`}>
                  {item.statusLabel === "Completed" ? (
                    <>
                      <span aria-hidden="true">✓</span> Completed
                    </>
                  ) : (
                    item.statusLabel
                  )}
                </span>
              </div>
              {item.detail ? (
                <p className="activity-detail">{item.detail}</p>
              ) : null}
              {item.error ? (
                <p className="activity-error">{item.error}</p>
              ) : null}
              <div className="activity-meta">
                <span className={`actor-chip tone-${item.tone}`}>
                  {item.actor}
                </span>
                <span className="activity-when">{formatWhen(item.occurredAt)}</span>
              </div>
              {!compact ? (
                <details className="tech-details">
                  <summary>Technical details</summary>
                  <pre>{JSON.stringify(item.rawPayload ?? {}, null, 2)}</pre>
                </details>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {viewAllHref && hiddenCount > 0 ? (
        <div className="activity-footer">
          <Link href={viewAllHref} className="next-link" scroll={false}>
            View all {items.length} events
          </Link>
        </div>
      ) : null}
    </section>
  );
}
