import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="panel login-panel">
        <h1 style={{ marginTop: 0, fontSize: "1.35rem" }}>Staff sign in</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          OpsDesk is invite-only. Use the staff account created in Supabase
          Auth.
        </p>
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
