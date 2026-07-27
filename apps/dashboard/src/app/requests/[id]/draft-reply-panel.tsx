"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateDraftReply } from "./actions";
import { DecisionForm } from "./decision-form";
import { SendForm } from "./send-form";
import { requestStatusBadgeClass } from "@/lib/status";

type Citation = {
  id?: string;
  title?: string;
  snippet?: string;
  namespace?: string;
  score?: number;
};

type Props = {
  proposedActionId: string;
  requestId: string;
  status: string;
  riskLevel?: string | null;
  draftText: string | null;
  citations: Citation[] | null;
  editedBy?: string | null;
};

export function DraftReplyPanel({
  proposedActionId,
  requestId,
  status,
  riskLevel,
  draftText,
  citations,
  editedBy,
}: Props) {
  const router = useRouter();
  const canEdit = status === "proposed" || status === "approved";
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(draftText ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setText(draftText ?? "");
    setError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setText(draftText ?? "");
    setError(null);
    setEditing(false);
  }

  function saveEdit() {
    setError(null);
    startTransition(async () => {
      const result = await updateDraftReply({
        proposedActionId,
        requestId,
        draftText: text,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <>
      <p className="muted" style={{ marginTop: 0 }}>
        Status{" "}
        <span className={requestStatusBadgeClass(status)}>{status}</span>
        {riskLevel ? ` · risk ${riskLevel}` : null}
        {editedBy ? (
          <>
            {" · "}
            <span className="badge">edited</span>
          </>
        ) : null}
      </p>

      {editing ? (
        <div className="draft-editor">
          <label className="login-label" htmlFor="draft-text">
            Edit draft
            <textarea
              id="draft-text"
              className="draft-textarea"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={12}
              disabled={pending}
            />
          </label>
          <div className="actions">
            <button
              type="button"
              className="btn btn-approve"
              disabled={pending || !text.trim()}
              onClick={saveEdit}
            >
              {pending ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              className="btn"
              disabled={pending}
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <pre className="pre">{draftText || "(no draft text in payload)"}</pre>
          {canEdit ? (
            <div className="actions" style={{ marginTop: "0.75rem" }}>
              <button type="button" className="btn" onClick={startEdit}>
                Edit draft
              </button>
            </div>
          ) : null}
        </>
      )}

      {error ? (
        <p className="error-banner" style={{ marginTop: "0.75rem" }} role="alert">
          {error}
        </p>
      ) : null}

      {citations && citations.length > 0 ? (
        <div className="grounding">
          <h3 className="panel-subhead">Sources</h3>
          <p className="muted grounding-hint">Internal only · not sent to customer</p>
          <ul className="timeline grounding-list">
            {citations.map((c, i) => (
              <li key={c.id || String(i)}>
                <strong>{c.title || c.id || "policy"}</strong>
                {c.namespace ? (
                  <>
                    {" · "}
                    <span className="badge">{c.namespace}</span>
                  </>
                ) : null}
                {c.snippet ? (
                  <p className="grounding-snippet">{c.snippet}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!editing && status === "proposed" ? (
        <DecisionForm
          proposedActionId={proposedActionId}
          requestId={requestId}
          mode="draft_reply"
        />
      ) : null}

      {!editing && status === "approved" ? (
        <SendForm proposedActionId={proposedActionId} requestId={requestId} />
      ) : null}

      {!editing && status === "sent" ? (
        <p className="muted" style={{ marginBottom: 0 }}>
          Reply marked as sent. Check the recipient inbox / Sent folder.
        </p>
      ) : null}

      {!editing &&
      status !== "proposed" &&
      status !== "approved" &&
      status !== "sent" ? (
        <p className="muted" style={{ marginBottom: 0 }}>
          Decision recorded as <strong>{status}</strong>. No send available.
        </p>
      ) : null}
    </>
  );
}
