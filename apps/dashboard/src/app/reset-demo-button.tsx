"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { resetDemoData } from "./reset-demo-action";

export function ResetDemoButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onReset() {
    const confirmed = window.confirm(
      "Reset demo data?\n\nThis deletes all requests and related extractions, drafts, approvals, and timeline events.\n\nKeeps: companies, contacts, sites (e.g. Riverside Court).\n\nThis cannot be undone.",
    );
    if (!confirmed) {
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await resetDemoData();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(
        result.deletedRequests === 0
          ? "Demo already empty — nothing to delete."
          : `Reset complete — removed ${result.deletedRequests} request(s).`,
      );
      router.refresh();
    });
  }

  return (
    <div className={compact ? "lab-tool" : "reset-demo"}>
      <button
        type="button"
        className="btn btn-danger"
        disabled={pending}
        onClick={onReset}
      >
        {pending ? "Resetting…" : "Reset demo data"}
      </button>
      {!compact ? (
        <p
          className="muted"
          style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}
        >
          Clears inbox run state. Does not touch HubSpot, Gmail, or sites.
        </p>
      ) : null}
      {error ? (
        <p className="error-inline" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="ok-inline">{message}</p> : null}
    </div>
  );
}
