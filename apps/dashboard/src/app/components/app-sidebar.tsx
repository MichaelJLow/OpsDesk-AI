import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  icon: "command" | "requests" | "approvals" | "orders" | "sites" | "contacts" | "audit" | "integrations" | "settings";
  badge?: number;
  badgeTone?: "default" | "warn";
  active?: boolean;
};

function NavIcon({ name }: { name: NavItem["icon"] }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "command":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "requests":
      return (
        <svg {...props}>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "approvals":
      return (
        <svg {...props}>
          <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "orders":
      return (
        <svg {...props}>
          <path d="M9 5h11v14H9z" />
          <path d="M4 8h5M4 12h5M4 16h5" />
        </svg>
      );
    case "sites":
      return (
        <svg {...props}>
          <path d="M3 21h18" />
          <path d="M5 21V8l7-4 7 4v13" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case "contacts":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
        </svg>
      );
    case "audit":
      return (
        <svg {...props}>
          <path d="M8 6h11M8 12h11M8 18h11" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      );
    case "integrations":
      return (
        <svg {...props}>
          <path d="M8 8h3v3H8zM13 13h3v3h-3z" />
          <path d="M11 9.5h2.5V12M13 14.5H10.5V12" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      );
  }
}

export function AppSidebar({
  requestCount = 0,
  approvalCount = 0,
  active = "requests",
}: {
  requestCount?: number;
  approvalCount?: number;
  active?: "command" | "requests" | "approvals";
}) {
  const primary: NavItem[] = [
    {
      href: "/",
      label: "Command centre",
      icon: "command",
      active: active === "command",
    },
    {
      href: "/",
      label: "Requests",
      icon: "requests",
      badge: requestCount > 0 ? requestCount : undefined,
      active: active === "requests",
    },
    {
      href: "/",
      label: "Approvals",
      icon: "approvals",
      badge: approvalCount > 0 ? approvalCount : undefined,
      badgeTone: "warn",
      active: active === "approvals",
    },
    { href: "/", label: "Work orders", icon: "orders" },
    { href: "/", label: "Sites", icon: "sites" },
    { href: "/", label: "Contacts", icon: "contacts" },
    { href: "/", label: "Audit & evidence", icon: "audit" },
  ];

  const footer: NavItem[] = [
    { href: "/", label: "Integrations", icon: "integrations" },
    { href: "/", label: "Settings", icon: "settings" },
  ];

  return (
    <aside className="app-sidebar" aria-label="OpsDesk navigation">
      <Link href="/" className="sidebar-brand">
        <span className="brand-mark">Q</span>
        <span className="brand-text">
          <span className="brand-product">OpsDesk</span>
          <span className="brand-org">Quayside Property Services</span>
        </span>
      </Link>

      <div className="workspace-switcher" title="Workspace">
        <span>
          <strong>Quayside Property Services</strong>
          <span>Maintenance operations</span>
        </span>
        <span className="workspace-chevron" aria-hidden="true">
          ▾
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {primary.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`sidebar-link${item.active ? " active" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
            {item.badge != null ? (
              <span
                className={`sidebar-badge${item.badgeTone === "warn" ? " warn" : ""}`}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {footer.map((item) => (
          <Link key={item.label} href={item.href} className="sidebar-link">
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
