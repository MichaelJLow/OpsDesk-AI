# n8n Manual Learning Path (Phase 3)

> **DEC-006:** You build every workflow in the n8n UI. The agent coaches; it does not auto-create the business workflow.

## Goal

Learn n8n as a job skill while delivering the sales vertical slice:

```text
Gmail → normalise → store → classify → validate → HubSpot → route → Slack → draft → timeline
```

## When to start

1. Docker Desktop installed
2. n8n running at http://localhost:5678 (data persists after restart)
3. Gmail test inbox chosen (see Gmail section in `ACCOUNT_SETUP_CHECKLIST.md`)
4. HubSpot + Slack + Gemini credentials available locally

## How sessions will work

1. Agent states the **one node (or small group)** to add and why.
2. You configure it in the UI (credentials, fields, branches).
3. You confirm what you see (screenshot or short description).
4. Only then move to the next step.
5. After the slice works, you export sanitised JSON into `n8n/workflows/` for the repo.

## Skills you will practise

| Skill | Where it shows up |
|---|---|
| Credentials / OAuth | Gmail, HubSpot, Slack, LLM |
| Trigger + polling | Gmail Trigger (poll) |
| Data mapping | Set / Edit Fields after Gmail |
| Branching | IF / Switch on category, confidence, errors |
| HTTP / code nodes | Supabase writes, Zod-style validation calls |
| Error workflow | Failed HubSpot/Slack → visible failure + retry path |
| Idempotency thinking | Skip if `external_message_id` already stored |
| Sub-workflows later | Approval / error handlers (Phases 6–7) |

## Do not

- Ask the agent to “just import a finished workflow” for the first build
- Commit real OAuth tokens or personal email bodies
- Jump to support/billing branches before the sales path works

## First hands-on lesson (when ready)

**Lesson 1 — Empty canvas + Gmail Trigger only** — DONE (2026-07-24)  
Outcome: real test email → execution with id / thread / snippet; filter `label:OpsDesk`.

**Lesson 2 — Edit Fields normalise** — DONE (2026-07-24)  
Outcome: `externalMessageId`, `senderEmail`, `subject`, `body`, `receivedAt`.

**Lesson 3 — Store raw request** — DONE (2026-07-24)  
Outcome: HTTP POST to Supabase `requests` with normalised fields.

**Lesson 4 — Duplicate guard** (next)  
Outcome: same `externalMessageId` does not insert twice (unique constraint / IF check).


