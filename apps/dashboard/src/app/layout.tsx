import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { LabMenu } from "./lab-menu";
import { SignOutButton } from "./sign-out-button";
import { getSessionUser } from "@/lib/supabase/server";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OpsDesk | Quayside Property Services",
  description: "Operator desk for Quayside Property Services (lab)",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div className="shell">
          <header className="topbar">
            <Link href={user ? "/" : "/login"} className="brand">
              <span className="brand-mark" aria-hidden="true">
                Q
              </span>
              <span className="brand-text">
                <strong className="brand-name">Quayside Property Services</strong>
                <span className="brand-product">OpsDesk</span>
              </span>
            </Link>
            <nav className="nav topbar-actions">
              {user ? (
                <>
                  <Link href="/" className="nav-link">
                    Inbox
                  </Link>
                  <span className="muted mono topbar-email">
                    {user.email ?? user.id}
                  </span>
                  <LabMenu />
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
