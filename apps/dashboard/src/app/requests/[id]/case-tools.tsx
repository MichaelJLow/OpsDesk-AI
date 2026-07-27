"use client";

import { useId, useState, type ReactNode } from "react";

export function CaseToolsDisclosure({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="panel panel-tools">
      <button
        type="button"
        className="case-tools-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>
          <strong>Case tools</strong>
          <span className="muted case-tools-hint">
            Retrieval and evidence pack
          </span>
        </span>
        <span className="case-tools-chevron" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="case-tools-body" id={panelId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
