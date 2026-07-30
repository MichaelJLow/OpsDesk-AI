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
      <strong>Workflow failed</strong>
      <p style={{ margin: "0.35rem 0 0" }}>
        {latestError?.error?.trim()
          ? latestError.error
          : "A connected system failed on this request. Check Activity for details."}
      </p>
      {latestError?.step_name ? (
        <p className="muted" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>
          Failed step:{" "}
          <span className="mono">
            {latestError.step_name.replace(/_/g, " ")}
          </span>
        </p>
      ) : null}
      <RetryFailureButton requestId={requestId} />
    </div>
  );
}
