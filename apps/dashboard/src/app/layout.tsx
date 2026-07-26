import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import { getSessionUser } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsDesk — Quayside",
  description: "Operator dashboard for Quayside Property Services",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en-GB">
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="brand">
              <strong>OpsDesk</strong>
              <span>Quayside Property Services — operator desk (lab)</span>
            </div>
            <nav className="nav topbar-actions">
              {user ? (
                <>
                  <Link href="/">Operations Inbox</Link>
                  <span className="muted mono topbar-email">
                    {user.email ?? user.id}
                  </span>
                  <SignOutButton />
                </>
              ) : null}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
