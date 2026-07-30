"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { sendApprovedDraft } from "./actions";

type Props = {
  proposedActionId: string;
  requestId: string;
};

export function SendForm({ proposedActionId, requestId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function send() {
    setError(null);
    startTransition(async () => {
      const result = await sendApprovedDraft({
        proposedActionId,
        requestId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: "0.5rem" }}>
        Reply approved. Send is a separate step and emails the original
        resident via n8n.
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={send}
        >
          {pending ? "Sending…" : "Approve & send"}
        </button>
      </div>
      {error ? (
        <p className="error-banner" style={{ marginTop: "0.75rem" }} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
