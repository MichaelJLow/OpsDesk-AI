import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="panel login-panel">
        <p className="brand-product" style={{ margin: "0 0 0.35rem" }}>
          OpsDesk
        </p>
        <h1 style={{ marginTop: 0, fontSize: "1.6rem" }}>Staff sign in</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Quayside Property Services operator desk. Invite-only staff accounts
          via Supabase Auth.
        </p>
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
