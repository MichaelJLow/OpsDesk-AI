"use server";

import { revalidatePath } from "next/cache";
import fixturesJson from "@/lib/demo/walkthrough-cases.json";
import { ensureServerEnv, getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";

export type SeedWalkthroughResult =
  | { ok: true; deletedRequests: number; seeded: number }
  | { ok: false; error: string };

function seedAllowed(): boolean {
  ensureServerEnv();
  if (process.env.DEMO_RESET_ENABLED === "true") return true;
  if (process.env.DEMO_RESET_ENABLED === "false") return false;
  return process.env.NODE_ENV === "development";
}

type WalkthroughFixtures = {
  senderEmail: string;
  senderName: string;
  companyName: string;
  siteName: string;
  cases: Array<{
    slug: string;
    scenario: string;
    subject: string;
    rawBody: string;
    receivedAtHoursAgo?: number;
    category: string;
    urgency: string;
    status: string;
    extraction: Record<string, unknown>;
    draftText?: string | null;
    draftStatus?: string;
    citations?: unknown[];
    chargeable?: {
      status: string;
      summary: string;
      risk_level?: string;
    };
    timeline?: Array<{
      event_type: string;
      step_name: string;
      status: string;
      error?: string;
      minutesAfterReceived?: number;
    }>;
  }>;
};

const fixtures = fixturesJson as WalkthroughFixtures;

/**
 * Lab-only: wipe requests then seed the six portfolio walkthrough cases.
 */
export async function seedDemoWalkthrough(): Promise<SeedWalkthroughResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in required to seed walkthrough data." };
  }
  if (!seedAllowed()) {
    return {
      ok: false,
      error:
        "Demo seed is disabled. Set DEMO_RESET_ENABLED=true in the monorepo root .env (and Vercel lab env).",
    };
  }

  const supabase = getSupabaseAdmin();

  const { data: existing, error: countError } = await supabase
    .from("requests")
    .select("id");
  if (countError) return { ok: false, error: countError.message };

  const ids = (existing ?? []).map((row) => row.id as string);
  const deletedRequests = ids.length;
  if (deletedRequests > 0) {
    const { error: deleteError } = await supabase
      .from("requests")
      .delete()
      .in("id", ids);
    if (deleteError) return { ok: false, error: deleteError.message };
  }
  await supabase.from("workflow_events").delete().is("request_id", null);

  let companyId: string;
  const { data: existingCompany } = await supabase
    .from("companies")
    .select("id")
    .eq("name", fixtures.companyName)
    .maybeSingle();
  if (existingCompany?.id) {
    companyId = existingCompany.id;
  } else {
    const { data, error } = await supabase
      .from("companies")
      .insert({
        name: fixtures.companyName,
        industry: "property-maintenance",
        status: "active",
      })
      .select("id")
      .single();
    if (error || !data) {
      return { ok: false, error: error?.message || "Company insert failed." };
    }
    companyId = data.id;
  }

  let contactId: string;
  const { data: existingContact } = await supabase
    .from("contacts")
    .select("id")
    .eq("email", fixtures.senderEmail)
    .maybeSingle();
  if (existingContact?.id) {
    contactId = existingContact.id;
  } else {
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        company_id: companyId,
        name: fixtures.senderName,
        email: fixtures.senderEmail,
        role: "resident",
        authorised_for_account_changes: false,
      })
      .select("id")
      .single();
    if (error || !data) {
      return { ok: false, error: error?.message || "Contact insert failed." };
    }
    contactId = data.id;
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id")
    .ilike("name", fixtures.siteName)
    .maybeSingle();
  if (!site) {
    await supabase.from("sites").insert({
      name: fixtures.siteName,
      status: "active",
    });
  }

  for (const c of fixtures.cases) {
    const hoursAgo = c.receivedAtHoursAgo ?? 0;
    const receivedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const { data: request, error: reqErr } = await supabase
      .from("requests")
      .insert({
        external_message_id: `walkthrough:${c.slug}`,
        sender_email: fixtures.senderEmail,
        subject: c.subject,
        raw_body: c.rawBody,
        category: c.category,
        confidence: (c.extraction.confidence as number) ?? null,
        status: c.status,
        urgency: c.urgency,
        company_id: companyId,
        contact_id: contactId,
        received_at: receivedAt.toISOString(),
      })
      .select("id")
      .single();
    if (reqErr || !request) {
      return { ok: false, error: reqErr?.message || "Request insert failed." };
    }

    const { error: exErr } = await supabase.from("request_extractions").insert({
      request_id: request.id,
      model_provider: "demo_seed",
      model_name: "walkthrough",
      prompt_version: "demo-1",
      structured_output: c.extraction,
      validation_status: "valid",
    });
    if (exErr) return { ok: false, error: exErr.message };

    if (c.draftText) {
      const { error: draftErr } = await supabase.from("proposed_actions").insert({
        request_id: request.id,
        action_type: "draft_reply",
        payload: {
          channel: "email",
          draftText: c.draftText,
          citations: c.citations ?? [],
          citationsInternalOnly: true,
          retrievalQuery: c.subject,
        },
        reason: `Walkthrough seed: ${c.scenario}`,
        risk_level: c.category === "urgent_hazardous" ? "high" : "low",
        requires_approval: true,
        status: c.draftStatus || "proposed",
      });
      if (draftErr) return { ok: false, error: draftErr.message };
    }

    if (c.chargeable) {
      const { error: chErr } = await supabase.from("proposed_actions").insert({
        request_id: request.id,
        action_type: "chargeable_work",
        payload: {
          summary: c.chargeable.summary,
          subject: c.subject,
        },
        reason: c.chargeable.summary,
        risk_level: c.chargeable.risk_level || "medium",
        requires_approval: true,
        status: c.chargeable.status,
      });
      if (chErr) return { ok: false, error: chErr.message };
    }

    for (const ev of c.timeline || []) {
      const minutesAfter = ev.minutesAfterReceived ?? 0;
      const occurredAt = new Date(receivedAt.getTime() + minutesAfter * 60 * 1000);
      await supabase.from("workflow_events").insert({
        request_id: request.id,
        event_type: ev.event_type,
        step_name: ev.step_name,
        status: ev.status,
        error: ev.error ?? null,
        payload: { seeded: true, scenario: c.scenario },
        occurred_at: occurredAt.toISOString(),
      });
    }
  }

  await supabase.from("workflow_events").insert({
    request_id: null,
    event_type: "demo_walkthrough_seeded",
    step_name: "dashboard",
    status: "success",
    payload: {
      deleted_requests: deletedRequests,
      seeded: fixtures.cases.length,
      by: user.email?.trim() || user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/requests", "layout");

  return {
    ok: true,
    deletedRequests,
    seeded: fixtures.cases.length,
  };
}
