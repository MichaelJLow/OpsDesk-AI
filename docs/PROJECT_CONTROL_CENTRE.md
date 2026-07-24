# OpsDesk AI — Project Control Centre

> This is the living source of truth for the project. Update it at the end of every meaningful build session.

**Project:** OpsDesk AI  
**Current phase:** Phase 1 — Local infrastructure  
**Current milestone:** First working vertical slice  
**Overall status:** Paused (end of session)  
**Last updated:** 2026-07-24  
**Next review:** 2026-07-31  
**Remote:** https://github.com/MichaelJLow/OpsDesk-AI  

---

# 1. Current Focus

## This week's outcome

> Local n8n + Gmail intake + normalise + Supabase store working; duplicate IF branch started (POST body must use Edit Fields refs — pause mid Lesson 4).

## Current task

- [ ] Resume Lesson 4: fix POST body to use `$('Edit Fields').item.json.*`, then verify true→insert / false→skip.

## Next three tasks

- [ ] Finish duplicate guard test (same email skips; new email inserts)
- [ ] HubSpot + Slack + Gemini accounts
- [ ] Lesson 5 preview: workflow_events timeline row

## Blockers

| Blocker | Owner | Next action | Status |
|---|---|---|---|
| Lesson 4 incomplete — POST used wrong `$json` after Check | Mike | On resume: paste Edit Fields expressions into POST body | Paused |

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

**Exit condition:** The problem, scope, workflow and portfolio story are clear before implementation starts. **Met 2026-07-24** (Mermaid sources in `docs/images/`; PNG export still recommended for portfolio).

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
- [ ] Structured AI classification added
- [ ] Zod validation added
- [ ] Invalid output handled
- [ ] HubSpot lookup added
- [ ] Slack notification added
- [ ] Draft response created
- [ ] Workflow event timeline stored
- [ ] Duplicate email blocked
- [ ] Failed integration visible
- [ ] Failed integration retryable

**Exit condition:** One real sales enquiry completes the full path reliably. **Not met.**  
**Progress:** Lessons 1–3 done (trigger → Edit Fields → POST `requests`). Lesson 4 duplicate IF in progress (Always Output Data + IF wired; POST must use `$('Edit Fields')` refs — paused).

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
| FAIL-002 | 2026-07-24 | POST after Check used wrong `$json` | `$json` was check result, not Edit Fields | [ ] pending on resume | Manual: duplicate + new email paths |

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

- Phase 0 complete; Phase 1 mostly stood up (Docker, n8n, Next health, Supabase schema + keys)
- n8n Lessons 1–3: Gmail → normalise → store in `requests`
- DEC-006–008; FAIL-001–002

## What did not ship?

- Lesson 4 duplicate guard finished
- HubSpot / Slack / Gemini
- Formal n8n persistence re-test
- Portfolio screenshots filed under `docs/images/`

## Most important learning

- Normalise early; after intermediate nodes, side effects must reference `$('Edit Fields')` not `$json`
- Local Docker TLS interception requires an explicit local-only workaround (DEC-008)

## Most important failure

- FAIL-001 Gmail OAuth TLS; FAIL-002 wrong `$json` on POST after Check

## Evidence captured

- Mermaid sources EVID-001–003; EVID-005–008 still need screenshots filed

## Decisions made

- DEC-006 manual n8n; DEC-007 plus-alias in practice; DEC-008 TLS verify off local-only

## Metrics changed

- None measured (no evaluation run)

## Scope risks

- Scope held to sales slice; do not jump to dashboard/support

## Next week's single outcome

> Finish Lesson 4 duplicate guard and capture n8n/Supabase evidence screenshots.

## Three committed tasks

- [ ] Resume Lesson 4 POST body fix + duplicate test
- [ ] Capture EVID-005–007 screenshots
- [ ] Create HubSpot or Slack test account

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
