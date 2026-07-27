# OpsDesk AI — Project Control Centre

> This is the living source of truth for the project. Update it at the end of every meaningful build session.

**Project:** OpsDesk AI — Quayside Property Services (property-maintenance vertical)  
**Current phase:** Phase 3 (happy path hosted; exit polish remaining)  
**Current milestone:** First working vertical slice (routine boiler maintenance)  
**Overall status:** In progress — hosted E2E proven (Vercel desk + VPS n8n)  
**Last updated:** 2026-07-27  
**Next review:** 2026-07-31  
**Remote:** https://github.com/MichaelJLow/OpsDesk-AI  

---

# 0. Build Philosophy — Capability Playbook

> **DEC-022.** OpsDesk is not one enormous fictional platform that takes months before anything works. It is a **playbook of real business capabilities**. Each module solves one clear operational problem as a complete, demonstrable vertical slice. Each slice can stand alone as a portfolio case study. Later, the strongest modules can share data and connect into a broader operating system.

## Positioning (what to say)

Prefer:

> I've built a reusable playbook of production-style AI workflows covering request handling, approvals, research, CRM enrichment, document retrieval, task routing, customer operations, and human-in-the-loop execution.

Avoid:

- “I build an AI dashboard”
- “Universal workflow platform”
- Claiming a finished multi-module OS before the slices exist

## Module rules

1. **One problem per module** — clear operational pain, not a feature list.
2. **Complete vertical slice** — happy path, failure path, audit trail, and operator loop (where relevant).
3. **Demoable alone** — a hiring manager should understand the module without the rest of OpsDesk.
4. **Shared spine, deferred integration** — reuse patterns (intake → structure → validate → act → audit → human gate); connect data/CRM/docs only after 2–3 slices prove the pattern.
5. **Name capabilities, not phases** — e.g. “urgent hazard routing with Slack escalation,” not “Phase 13 of OpsDesk.”
6. **Evidence per module** — each shippable slice produces screenshots, decisions, and limitations.

## Capability map (playbook inventory)

| Capability | Status | Notes |
|---|---|---|
| Request intake & normalisation | In progress / largely done | Gmail → store → timeline |
| Structured extraction + validation | Done (lab) | Gemini + Zod sidecar |
| CRM / property enrichment | Done (lab) | HubSpot + `sites` |
| Draft response + HITL approve/send | Done (lab hosted) | Desk + VPS webhooks |
| Urgent / hazard task routing | Done (lab hosted) | DEC-021; Lesson 13 proven 2026-07-27 |
| Failure visibility + retry | Done (thin) | DEC-019; full recovery queue later |
| Document retrieval / grounded support | Thin (keyword; desk-only citations) | Corpus + retrieve; draft `citations[]` internal; customer email stays clean |
| Controlled approvals (chargeable / auth) | Planned | Phase 6 as its own slice |
| Evaluation harness | Thin (routing fixtures) | `evaluation/fixtures/property-routing` + `npm run eval:routing`; full Gemini suite later |
| Cross-module shared operating system | Later | Only after strongest slices exist |

Phases 3–10 remain the build sequence; they are **delivery vehicles for capability modules**, not a mandate to ship one monolithic product before anything is portfolio-ready.

---

# 1. Current Focus

## This week's outcome

> Hosted Quayside ops: Vercel desk + VPS n8n intake/send/retry with Zod sidecar.

## Current task

- [ ] Verify `Log route escalated` on urgent lab run (API-added, DEC-023)

## Next three tasks

- [ ] Optional: urgent draft tone
- [ ] Lesson 12A intake failure write (optional polish)
- [ ] Loom / evidence capture (end of build)

## Blockers

| Blocker | Owner | Next action | Status |
|---|---|---|---|
| None | — | — | Clear |

---

# 2. Milestone Dashboard

## Phase 0 — Define and document

- [x] Repository created
- [x] Project brief added
- [x] Fictional company profile written
- [x] Manual workflow map created
- [x] Automated workflow map created
- [x] Scope and non-goals documented
- [x] Success metrics defined
- [x] Decision log started
- [x] Failure log started
- [x] Evidence folders created

**Exit condition:** The problem, scope, workflow and portfolio story are clear before implementation starts. **Met 2026-07-24**; **re-validated 2026-07-24** after Quayside property-maintenance pivot (company, audit, adaptability, client-delivery docs). Historical SaaS diagrams retained as versioned history under `docs/images/`.

## Phase 1 — Local infrastructure

- [x] Docker Desktop installed
- [x] n8n Community Edition running locally
- [ ] n8n persistent volume confirmed
- [x] Next.js application created
- [x] Supabase project created
- [x] Local database connection working
- [x] `.env.example` created
- [x] Secrets excluded from Git
- [ ] HubSpot test account created
- [x] Gmail test inbox created
- [ ] Slack test workspace created
- [x] Health-check endpoint working

**Exit condition:** All local services and test accounts are available and the repository is clean. **Not met** — HubSpot, Slack, Gemini still open; n8n volume persistence not formally re-verified after owner setup.  
**Progress 2026-07-24 (end-session):** Docker + `opsdesk-n8n` Up (HTTP 200). Gmail plus-alias + OAuth in n8n working. Supabase schema applied on reused project `ffcwzhntzdypketzfldo`; insert into `requests` confirmed. Local `.env` present (gitignored).

## Phase 2 — Synthetic business environment

- [x] Database schema implemented
- [ ] Python seed script created
- [ ] 30 companies generated
- [ ] 60 contacts generated
- [ ] 10 curated edge-case accounts created
- [ ] Policy documents created
- [ ] Support documents created
- [ ] HubSpot seeded
- [ ] Supabase seeded
- [ ] Reset process tested

**Exit condition:** The business environment can be recreated consistently from seed. **Not met** — schema only; no seed data yet.

## Phase 3 — First vertical slice

- [x] Gmail polling workflow created
- [x] Email normalisation completed
- [x] Raw request stored
- [x] Structured AI classification added
- [x] Zod validation added
- [x] Invalid output handled
- [x] HubSpot lookup added
- [x] Slack notification added
- [x] Draft response created
- [x] Workflow event timeline stored
- [x] Duplicate email blocked
- [x] Failed integration visible
- [x] Failed integration retryable

**Progress:** Lessons 1–11 DONE + dashboard failure banner/retry (DEC-019). Thin retry webhook on VPS proven. Intake error-write (12A) still optional polish. **2026-07-26:** VPS n8n + automation-api + Vercel webhooks — full poll → desk → Approve → Send E2E.

## Phase 4 — Operator dashboard

- [x] Operations Inbox
- [x] Request Workspace
- [x] CRM context panel
- [x] Structured extraction panel
- [x] Draft response panel
- [x] Workflow Timeline
- [x] Loading, empty and error states
- [x] Demo data reset

**Progress:** Inbox, workspace, CRM, extraction, draft approve/reject/send, timeline, demo reset, staff login (Supabase Auth). Service role for data; RLS deferred (DEC-018).

**Exit condition:** A hiring manager can understand the system without opening n8n. **Met for lab MVP** — hosted at https://opsdesk-quayside.vercel.app with Supabase Auth.

## Phase 5 — Support workflow

- [ ] Support intent added
- [ ] Support knowledge documents indexed
- [ ] Retrieval added
- [ ] Citations shown
- [ ] Severity rules implemented
- [ ] Low-confidence escalation added
- [ ] Support Slack routing added
- [ ] Support cases included in evaluation set

**Exit condition:** Support answers are grounded and uncertain cases escalate safely.

## Phase 6 — Sensitive account changes

- [ ] Account-change intent added
- [ ] Authorised-contact rules implemented
- [ ] Policy retrieval added
- [ ] Proposed action state added
- [ ] Human approval queue added
- [ ] Approve/edit/reject implemented
- [ ] Execution separated from approval
- [ ] Before-and-after values logged
- [ ] Confirmation email added
- [ ] Unauthorised request test added

**Exit condition:** Sensitive changes cannot execute without valid approval.

## Phase 7 — Reliability and recovery

- [ ] Idempotency keys
- [ ] Duplicate-message handling
- [ ] Structured-output retries
- [ ] Integration timeouts
- [ ] Exponential backoff
- [ ] Rate-limit handling
- [ ] Partial-failure states
- [ ] Recovery queue
- [ ] Manual replay
- [ ] Safe resume from failed step
- [ ] No duplicate external side effects

**Exit condition:** Failures are observable, recoverable and safe.

## Phase 8 — Evaluation

- [ ] 50 labelled scenarios
- [ ] Development/test split
- [ ] Expected categories defined
- [ ] Expected extracted fields defined
- [ ] Expected routes defined
- [ ] Required approvals defined
- [ ] Allowed actions defined
- [ ] Prohibited actions defined
- [ ] Batch runner completed
- [ ] Prompt/model versions stored
- [ ] Metrics calculated
- [ ] Regression suite running

**Exit condition:** Quality is measured repeatably instead of judged by feel.

## Phase 9 — Security and handover

- [ ] Role-based access
- [ ] Row Level Security
- [ ] Least-privilege scopes
- [ ] PII minimisation note
- [ ] Data-retention note
- [ ] Secrets-management review
- [ ] Operator guide
- [ ] Maintenance runbook
- [ ] Troubleshooting guide
- [ ] Training video

**Exit condition:** Another person could operate and maintain the system.

## Phase 10 — Portfolio release

- [ ] Portfolio project card
- [ ] Full case-study page
- [ ] Four-minute demo
- [ ] Live Demo Mode
- [ ] Architecture diagram
- [ ] Before-and-after workflow map
- [ ] Evaluation report
- [ ] GitHub README
- [ ] Screenshots
- [ ] Limitations section
- [ ] CV bullets updated
- [ ] LinkedIn project post drafted

**Exit condition:** A hiring manager can understand the project, evidence and trade-offs in under five minutes.

---

# 3. Definition of Done for the Current Milestone

## First vertical slice

- [x] A real Gmail test email is received.
- [x] Raw email content is stored.
- [ ] Structured model output is validated.
- [ ] HubSpot is searched.
- [ ] Slack is notified.
- [ ] A draft reply is created.
- [ ] Every workflow step is recorded.
- [ ] Duplicate processing is prevented.
- [ ] Failure can be retried safely.
- [ ] Evidence screenshots are captured.
- [x] Decision log is updated.
- [ ] README progress section is updated.

---

# 4. Evidence Ledger

Update this immediately after producing useful evidence.

| Evidence ID | Date | What it proves | File/link | Portfolio use | Captured? |
|---|---|---|---|---|---|
| EVID-001 | 2026-07-24 | Manual process mapped before coding | `docs/images/manual-process.md` | Problem section | [x] source |
| EVID-002 | 2026-07-24 | Automated workflow mapped | `docs/images/automated-process.md` | Solution section | [x] source |
| EVID-003 | 2026-07-24 | Architecture draft v0 | `docs/images/architecture-v0.md` | Technical section | [x] source |
| EVID-004 | YYYY-MM-DD | Failed HubSpot step recovered safely |  | Reliability section | [ ] |
| EVID-005 | 2026-07-24 | Gmail Trigger + OpsDesk label returns message | *capture screenshot from n8n* | Demo happy path | [ ] pending |
| EVID-006 | 2026-07-24 | Edit Fields normalises to OpsDesk shape | *capture screenshot* | Technical section | [ ] pending |
| EVID-007 | 2026-07-24 | Supabase `requests` row from n8n POST | *capture Table Editor* | Integrations | [ ] pending |
| EVID-008 | 2026-07-24 | OAuth TLS failure then local workaround | FAIL-001 / DEC-008 | Reliability | [ ] pending |
| EVID-009 | 2026-07-24 | Gemini structured boiler extraction JSON | *capture n8n Extract output* | Demo happy path | [ ] pending |
| EVID-010 | 2026-07-24 | `request_extractions` + `validation_status=valid` | *capture Table Editor* | Reliability / Zod | [ ] pending |
| EVID-011 | 2026-07-24 | Slack `#maintenance-intake` notify | *capture Slack message* | Demo happy path | [ ] pending |
| EVID-012 | 2026-07-24 | `proposed_actions` draft_reply row | *capture Table Editor* | Demo happy path | [ ] pending |
| EVID-013 | 2026-07-24 | Finished n8n canvas (full slice) | *capture when ready* | Portfolio | [ ] pending |

## Evidence types to collect

- [x] Manual workflow map
- [x] Automated workflow map
- [x] Architecture diagram
- [ ] Early n8n workflow
- [ ] Finished n8n workflow
- [ ] Successful execution trace
- [ ] Failed execution trace
- [ ] Human approval screen
- [ ] Recovery queue
- [ ] Evaluation results
- [ ] Metric improvement over versions
- [ ] User-testing notes
- [ ] Short screen recordings
- [ ] Final dashboard screenshots

---

# 5. Decision Ledger

Keep detailed entries in `docs/decision-log.md`. Use this table as the index.

| Decision | Date | Summary | Status | Link |
|---|---|---|---|---|
| DEC-001 | 2026-07-24 | Use Gmail polling during local development | Active | `docs/decision-log.md#dec-001` |
| DEC-002 | 2026-07-24 | Gemini as initial single LLM provider | Active | `docs/decision-log.md#dec-002` |
| DEC-003 | 2026-07-24 | Flatten monorepo; build pack under `docs/` | Active | `docs/decision-log.md#dec-003` |
| DEC-004 | 2026-07-24 | `project-status.json` twin of Control Centre | Active | `docs/decision-log.md#dec-004` |
| DEC-005 | 2026-07-24 | Cursor start/end session commands only | Active | `docs/decision-log.md#dec-005` |
| DEC-006 | 2026-07-24 | Hands-on n8n construction (initial slice) | **Superseded** by DEC-023 | `docs/decision-log.md#dec-006` |
| DEC-007 | 2026-07-24 | Dedicated Gmail test inbox preferred | Active | `docs/decision-log.md#dec-007` |
| DEC-008 | 2026-07-24 | Local n8n TLS verify disabled (SSL interception) | Active local-only | `docs/decision-log.md#dec-008` |
| DEC-009 | 2026-07-24 | Property maintenance (Quayside) is first vertical | Active | `docs/decision-log.md#dec-009` |
| DEC-010 | 2026-07-24 | Reusable core + vertical configuration | Active | `docs/decision-log.md#dec-010` |
| DEC-011 | 2026-07-24 | Inspection services = post-MVP portability proof | Active | `docs/decision-log.md#dec-011` |
| DEC-012 | 2026-07-24 | Client-delivery methodology separate from synthetic build | Active | `docs/decision-log.md#dec-012` |
| DEC-013 | 2026-07-24 | Prefer generic core entities over property-only foundations | Active | `docs/decision-log.md#dec-013` |
| DEC-014 | 2026-07-24 | No schema migration until reviewed | Active | `docs/decision-log.md#dec-014` |
| DEC-015 | 2026-07-24 | Gemini 2.5 Flash for free-tier extraction | Active | `docs/decision-log.md#dec-015` |
| DEC-016 | 2026-07-24 | Zod via local automation-api `:3040` | Active | `docs/decision-log.md#dec-016` |
| DEC-017 | 2026-07-24 | Minimal `sites` table for Lesson 9 lookup | Active | `docs/decision-log.md#dec-017` |
| DEC-018 | 2026-07-26 | Staff login via Supabase Auth (invite-only; RLS deferred) | Active | `docs/decision-log.md#dec-018` |
| DEC-019 | 2026-07-26 | Failures via workflow_events + needs_attention; retry webhook | Active | `docs/decision-log.md#dec-019` |
| DEC-020 | 2026-07-26 | Host n8n on VPS + automation-api sidecar | Active | `docs/decision-log.md#dec-020` |
| DEC-021 | 2026-07-27 | Deterministic urgent/hazard routing | Active | `docs/decision-log.md#dec-021` |
| DEC-022 | 2026-07-27 | Capability playbook over monolithic platform | Active | `docs/decision-log.md#dec-022` |
| DEC-023 | 2026-07-27 | API-assisted n8n workflow iteration | Active | `docs/decision-log.md#dec-023` |
| DEC-024 | 2026-07-27 | Minimal `jobs` table for lab protected execution | Active | `docs/decision-log.md#dec-024` |
| DEC-025 | 2026-07-27 | Desk evidence pack (audit markdown export) | Active | `docs/decision-log.md#dec-025` |
| DEC-026 | 2026-07-27 | Thin routing evaluation fixtures first | Active | `docs/decision-log.md#dec-026` |
| DEC-027 | 2026-07-27 | Keyword document retrieval before pgvector | Active | `docs/decision-log.md#dec-027` |
| DEC-028 | 2026-07-27 | Draft replies include lab policy citation footnotes | Active | `docs/decision-log.md#dec-028` |

A decision should be logged when it changes:

- architecture;
- scope;
- data model;
- integration strategy;
- security boundary;
- model/provider;
- workflow behaviour;
- portfolio presentation.

Do not log trivial formatting choices.

---

# 6. Failure and Learning Ledger

Keep detailed entries in `docs/failure-log.md`.

| Failure | Date | What broke | Root cause | Fixed? | Regression test |
|---|---|---|---|---|---|
| FAIL-001 | 2026-07-24 | Gmail OAuth TLS verify in n8n Docker | SSL interception / untrusted CA in container | [x] local workaround | Re-test OAuth after compose recreate; ban env in prod |
| FAIL-002 | 2026-07-24 | POST after Check used wrong `$json` | Intermediate node output | [x] `$('Edit Fields')` refs | New email inserts cleanly |
| FAIL-003 | 2026-07-24 | Duplicate guard IF not skipping | Check used anon key → empty GET | [x] service_role on Check | Same email → false, no POST |
| FAIL-004 | 2026-07-24 | Gemini 2.0 Flash `limit: 0` | Deprecated model on free tier | [x] use `gemini-2.5-flash` | Extraction JSON returns |
| FAIL-005 | 2026-07-24 | IF boolean vs string `true` | Wrong IF value type | [x] Boolean compare | Valid path reaches Mark |
| FAIL-006 | 2026-07-24 | PATCH extraction id / stuck `pending` | Array response; bad `.id` expr | [x] `[0].id` / re-test | `validation_status=valid` |
| FAIL-007 | 2026-07-24 | Supabase site lookup PGRST100 `filter (*)` | Query Name/Value swapped in n8n | [x] URL-style filters | Riverside Court row returns |
| FAIL-008 | 2026-07-24 | Draft Gemini grey / “node unexecuted” | Fake wire or solo execute | [x] Re-hook + full run | Draft + `proposed_actions` |
| FAIL-009 | 2026-07-24 | Store draft “JSON Body” was a URL | URL pasted into body field | [x] Body = action JSON | Row in `proposed_actions` |
| FAIL-010 | 2026-07-26 | Zod Validate dies on VPS | `host.docker.internal` / no API | [x] `opsdesk-automation-api` | Validate → Slack → draft |

Every meaningful failure should produce at least one of:

- a code fix;
- a workflow change;
- a regression test;
- a documentation change;
- a clearer operational warning.

---

# 7. Metrics Snapshot

Only use measured values.

| Metric | Current | Target | Previous | Trend |
|---|---:|---:|---:|---|
| Classification accuracy | — | 90%+ | — | — |
| Approval-gating accuracy | — | 100% | — | — |
| Workflow success rate | — | 95%+ | — | — |
| Recovery success rate | — | 100% | — | — |
| Average latency | — | < 15s | — | — |
| Average model cost | — | Track only | — | — |
| Human override rate | — | Track only | — | — |

---

# 8. Portfolio Readiness Checklist

## Playbook framing

- [x] Positioning is capability playbook, not “one AI platform” (DEC-022).
- [ ] At least one module is a standalone case study (routine request handling).
- [ ] Second module demoable alone (urgent routing or approvals).
- [ ] Capability list named in CV / LinkedIn language (not only phase numbers).
- [ ] Cross-module “operating system” story deferred until 2–3 slices ship.

## Problem evidence

- [x] The manual process is documented.
- [x] The bottlenecks are explicit.
- [x] The reason for automating is clear.
- [x] AI use is justified rather than assumed.

## Technical evidence

- [ ] Real APIs are used.
- [ ] Structured outputs are validated.
- [ ] Sensitive writes are deterministic.
- [ ] Human approval is visible.
- [ ] Failures and recovery are visible.
- [ ] Evaluation is repeatable.

## Business evidence

- [ ] Before-and-after process is clear.
- [ ] Time or manual steps are measured.
- [ ] Adoption or user testing is documented.
- [ ] Maintenance and handover are covered.

## Presentation evidence

- [ ] Hero screenshot.
- [ ] Architecture diagram.
- [ ] Four-minute demo.
- [ ] Public README.
- [ ] Limitations stated honestly.
- [ ] Actual metrics included.

---

# 9. Weekly Review

Complete once per week.

## Week ending

2026-07-24

## What shipped?

- Quayside docs pivot + `client-delivery/` toolkit (prior)
- n8n Lessons 1–11 happy path: Gmail → store → timeline → Gemini extract → Zod → HubSpot → `sites` → Slack → draft → `proposed_actions`
- HubSpot Legacy Private App + Slack OpsDesk Lab workspace
- Minimal `sites` migration + Riverside Court seed
- DEC-015–017; FAIL-004–009

## What did not ship?

- Phase 3 exit (failures visible/retryable; full evidence pack)
- Human approval before send
- Urgent-route channel split
- Operator dashboard (Phase 4)
- Formal bad-JSON invalid-path regression

## Most important learning

- Lab day ≠ client engagement calendar; price outcome not raw n8n hours
- n8n: verify connection hooks; prefer URL query for Supabase filters; use `.first()` across IF branches
- Hosted path: local-only URLs (`host.docker.internal`) must be replaced for VPS; one published intake only against shared Gmail
- Client delivery: they own n8n + OAuth/Private App/bot tokens

## Most important failure

- FAIL-010 Zod Validate on VPS (partial inbox insert looked “done”) — fixed with automation-api sidecar

## Evidence captured

- Hosted E2E proven (poll → desk → approve → send); screenshot files EVID-005–013 still pending

## Decisions made

- DEC-020 VPS n8n + automation-api; DEC-017 minimal sites; pricing notes (~£4.5k pilot band)

## Metrics changed

- None measured (no evaluation run)

## Scope risks

- Phase 3 not formally exit-complete (evidence + optional 12A). Do not auto-send without approve. Local + VPS dual-poll risk.

## Next week's single outcome

> Ship urgency badges to Vercel; capture evidence for urgent-route module.

## Three committed tasks

- [x] Urgent / hazard IF → `#urgent-maintenance`
- [ ] Commit/push route API + desk badges; redeploy Vercel
- [ ] Capture EVID screenshots / Loom at end of build

---

# 10. End-of-Session Checklist

Complete this after every meaningful build session.

- [x] Current task status updated.
- [x] New decisions logged.
- [x] Failures logged.
- [ ] Tests added or updated. — none automated; manual hosted E2E only
- [ ] Evidence captured. — E2E proven live; screenshot files EVID-005–013 still pending
- [ ] Useful screenshots renamed and filed.
- [x] Metric changes recorded. — none; left blank honestly
- [x] README/progress section updated where relevant. — n8n README + account checklist
- [x] Next task written clearly.
- [x] Work committed to Git. — this end-session + push

Recommended commit format:

```text
feat: add Gmail request ingestion
fix: prevent duplicate HubSpot writes
test: add unauthorised billing request case
docs: record CRM retry decision
```

---

# 11. Project Health Check

Score each category from 0 to 2 every Friday.

- 0 = absent
- 1 = partial
- 2 = strong

| Category | Score | Notes |
|---|---:|---|
| Scope control |  |  |
| Working software |  |  |
| Reliability |  |  |
| Evaluation |  |  |
| Security |  |  |
| Documentation |  |  |
| Portfolio evidence |  |  |
| Demo readiness |  |  |

**Total:** /16

Interpretation:

- **0–5:** Project is drifting or mostly conceptual.
- **6–10:** Building is progressing but evidence is incomplete.
- **11–13:** Strong working project with clear gaps.
- **14–16:** Portfolio-ready.

---

# 12. Rules for Keeping This Alive

1. This file is updated at the end of every meaningful build session.
2. Only one current task is allowed.
3. Only three next tasks are allowed.
4. Every meaningful failure becomes a logged learning.
5. Every architectural change becomes a decision.
6. Every milestone produces portfolio evidence.
7. Metrics are never guessed.
8. Scope additions require a documented reason.
9. A phase is not complete until its exit condition is met.
10. The portfolio story is developed alongside the code, not after it.
11. Ship complete capability modules (vertical slices), not platform scaffolding for its own sake (DEC-022).
12. Do not block a module’s demo on unfinished cross-module integration.
