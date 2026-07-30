import { LabMenu } from "../lab-menu";
import { SignOutButton } from "../sign-out-button";
import { operatorDisplayName, operatorInitials } from "@/lib/format";

export function AppTopbar({
  email,
}: {
  email: string | null | undefined;
}) {
  const name = operatorDisplayName(email);
  const initials = operatorInitials(email);

  return (
    <header className="command-bar">
      <div className="command-search" role="search">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span>Search requests, residents, sites…</span>
        <kbd>⌘ K</kbd>
      </div>

      <div className="command-meta">
        <div className="integration-status" aria-label="Integration status">
          <span className="integration-pill">
            <span className="dot-ok" /> Gmail
          </span>
          <span className="integration-pill">
            <span className="dot-ok" /> HubSpot
          </span>
          <span className="integration-pill">
            <span className="dot-ok" /> Slack
          </span>
        </div>

        <button type="button" className="icon-btn" aria-label="Notifications">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
          <span className="notif-dot" />
        </button>

        <LabMenu />

        <div className="operator-chip" title={email ?? undefined}>
          <span className="operator-avatar" aria-hidden="true">
            {initials}
          </span>
          <span className="operator-name">{name}</span>
        </div>

        <SignOutButton />
      </div>
    </header>
  );
}
