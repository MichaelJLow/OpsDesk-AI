"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { id: "overview", label: "Case overview" },
  { id: "conversation", label: "Conversation" },
  { id: "evidence", label: "Evidence" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function parseTab(value: string | null): TabId | null {
  if (
    value === "overview" ||
    value === "conversation" ||
    value === "evidence" ||
    value === "activity"
  ) {
    return value;
  }
  return null;
}

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromUrl = parseTab(searchParams.get("tab")) ?? "overview";
  const [tab, setTab] = useState<TabId>(fromUrl);

  useEffect(() => {
    setTab(fromUrl);
  }, [fromUrl]);

  function selectTab(next: TabId) {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

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
            onClick={() => selectTab(item.id)}
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
