# Decision Log

Detailed architectural and scope decisions for OpsDesk AI. Index also maintained in `PROJECT_CONTROL_CENTRE.md`.

---

## DEC-001 — Gmail polling for local development

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Inbound email must reach n8n during local development without requiring a public HTTPS endpoint.

### Alternatives considered

- Gmail polling trigger in n8n
- Gmail push / webhook via public tunnel (ngrok) or VPS
- Manual “send test payload” only (no real inbox)

### Chosen approach

Use **Gmail polling** during local development.

### Reason

Supports real inbox integration without exposing a public webhook. Matches the master build brief.

### Trade-offs

Requests arrive with a short delay versus push. Polling consumes API quota if interval is too aggressive.

### Follow-up

Switch to webhook intake after a stable public endpoint (e.g. VPS) is available. Revisit before continuous demo hosting.

---

## DEC-002 — Gemini as initial single LLM provider

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Version one needs one model provider for structured classification and drafting. Multiple providers increase cost and evaluation noise before the workflow is stable.

### Alternatives considered

- Gemini API (free tier for synthetic data)
- OpenAI
- Anthropic
- Multi-provider from day one

### Chosen approach

Start with **Gemini** only. Compare a small paid OpenAI or Anthropic budget later for evaluation.

### Reason

Low-cost development on synthetic data; stabilise workflow and fixtures before model shopping.

### Trade-offs

May need prompt adjustments when switching providers. Free-tier rate limits can affect demos.

### Follow-up

After labelled evaluation exists, run a controlled provider comparison and log results.

---

## DEC-003 — Flatten monorepo; relocate build pack under `docs/`

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

The handoff arrived as a nested `OpsDesk-AI-Build-Pack/` folder. The master brief defines a root monorepo with documentation under `/docs`.

### Alternatives considered

- Keep nested build pack as-is
- Flatten into root monorepo with `docs/` as source of truth

### Chosen approach

**Flatten**: move pack contents to `docs/`, create `apps/`, `services/`, `n8n/`, `scripts/`, `evaluation/`, `supabase/`.

### Reason

Matches agreed repository structure and keeps a single documentation home for Control Centre and logs.

### Trade-offs

One-time move; links inside old ZIP layouts break.

### Follow-up

None unless packaging a new handoff ZIP.

---

## DEC-004 — `project-status.json` as machine-readable Control Centre twin

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Session commands and agents need a small structured status file. The build pack required Control Centre updates but did not ship `project-status.json`.

### Alternatives considered

- Control Centre markdown only
- Markdown + `project-status.json`

### Chosen approach

Maintain **both**: human-readable Control Centre and `project-status.json` at repo root.

### Reason

Agents and future CI can read JSON without parsing the full markdown ledger. Markdown remains the living narrative source.

### Trade-offs

Two files can drift if only one is updated. End-session command must update both.

### Follow-up

Add a lightweight consistency check in CI later if drift becomes a problem.

---

## DEC-005 — Cursor start/end session commands (no always-on rule file)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Need persistent project-management discipline for build sessions without overloading every chat with a large always-apply rule.

### Alternatives considered

- `.cursor/rules/opsdesk-project.mdc` with `alwaysApply: true`
- `.cursor/commands/start-session.md` and `end-session.md` only
- Both

### Chosen approach

**Session commands only**: `/start-session` and `/end-session` under `.cursor/commands/`.

### Reason

Operator invokes session discipline intentionally. Avoids redundant always-on context; commands encode the exact start/end checklist.

### Trade-offs

Discipline depends on running the commands. Forgetting `/end-session` can leave Control Centre stale.

### Follow-up

Revisit an always-on thin rule only if session hygiene repeatedly fails.

---

## DEC-006 — Hands-on n8n workflow construction (initial slice)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | **Superseded** by DEC-023 (2026-07-27) |

### Context

For the first Quayside vertical slice, n8n workflows were constructed directly in the canvas so branching, credentials, polling, and error paths were owned end-to-end—not only demonstrated via an imported JSON file.

### Alternatives considered

- Import a finished workflow JSON on day one
- Scaffold JSON externally and paste into n8n
- Hybrid: scaffold + canvas ownership of critical nodes

### Chosen approach

**Canvas-first construction** for the intake path through draft/store. Workflow JSON exports only when explicitly requested for backup or portfolio evidence.

### Reason

Production-style fluency (IF branches, auth headers, duplicate guards, Slack/HubSpot side effects) is required for client delivery and hiring screens—not only a green demo path.

### Trade-offs

Slower than importing a complete workflow. More time on configuration detail; config mistakes feed the failure log.

### Follow-up

**Completed 2026-07-27:** Vertical slice + urgent route delivered on canvas. Superseded by DEC-023 (API-assisted iteration with documented review).

---

## DEC-023 — API-assisted n8n workflow iteration

| Field | Value |
|---|---|
| Date | 2026-07-27 |
| Status | Active |

### Context

The Quayside intake workflow is live on VPS through urgent/hazard routing. Hand-entering every remaining HTTP field slows delivery without improving architecture quality.

### Alternatives considered

- Keep canvas-only edits indefinitely (DEC-006)
- Unreviewed bulk workflow rewrites
- Export/import JSON only (no live API)

### Chosen approach

Use the **n8n Public API** (`N8N_API_KEY` in local `.env` only) to add/update nodes on VPS workflows. Each change is documented in-session (intent, node contract, verification). Operator reviews the canvas and runs lab tests. Never commit API keys. Sanitised workflow exports to the repo only on request.

### Reason

Canvas fluency is established; remaining work optimises for delivery speed and correctness across capability modules.

### Trade-offs

API PUTs can desync the canvas if malformed—mitigate with small diffs, backups under `tmp/` (gitignored), and a lab Execute after each change.

### Follow-up

`N8N_API_KEY` / `N8N_API_BASE_URL` placeholders in `.env.example`. Optional sanitised export under `n8n/workflows/` for portfolio evidence.

## DEC-007 — Dedicated Gmail test inbox preferred over plus-alias

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Need a real Gmail source for OpsDesk without polluting a personal inbox or confusing OAuth demos.

### Alternatives considered

- New free Gmail account dedicated to OpsDesk
- Plus-address / filter on existing Gmail (`you+opsdesk@gmail.com`)
- Google Workspace shared mailbox / Group

### Chosen approach

**Prefer a separate free Gmail account** for the OpsDesk test inbox. Plus-addressing on an existing account is an acceptable short-term fallback if creating a new account is blocked.

### Reason

Cleaner OAuth consent, clearer demos, no risk of personal mail entering the workflow, easier to revoke project access later.

### Trade-offs

One more account to manage. Plus-alias fallback shares credentials with personal mail and needs strict Gmail search filters in n8n.

### Follow-up

Document the chosen address in `ACCOUNT_SETUP_CHECKLIST.md` once created (email only — never tokens in docs).

**Update 2026-07-24:** Option B chosen in practice — `mikelow92+opsdesk@gmail.com` + label `OpsDesk` (dedicated Gmail blocked by Google verification while roaming on O2 UK in Brazil).

---

## DEC-008 — Temporary TLS verify disable for local n8n Docker (SSL interception)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active — local only |

### Context

Gmail OAuth from n8n in Docker fails after Google consent with: `unable to verify the first certificate` / Node `--use-system-ca` hint. Same class of issue previously seen with npm and git on this machine (TLS interception / custom root CA).

### Alternatives considered

- Mount corporate root CA into the container (`NODE_EXTRA_CA_CERTS`)
- Run n8n on the Windows host with `--use-system-ca`
- `NODE_TLS_REJECT_UNAUTHORIZED=0` inside Docker for local learning only
- n8n Cloud trial (avoids local TLS, but not our target stack)

### Chosen approach

Set `NODE_TLS_REJECT_UNAUTHORIZED=0` in [`n8n/docker-compose.yml`](../n8n/docker-compose.yml) for **local development only**, so Lesson 1 OAuth can complete.

### Reason

Unblocks learning and the first Gmail intake vertical slice immediately. Proper CA mounting needs the corp cert file and more setup time.

### Trade-offs

Disables TLS certificate verification for outbound HTTPS from the n8n container (MITM risk on hostile networks). Unacceptable for hosted/production. Must be removed or replaced with `NODE_EXTRA_CA_CERTS` before any shared deploy.

### Follow-up

Replace with mounted corporate CA when available. Never ship this env var to VPS/cloud. Revisit before Phase 10 portfolio “security” section — document honestly as a local network constraint.

---

## DEC-009 — Property maintenance (Quayside) is the first vertical

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

SaaS shared-inbox narrative was weaker for portfolio storytelling and for Mike’s operational background. Need a concrete small-company workflow.

### Alternatives considered

- Keep B2B SaaS sales/support/billing  
- Property maintenance only (no adaptability story)  
- Property maintenance first + inspection portability later  

### Chosen approach

**Quayside Property Services** — property maintenance as first vertical; rename away from Northline Cloud.

### Reason

Clearer ops story; safer/approval patterns map well; harbour-themed brand for portfolio.

### Trade-offs

Docs rewrite; historical SaaS screenshots must stay labelled historical.

### Follow-up

Draw Quayside-specific process diagrams; do not relabel old evidence.

---

## DEC-010 — Reusable core + vertical configuration

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Future consultancy use needs transferability without building two full products now.

### Chosen approach

Three layers: reusable core, vertical config packs, client config (documented). Build seams now; implement property only.

### Trade-offs

Some abstraction overhead; mitigated by forbidding simultaneous inspection build.

---

## DEC-011 — Inspection services is post-MVP portability proof

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Chosen approach

Track A after property slice is reliable and evaluated. Same engine; config/rules/schema extensions only.

---

## DEC-012 — Client-delivery methodology separate from synthetic build

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Chosen approach

`client-delivery/` templates and playbooks. No prices; no claimed client results.

---

## DEC-013 — Prefer generic core entities over property-only foundations

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Chosen approach

organisations/sites/assets/jobs/service_providers as concepts; property labels in UI/config. Avoid `tenant_name` on core workflow tables.

---

## DEC-014 — No schema migration until reviewed

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Chosen approach

Documentation pass only. Keep existing `companies`/`requests`/… tables. Propose sites/assets/jobs migration later with explicit approval.

---

## DEC-015 — Use Gemini 2.5 Flash (not 2.0) for free-tier extraction

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

`gemini-2.0-flash` returned free-tier quota `limit: 0` (deprecated / unavailable).

### Chosen approach

Call `gemini-2.5-flash` via `generativelanguage.googleapis.com` with `responseMimeType: application/json`.

### Trade-offs

Model ids change; pin version in prompt_version / model_name fields on `request_extractions`.

---

## DEC-016 — Zod validation via local automation-api HTTP

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

n8n must not silently accept LLM JSON. Validation belongs in TypeScript (Zod), not only in the workflow UI.

### Chosen approach

`services/automation-api` listens on `:3040`; `POST /v1/validate/extraction`. n8n (Docker) calls `http://host.docker.internal:3040/...`. IF on boolean `valid`; PATCH `request_extractions.validation_status`.

### Trade-offs

Must run automation-api locally during n8n tests. Later: containerise or deploy beside app.

---

## DEC-017 — Minimal `sites` table for property lookup

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Lesson 9 needed a Supabase property match for `siteReference` (Riverside Court). Full sites/assets/jobs migration still deferred.

### Chosen approach

Small `sites` table + unique lower(name) index + seed Riverside Court (`supabase/migrations/20260725000000_sites_minimal.sql`). Lookup via GET URL filters (not n8n query-fields UI).

### Trade-offs

Not the full vertical schema; companies table unused for site match. Expand later with reviewed migration.

---

## DEC-018 — Staff login via Supabase Auth (invite-only gate)

| Field | Value |
|---|---|
| Date | 2026-07-26 |
| Status | Active |

### Context

Dashboard was open on localhost with service-role data access. A public host (e.g. Vercel) needs a staff gate before any hiring-manager URL.

### Alternatives considered

- Shared env password / HTTP basic auth
- Auth.js credentials provider
- Supabase Auth email/password with middleware

### Chosen approach

**Supabase Auth** email/password, invite-only (create users in Supabase Dashboard; no public sign-up UI). Next.js middleware refreshes session and redirects anonymous users to `/login`. Service role remains for OpsDesk table reads/writes after login; **RLS deferred**.

### Trade-offs

Auth is an application gate, not row-level security yet. Compromised service role still bypasses Auth. Acceptable for lab; add RLS before multi-tenant production.

---

## DEC-019 — Integration failures via timeline + retry webhook

| Field | Value |
|---|---|
| Date | 2026-07-26 |
| Status | Active |

### Context

Phase 3 exit required failed integrations to be visible and retryable. Slack alerts alone are not enough for the operator desk / hiring-manager demo.

### Chosen approach

- On failure: `requests.status = needs_attention` and `workflow_events` with `status = error`  
- Dashboard: inbox attention count, workspace failure banner, emphasised error timeline rows  
- Retry: authenticated **Retry** POSTs to `N8N_RETRY_WEBHOOK_URL` (n8n resumes from a safe step; not full Gmail re-ingest)  
- Full Phase 7 recovery queue / DLQ deferred

### Trade-offs

Depends on n8n writing failure events correctly. Retry semantics are thin (webhook + operator retry), not automatic backoff.

---

## DEC-021 — Deterministic urgent/hazard routing (property)

| Field | Value |
|---|---|
| Date | 2026-07-27 |
| Status | Active |

### Context

Routine boiler slice routes everything to `#maintenance-intake`. Portfolio and Phase 6 require a second path for safety hazards. Model urgency alone is insufficient — false negatives are unsafe.

### Chosen approach

- Keep Zod validation unchanged.
- Add `POST /v1/route/property` on `automation-api` that applies keyword / category rules and **forces** `urgent_hazardous` + `urgent_maintenance` when matched.
- n8n IF on `escalated` → `#urgent-maintenance` Slack + urgent draft tone; else existing routine path.
- Dashboard shows urgency/hazard badges on inbox and workspace.

### Trade-offs

Keyword rules are brittle and language-specific (English lab). Expand with fixtures later; do not auto-dispatch contractors from this path.

---

## DEC-020 — Host n8n on VPS + automation-api sidecar

| Field | Value |
|---|---|
| Date | 2026-07-26 |
| Status | Active |

### Context

Local Docker n8n cannot receive hiring-manager webhook traffic from Vercel, and Gmail OAuth against a raw IP is blocked. Portfolio needs a real always-on automation host.

### Chosen approach

- n8n CE on Hetzner behind Caddy at **https://n8n.michaeljlow.com**
- Owner account: **`mikelow92@gmail.com`**
- `automation-api` as Docker service `opsdesk-automation-api` on shared `opsdesk` network (DEC-016 extended off-localhost)
- Vercel `N8N_SEND_WEBHOOK_URL` / `N8N_RETRY_WEBHOOK_URL` point at the VPS production webhooks
- Keep local n8n for editing/learning; only one intake workflow published against the shared Gmail inbox

### Trade-offs

Ops burden (SSH, disk, DNS, OAuth redirect URIs). Shared Supabase means local + VPS can race on duplicates if both poll.

---

## DEC-022 — Capability playbook over monolithic platform

| Field | Value |
|---|---|
| Date | 2026-07-27 |
| Status | Active |

### Context

Building OpsDesk as one enormous fictional platform risks months of scaffolding before anything is demoable. Portfolio and consulting positioning are stronger when each shippable unit is a complete operational capability.

### Alternatives considered

- Monolithic “OpsDesk platform” first, modules later
- Loose collection of unrelated demos with no shared spine
- Capability playbook: complete vertical slices now; compose strongest modules later

### Chosen approach

Treat OpsDesk as a **playbook of production-style AI workflow capabilities**. Each module:

- solves one clear operational problem;
- is a complete, demonstrable vertical slice;
- can stand alone as a portfolio case study;
- may later share data and connect into a broader operating system.

Portfolio language targets applied AI automation consulting and forward-deployed roles: patterns across request handling, approvals, research, CRM enrichment, document retrieval, task routing, customer operations, and human-in-the-loop execution — not “I built an AI dashboard.”

Extends DEC-010 (reusable core + vertical config): core is a shared spine of patterns; modules are the product units.

### Reason

Shows pattern fluency, not just one app. Keeps delivery paced to demoable outcomes. Avoids over-building integration before slices prove themselves.

### Trade-offs

Risk of shallow disconnected demos if module rules are ignored. Cross-module OS story must stay honest until 2–3 strong slices exist. Quayside remains the first vertical setting; playbook does not mean building every industry at once.

### Follow-up

Keep Control Centre §0 capability map current. Name modules by capability in README / portfolio materials. Connect shared data only deliberately after multiple slices ship.
