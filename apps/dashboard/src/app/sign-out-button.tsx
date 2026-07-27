"use client";

import { useTransition } from "react";
import { logout } from "@/app/login/actions";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-quiet"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await logout();
        });
      }}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
