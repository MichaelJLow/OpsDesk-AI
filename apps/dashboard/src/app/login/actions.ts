"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionResult =
  | { ok: true; next: string }
  | { ok: false; error: string };

function safeNextPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
  next?: string;
}): Promise<AuthActionResult> {
  const email = input.email.trim();
  const password = input.password;
  const next = safeNextPath(input.next);

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();

  // Clear any half-dead session cookies first. Localhost often keeps stale
  // refresh tokens that race with sign-in (AuthRefreshDiscardedError).
  await supabase.auth.signOut({ scope: "local" });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, next };
}

export async function logout(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
