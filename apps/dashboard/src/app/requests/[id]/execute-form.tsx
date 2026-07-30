"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createLabWorkOrder } from "./actions";

type Props = {
  proposedActionId: string;
  requestId: string;
};

export function ExecuteWorkOrderForm({ proposedActionId, requestId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function create() {
    setError(null);
    startTransition(async () => {
      const result = await createLabWorkOrder({
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
        Authority is approved. Create a simulated work order to record protected
        execution. This does <strong>not</strong> send invoices or dispatch
        contractors.
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={create}
        >
          {pending ? "Creating…" : "Create work order"}
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
