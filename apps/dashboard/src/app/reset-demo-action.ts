"use server";

import { revalidatePath } from "next/cache";
import { ensureServerEnv, getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";

export type DemoResetResult =
  | { ok: true; deletedRequests: number }
  | { ok: false; error: string };

function resetAllowed(): boolean {
  ensureServerEnv();
  if (process.env.DEMO_RESET_ENABLED === "true") {
    return true;
  }
  if (process.env.DEMO_RESET_ENABLED === "false") {
    return false;
  }
  return process.env.NODE_ENV === "development";
}

/**
 * Lab-only: wipe request run state. Keeps companies, contacts, sites.
 * Cascades clear extractions, proposed_actions, approvals, linked workflow_events.
 */
export async function resetDemoData(): Promise<DemoResetResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in required to reset demo data." };
  }

  if (!resetAllowed()) {
    return {
      ok: false,
      error:
        "Demo reset is disabled. Set DEMO_RESET_ENABLED=true in the monorepo root .env (lab only).",
    };
  }

  const supabase = getSupabaseAdmin();

  const { data: existing, error: countError } = await supabase
    .from("requests")
    .select("id");

  if (countError) {
    return { ok: false, error: countError.message };
  }

  const ids = (existing ?? []).map((row) => row.id as string);
  const deletedRequests = ids.length;

  if (deletedRequests > 0) {
    const { error: deleteError } = await supabase
      .from("requests")
      .delete()
      .in("id", ids);

    if (deleteError) {
      return { ok: false, error: deleteError.message };
    }
  }

  // Orphan timeline rows (no request_id)
  await supabase.from("workflow_events").delete().is("request_id", null);

  await supabase.from("workflow_events").insert({
    request_id: null,
    event_type: "demo_reset",
    step_name: "dashboard",
    status: "success",
    payload: {
      deleted_requests: deletedRequests,
      kept: ["companies", "contacts", "sites"],
    },
  });

  revalidatePath("/");
  revalidatePath("/requests", "layout");

  return { ok: true, deletedRequests };
}
