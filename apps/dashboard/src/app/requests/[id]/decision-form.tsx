"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { decideOnChargeableWork, decideOnDraft } from "./actions";

type Props = {
  proposedActionId: string;
  requestId: string;
  mode?: "draft_reply" | "chargeable_work";
};

export function DecisionForm({
  proposedActionId,
  requestId,
  mode = "draft_reply",
}: Props) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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

  return (
    <div>
      <label className="muted" htmlFor="decision-note">
        Note (optional)
      </label>
      <div className="actions">
        <input
          id="decision-note"
          className="note-input"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Reason for decision"
          disabled={pending}
        />
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={() => submit("approve")}
        >
          {pending ? "Saving…" : "Approve"}
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
