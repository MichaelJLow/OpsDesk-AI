"use client";

import { useState, type ReactNode } from "react";

const TABS = [
  { id: "overview", label: "Case overview" },
  { id: "conversation", label: "Conversation" },
  { id: "evidence", label: "Evidence" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CaseTabs({
  overview,
  conversation,
  evidence,
  activity,
}: {
  overview: ReactNode;
  conversation: ReactNode;
  evidence: ReactNode;
  activity: ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("overview");

  const panels: Record<TabId, ReactNode> = {
    overview,
    conversation,
    evidence,
    activity,
  };

  return (
    <>
      <div className="case-tabs" role="tablist" aria-label="Case sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`case-tab${tab === item.id ? " active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {TABS.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          className="tab-panel"
          hidden={tab !== item.id}
        >
          {panels[item.id]}
        </div>
      ))}
    </>
  );
}
