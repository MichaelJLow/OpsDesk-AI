# OpsDesk AI — Project Control Centre

> This is the living source of truth for the project. Update it at the end of every meaningful build session.

**Project:** OpsDesk AI  
**Current phase:** Phase 1 — Local infrastructure  
**Current milestone:** First working vertical slice  
**Overall status:** In progress  
**Last updated:** 2026-07-24  
**Next review:** 2026-07-31  
**Remote:** https://github.com/MichaelJLow/OpsDesk-AI  

---

# 1. Current Focus

## This week's outcome

> Finish Phase 1 exit condition: install Docker Desktop, start n8n with persistent volume, create Supabase and integration test accounts, then confirm the environment checklist.

## Current task

- [ ] Install Docker Desktop and start n8n via `n8n/docker-compose.yml` (confirm workflow persists after restart).

## Next three tasks

- [ ] Create Supabase project and apply `supabase/migrations/20260724000000_initial_schema.sql`
- [ ] Complete Gmail, HubSpot, Slack and Gemini test accounts (see `docs/ACCOUNT_SETUP_CHECKLIST.md`)
- [ ] Phase 2: Python seed script for synthetic Northline companies/contacts

## Blockers

| Blocker | Owner | Next action | Status |
|---|---|---|---|
| Docker Desktop not installed | Mike | Install Docker Desktop (+ WSL2), then `docker compose -f n8n/docker-compose.yml up -d` | Open |
| External test accounts not created | Mike | Follow `docs/ACCOUNT_SETUP_CHECKLIST.md` | Open |

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

- [ ] Docker Desktop installed
- [ ] n8n Community Edition running locally
- [ ] n8n persistent volume confirmed
- [x] Next.js application created
- [ ] Supabase project created
- [ ] Local database connection working
- [x] `.env.example` created
- [x] Secrets excluded from Git
- [ ] HubSpot test account created
- [ ] Gmail test inbox created
- [ ] Slack test workspace created
- [x] Health-check endpoint working

**Exit condition:** All local services and test accounts are available and the repository is clean.  
**Progress 2026-07-24:** Dashboard scaffold + `/api/health` verified (`{"ok":true}`). Docker Compose file ready at `n8n/docker-compose.yml` but Docker Desktop is not installed on this machine. Supabase/HubSpot/Gmail/Slack/Gemini accounts remain manual — see `docs/ACCOUNT_SETUP_CHECKLIST.md`.

## Phase 2 — Synthetic business environment

- [ ] Database schema implemented
- [ ] Python seed script created
- [ ] 30 companies generated
- [ ] 60 contacts generated
- [ ] 10 curated edge-case accounts created
- [ ] Policy documents created
- [ ] Support documents created
- [ ] HubSpot seeded
- [ ] Supabase seeded
- [ ] Reset process tested

**Exit condition:** The business environment can be recreated consistently from seed.

## Phase 3 — First vertical slice

- [ ] Gmail polling workflow created
- [ ] Email normalisation completed
- [ ] Raw request stored
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

**Exit condition:** One real sales enquiry completes the full path reliably.

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

- [ ] A real Gmail test email is received.
- [ ] Raw email content is stored.
- [ ] Structured model output is validated.
- [ ] HubSpot is searched.
- [ ] Slack is notified.
- [ ] A draft reply is created.
- [ ] Every workflow step is recorded.
- [ ] Duplicate processing is prevented.
- [ ] Failure can be retried safely.
- [ ] Evidence screenshots are captured.
- [ ] Decision log is updated.
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
| FAIL-001 | YYYY-MM-DD | Duplicate CRM contact | Retry repeated successful write | [ ] | `duplicate-contact-01` |

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

YYYY-MM-DD

## What shipped?

- 

## What did not ship?

- 

## Most important learning

- 

## Most important failure

- 

## Evidence captured

- 

## Decisions made

- 

## Metrics changed

- 

## Scope risks

- 

## Next week's single outcome

> 

## Three committed tasks

- [ ] 
- [ ] 
- [ ] 

---

# 10. End-of-Session Checklist

Complete this after every meaningful build session.

- [ ] Current task status updated.
- [ ] New decisions logged.
- [ ] Failures logged.
- [ ] Tests added or updated.
- [ ] Evidence captured.
- [ ] Useful screenshots renamed and filed.
- [ ] Metric changes recorded.
- [ ] README/progress section updated where relevant.
- [ ] Next task written clearly.
- [ ] Work committed to Git.

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
