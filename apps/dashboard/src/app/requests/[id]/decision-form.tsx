"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { decideOnChargeableWork, decideOnDraft } from "./actions";

type Props = {
  proposedActionId: string;
  requestId: string;
  mode?: "draft_reply" | "chargeable_work";
  compact?: boolean;
  showNote?: boolean;
};

export function DecisionForm({
  proposedActionId,
  requestId,
  mode = "draft_reply",
  compact = false,
  showNote = true,
}: Props) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const approveLabel =
    mode === "chargeable_work" ? "Approve authority" : "Approve reply";

  function submit(decision: "approve" | "reject") {
    setError(null);
    startTransition(async () => {
      const result =
        mode === "chargeable_work"
          ? await decideOnChargeableWork({
              proposedActionId,
              requestId,
              decision,
              note,
            })
          : await decideOnDraft({
              proposedActionId,
              requestId,
              decision,
              note,
            });
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
          onClick={() => submit("approve")}
        >
          {pending ? "Saving…" : approveLabel}
        </button>
        <button
          type="button"
          className="btn btn-reject"
          disabled={pending}
          onClick={() => submit("reject")}
        >
          Reject
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
    <div>
      {showNote ? (
        <label className="muted" htmlFor="decision-note">
          Reason for decision (optional)
        </label>
      ) : null}
      <div className="actions">
        {showNote ? (
          <input
            id="decision-note"
            className="note-input"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a short note"
            disabled={pending}
          />
        ) : null}
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={() => submit("approve")}
        >
          {pending ? "Saving…" : approveLabel}
        </button>
        <button
          type="button"
          className="btn btn-reject"
          disabled={pending}
          onClick={() => submit("reject")}
        >
          Reject
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
