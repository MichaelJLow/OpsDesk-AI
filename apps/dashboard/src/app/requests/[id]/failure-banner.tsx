import { RetryFailureButton } from "./retry-form";
import type { WorkflowEvent } from "@/lib/types";

/**
 * Banner only while the request is still open for recovery.
 * Historical error rows stay on the timeline after a successful retry.
 */
export function FailureBanner({
  requestId,
  requestStatus,
  latestError,
}: {
  requestId: string;
  requestStatus: string;
  latestError: WorkflowEvent | null;
}) {
  if (requestStatus !== "needs_attention") {
    return null;
  }

  return (
    <div className="failure-banner" role="alert">
      <strong>Integration needs attention</strong>
      <p style={{ margin: "0.35rem 0 0" }}>
        {latestError?.error?.trim()
          ? latestError.error
          : "This request is marked needs_attention. Check the timeline for details."}
      </p>
      {latestError?.step_name ? (
        <p className="muted" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>
          Failed step: <span className="mono">{latestError.step_name}</span>
          {latestError.event_type ? ` · ${latestError.event_type}` : null}
        </p>
      ) : null}
      <RetryFailureButton requestId={requestId} />
    </div>
  );
}
