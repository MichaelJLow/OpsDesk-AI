"use client";

import { useState, useTransition } from "react";
import { buildEvidencePack } from "./actions";

type Props = {
  requestId: string;
};

export function EvidencePackForm({ requestId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function generate() {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      const result = await buildEvidencePack({ requestId });
      if (!result.ok) {
        setError(result.error);
        setMarkdown(null);
        return;
      }
      setMarkdown(result.markdown);
    });
  }

  async function copy() {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: "0.5rem" }}>
        Build a markdown audit summary from this request’s extraction, actions,
        jobs, and timeline. Desk-only — no email or billing.
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={generate}
        >
          {pending ? "Generating…" : "Generate evidence pack"}
        </button>
        {markdown ? (
          <button
            type="button"
            className="btn"
            disabled={pending}
            onClick={copy}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="error-banner" style={{ marginTop: "0.75rem" }} role="alert">
          {error}
        </p>
      ) : null}
      {markdown ? (
        <pre className="pre" style={{ marginTop: "0.75rem" }}>
          {markdown}
        </pre>
      ) : null}
    </div>
  );
}
