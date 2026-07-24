# OpsDesk AI — Project Control Centre

> This is the living source of truth for the project. Update it at the end of every meaningful build session.

**Project:** OpsDesk AI — Quayside Property Services (property-maintenance vertical)  
**Current phase:** Phase 1 / early Phase 3  
**Current milestone:** First working vertical slice (routine boiler maintenance)  
**Overall status:** Paused — resume at Lesson 8 (HubSpot)  
**Last updated:** 2026-07-24  
**Next review:** 2026-07-31  
**Remote:** https://github.com/MichaelJLow/OpsDesk-AI  

---

# 1. Current Focus

## This week's outcome

> Lessons 1–7 done through Zod validation of boiler extraction. Next: HubSpot + property lookup.

## Current task

- [ ] Lesson 8: HubSpot contact lookup.

## Next three tasks

- [ ] Lesson 9: Supabase property/site lookup
- [ ] Lesson 10: Routine route + Slack `#maintenance-intake`
- [ ] Lesson 11: Response draft + store

## Blockers

| Blocker | Owner | Next action | Status |
|---|---|---|---|
| HubSpot / Slack accounts | Mike | ACCOUNT_SETUP_CHECKLIST — needed for Lessons 8–10 | Open |

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
- [ ] HubSpot lookup added
- [ ] Slack notification added
- [ ] Draft response created
- [x] Workflow event timeline stored
- [x] Duplicate email blocked
- [ ] Failed integration visible
- [ ] Failed integration retryable

**Progress:** Lessons 1–7 done (through Zod + `validation_status=valid`). Lesson 8 = HubSpot contact lookup. Invalid branch wired (Mark invalid) but not formally regression-tested with bad JSON yet.

## Phase 4 — Operator dashboard

- [ ] Operations Inbox
- [ ] Request Workspace
- [ ] CRM context panel
- [ ] Structured extraction panel
- [ ] Draft response panel
- [ ] Workflow Timeline
- [ ] Loading, empty and error states
- [ ] Demo data reset

**Exit condition:** A hiring manager can understand the system without opening n8n.

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
| DEC-006 | 2026-07-24 | Manual n8n workflow build (learning-first) | Active | `docs/decision-log.md#dec-006` |
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

- Quayside Property Services docs pivot + `client-delivery/` toolkit
- n8n Lessons 1–7: Gmail → store → duplicate guard → timeline → Gemini extract → parse → `request_extractions` → Zod → `validation_status=valid`
- `automation-api` HTTP validate on `:3040`
- DEC-009–016; FAIL-001–006

## What did not ship?

- HubSpot / Slack accounts
- Lessons 8–11 (lookup, route, Slack, draft)
- Formal bad-JSON invalid-path regression
- Portfolio screenshots EVID-005–010 filed

## Most important learning

- Reference named nodes (`$('Edit Fields')`, `$('Insert request')`); Supabase representation often returns arrays (`[0].id`)
- Duplicate HTTP nodes instead of retyping Supabase headers
- Free-tier Gemini model ids go stale — pin current Flash (2.5)

## Most important failure

- FAIL-004 model quota 0; FAIL-006 PATCH left status `pending` until id expression fixed

## Evidence captured

- Mermaid sources EVID-001–003; screenshots EVID-005–010 still pending

## Decisions made

- DEC-009–016 (Quayside, seams, Gemini 2.5, Zod via automation-api)

## Metrics changed

- None measured (no evaluation run)

## Scope risks

- Do not start inspection vertical; do not migrate schema without review

## Next week's single outcome

> Lesson 8 HubSpot contact lookup, then property/site lookup toward routine Slack notify.

## Three committed tasks

- [ ] Create HubSpot test account + Quayside contact
- [ ] Lesson 8 HubSpot lookup by sender email
- [ ] Capture EVID-009–010 (extraction + valid status)

---

# 10. End-of-Session Checklist

Complete this after every meaningful build session.

- [x] Current task status updated.
- [x] New decisions logged.
- [x] Failures logged.
- [ ] Tests added or updated. — none automated this session; manual checks only
- [ ] Evidence captured. — sources yes; screenshots pending EVID-005–008
- [ ] Useful screenshots renamed and filed.
- [x] Metric changes recorded. — none; left blank honestly
- [ ] README/progress section updated where relevant.
- [x] Next task written clearly.
- [ ] Work committed to Git. — recommend commit below; not pushed this close-out

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
