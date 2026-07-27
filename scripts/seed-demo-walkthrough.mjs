/**
 * Wipe all requests and seed portfolio walkthrough cases.
 * Uses root .env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 *   node scripts/seed-demo-walkthrough.mjs
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(path.join(root, "apps/dashboard/package.json"));
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.join(root, ".env");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const k = trimmed.slice(0, i).trim();
    let v = trimmed.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const fixtures = JSON.parse(
  readFileSync(path.join(root, "docs/demo/walkthrough-cases.json"), "utf8"),
);

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function wipeRequests() {
  const { data, error } = await supabase.from("requests").select("id");
  if (error) throw error;
  const ids = (data ?? []).map((r) => r.id);
  if (ids.length === 0) return 0;
  const { error: delErr } = await supabase.from("requests").delete().in("id", ids);
  if (delErr) throw delErr;
  await supabase.from("workflow_events").delete().is("request_id", null);
  return ids.length;
}

async function ensureOrg() {
  let companyId = null;
  let contactId = null;

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
    if (error) throw error;
    companyId = data.id;
  }

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
    if (error) throw error;
    contactId = data.id;
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id")
    .ilike("name", fixtures.siteName)
    .maybeSingle();

  if (!site) {
    const { error } = await supabase.from("sites").insert({
      name: fixtures.siteName,
      status: "active",
    });
    if (error && !String(error.message).includes("duplicate")) throw error;
  }

  return { companyId, contactId };
}

async function seedCase(c, companyId, contactId) {
  const externalId = `walkthrough:${c.slug}`;
  const hoursAgo = typeof c.receivedAtHoursAgo === "number" ? c.receivedAtHoursAgo : 0;
  const receivedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  const { data: request, error: reqErr } = await supabase
    .from("requests")
    .insert({
      external_message_id: externalId,
      sender_email: fixtures.senderEmail,
      subject: c.subject,
      raw_body: c.rawBody,
      category: c.category,
      confidence: c.extraction?.confidence ?? null,
      status: c.status,
      urgency: c.urgency,
      company_id: companyId,
      contact_id: contactId,
      received_at: receivedAt.toISOString(),
    })
    .select("id")
    .single();
  if (reqErr) throw reqErr;

  const { error: exErr } = await supabase.from("request_extractions").insert({
    request_id: request.id,
    model_provider: "demo_seed",
    model_name: "walkthrough",
    prompt_version: "demo-1",
    structured_output: c.extraction,
    validation_status: "valid",
  });
  if (exErr) throw exErr;

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
    if (draftErr) throw draftErr;
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
    if (chErr) throw chErr;
  }

  for (const ev of c.timeline || []) {
    const minutesAfter =
      typeof ev.minutesAfterReceived === "number" ? ev.minutesAfterReceived : 0;
    const occurredAt = new Date(receivedAt.getTime() + minutesAfter * 60 * 1000);
    const { error: evErr } = await supabase.from("workflow_events").insert({
      request_id: request.id,
      event_type: ev.event_type,
      step_name: ev.step_name,
      status: ev.status,
      error: ev.error ?? null,
      payload: { seeded: true, scenario: c.scenario },
      occurred_at: occurredAt.toISOString(),
    });
    if (evErr) throw evErr;
  }

  return request.id;
}

async function main() {
  console.log("Wiping existing requests…");
  const deleted = await wipeRequests();
  console.log(`Deleted ${deleted} request(s).`);

  const { companyId, contactId } = await ensureOrg();
  console.log("Seeding walkthrough cases…");

  for (const c of fixtures.cases) {
    const id = await seedCase(c, companyId, contactId);
    console.log(`  ${c.scenario}: ${c.slug} → ${id}`);
  }

  await supabase.from("workflow_events").insert({
    request_id: null,
    event_type: "demo_walkthrough_seeded",
    step_name: "scripts/seed-demo-walkthrough",
    status: "success",
    payload: {
      cases: fixtures.cases.map((c) => c.slug),
      deleted_before_seed: deleted,
    },
  });

  console.log("\nDone. Open the desk inbox for the six walkthrough cases.");
  console.log("Live proof email (send once when you want Gmail→n8n proof):");
  console.log(`  To: ${fixtures.liveProofEmail.to}`);
  console.log(`  Subject: ${fixtures.liveProofEmail.subject}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
