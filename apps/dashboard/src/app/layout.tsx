import type { Metadata } from "next";
import { AppSidebar } from "./components/app-sidebar";
import { AppTopbar } from "./components/app-topbar";
import { getSessionUser } from "@/lib/supabase/server";
import { loadInboxRequests } from "@/lib/inbox";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsDesk | Quayside Property Services",
  description: "Maintenance command centre for Quayside Property Services",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  if (!user) {
    return (
      <html lang="en-GB">
        <body>
          <div className="app-shell guest">{children}</div>
        </body>
      </html>
    );
  }

  const { requests, approvalCount } = await loadInboxRequests();
  const openCount = requests.filter(
    (r) => !["sent", "executed_lab", "rejected"].includes(r.status),
  ).length;

  return (
    <html lang="en-GB">
      <body>
        <div className="app-shell">
          <AppSidebar
            requestCount={openCount}
            approvalCount={approvalCount}
            active="requests"
          />
          <div className="app-main">
            <AppTopbar email={user.email} />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
