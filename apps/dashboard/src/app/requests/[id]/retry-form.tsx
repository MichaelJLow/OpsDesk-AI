"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { retryFailedRequest } from "./retry-action";

export function RetryFailureButton({
  requestId,
  compact = false,
}: {
  requestId: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onRetry() {
    const confirmed = window.confirm(
      "Retry this failed request?\n\nOpsDesk will call the n8n retry webhook to resume from a safe step (not a full Gmail re-ingest).",
    );
    if (!confirmed) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await retryFailedRequest({ requestId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (compact) {
    return (
      <div className="actions" style={{ marginTop: 0 }}>
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={onRetry}
        >
          {pending ? "Requesting retry…" : "Retry"}
        </button>
        {error ? (
          <p className="error-inline" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="actions" style={{ marginTop: "0.75rem" }}>
      <button
        type="button"
        className="btn btn-approve"
        disabled={pending}
        onClick={onRetry}
      >
        {pending ? "Requesting retry…" : "Retry"}
      </button>
      {error ? (
        <p className="error-inline" role="alert" style={{ flexBasis: "100%" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
