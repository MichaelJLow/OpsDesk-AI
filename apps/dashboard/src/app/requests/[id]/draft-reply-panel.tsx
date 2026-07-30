"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateDraftReply } from "./actions";
import { DecisionForm } from "./decision-form";
import { SendForm } from "./send-form";
import { actionStatusLabel } from "@/lib/labels";

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
  /** Hide approve/send here when the action dock owns them */
  embedActions?: boolean;
  /** Chargeable authority must be approved before send */
  sendLocked?: boolean;
};

export function DraftReplyPanel({
  proposedActionId,
  requestId,
  status,
  riskLevel,
  draftText,
  citations,
  editedBy,
  embedActions = true,
  sendLocked = false,
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
    <section className="section-block">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "0.55rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Proposed reply</h3>
        <span className="muted" style={{ fontSize: "0.72rem" }}>
          {actionStatusLabel(status)}
          {riskLevel ? ` · Risk ${riskLevel}` : ""}
          {editedBy ? " · Edited" : ""}
        </span>
      </div>

      {citations && citations.length > 0 ? (
        <p className="grounding-chip">
          <span aria-hidden="true">✓</span>
          Grounded by {citations.length} polic
          {citations.length === 1 ? "y" : "ies"}
        </p>
      ) : null}

      {editing ? (
        <div className="draft-editor">
          <textarea
            id="draft-text"
            className="draft-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            disabled={pending}
          />
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
          <div className="draft-toolbar" aria-hidden="true">
            <span className="draft-tool">B</span>
            <span className="draft-tool">I</span>
            <span className="draft-tool">List</span>
            <span className="draft-tool">Link</span>
          </div>
          <pre className="draft-preview">
            {draftText || "(no draft text in payload)"}
          </pre>
          <div className="actions">
            {canEdit ? (
              <button type="button" className="btn" onClick={startEdit}>
                Edit reply
              </button>
            ) : null}
            {sendLocked ? (
              <button type="button" className="btn btn-approve" disabled>
                Approve &amp; send
              </button>
            ) : null}
          </div>
        </>
      )}

      {error ? (
        <p className="error-banner" style={{ marginTop: "0.75rem" }} role="alert">
          {error}
        </p>
      ) : null}

      {embedActions && !editing && status === "proposed" ? (
        <DecisionForm
          proposedActionId={proposedActionId}
          requestId={requestId}
          mode="draft_reply"
        />
      ) : null}

      {embedActions && !editing && status === "approved" && !sendLocked ? (
        <SendForm proposedActionId={proposedActionId} requestId={requestId} />
      ) : null}

      {!editing && status === "sent" ? (
        <p className="muted" style={{ marginBottom: 0, marginTop: "0.75rem" }}>
          Reply sent. Check the recipient inbox / Sent folder.
        </p>
      ) : null}
    </section>
  );
}
