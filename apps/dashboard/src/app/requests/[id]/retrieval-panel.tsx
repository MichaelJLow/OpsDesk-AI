"use client";

import { useState, useTransition } from "react";
import { retrieveRequestContext } from "./actions";
import type { RetrievalHit } from "@/lib/retrieval/search";

type Props = {
  requestId: string;
};

export function RetrievalPanel({ requestId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [hits, setHits] = useState<RetrievalHit[] | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run() {
    setError(null);
    startTransition(async () => {
      const result = await retrieveRequestContext({ requestId });
      if (!result.ok) {
        setError(result.error);
        setHits(null);
        return;
      }
      setHits(result.hits);
      setQuery(result.query);
    });
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: "0.5rem" }}>
        Keyword retrieval over Quayside lab policies (warranty, chargeable,
        hazard, access). Citations only — not generated advice. No embeddings
        in this slice.
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn btn-approve"
          disabled={pending}
          onClick={run}
        >
          {pending ? "Retrieving…" : "Retrieve context"}
        </button>
      </div>
      {error ? (
        <p className="error-banner" style={{ marginTop: "0.75rem" }} role="alert">
          {error}
        </p>
      ) : null}
      {hits ? (
        <div style={{ marginTop: "0.75rem" }}>
          {query ? (
            <p className="muted mono" style={{ marginBottom: "0.5rem" }}>
              Query: {query.slice(0, 160)}
              {query.length > 160 ? "…" : ""}
            </p>
          ) : null}
          {hits.length === 0 ? (
            <p className="muted" style={{ margin: 0 }}>
              No matching documents.
            </p>
          ) : (
            <ul className="timeline">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <strong>{hit.title}</strong>
                  {" · "}
                  <span className="badge">{hit.namespace}</span>
                  {" · score "}
                  {hit.score}
                  <div className="muted mono">{hit.id}</div>
                  <p style={{ margin: "0.35rem 0 0" }}>{hit.snippet}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
