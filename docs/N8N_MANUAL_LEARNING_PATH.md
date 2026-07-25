# n8n Manual Learning Path — Quayside Property Services

> **DEC-006:** You build workflows in the n8n UI. Coach does not auto-import the business workflow.

## Goal (property slice)

```text
Gmail → normalise → store → timeline → extract → validate
  → HubSpot + property lookup → route → Slack → draft
```

## Lesson map (~11 for this slice)

| # | Lesson | Status |
|---|---|---|
| 1 | Gmail Trigger + OpsDesk label | DONE |
| 2 | Edit Fields normalise | DONE |
| 3 | POST `requests` | DONE |
| 4 | Duplicate guard (Check → IF → POST) | DONE |
| 5 | `workflow_events` timeline | DONE |
| 6 | Structured boiler extraction (Gemini) | DONE |
| 7 | Zod validation + invalid path | DONE |
| 8 | HubSpot contact lookup | DONE |
| 9 | Supabase property/site lookup | DONE |
| 10 | Deterministic routine route + Slack | DONE |
| 11 | Draft reply + store | DONE |

Later (after slice): human approval, protected execution, retrieval, Resolution Planner, evaluation.  
Inspection examples appear only in post-MVP Track A.

## Completed log

**Lessons 1–4** done 2026-07-24 (intake through duplicate guard).  
**Lesson 5** done 2026-07-24 (`workflow_events` after successful `requests` insert).  
**Lesson 6** done 2026-07-24 (Gemini `gemini-2.5-flash` structured JSON for routine boiler).  
**Lesson 8** done 2026-07-24 (HubSpot contact search by email + Contact found? IF).  
**Lesson 9** done 2026-07-24 (minimal `sites` table + Lookup site; query params via URL not fields UI).  
**Lesson 10** done 2026-07-24 (Slack `chat.postMessage` → `#maintenance-intake`).  
**Lesson 11** done 2026-07-24 (Gemini draft + `proposed_actions` store). **First vertical slice happy path complete.** Domain = Quayside / boiler / Riverside Court.
