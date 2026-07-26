"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { loginWithPassword } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    startTransition(async () => {
      try {
        const result = await loginWithPassword({ email, password, next });
        if (result && !result.ok) {
          setError(result.error);
          return;
        }
        router.refresh();
      } catch {
        // redirect() from the server action throws; treat as success
        router.refresh();
      }
    });
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label className="login-label">
        Email
        <input
          className="note-input"
          type="email"
          name="email"
          autoComplete="username"
          required
          disabled={pending}
        />
      </label>
      <label className="login-label">
        Password
        <input
          className="note-input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          disabled={pending}
        />
      </label>
      {error ? (
        <p className="error-inline" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn btn-approve" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
