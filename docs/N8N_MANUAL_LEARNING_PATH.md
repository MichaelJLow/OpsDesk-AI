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
| 12 | Failure write + retry webhook | Coach ready |

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

---

## Lesson 12 — Failure visible + retryable (DEC-019)

Dashboard already shows `needs_attention` and error timeline rows, and **Retry** POSTs to `N8N_RETRY_WEBHOOK_URL`.

### A) Write failures into OpsDesk (on the main intake workflow)

On a high-value node (HubSpot lookup or Slack notify), set **On Error → Continue** (or use an Error Trigger workflow) and add:

1. **HTTP Request** — PATCH/POST Supabase `requests`  
   - Set `status` = `needs_attention`  
   - Filter by request `id` from earlier in the run (`$('Insert request').first().json.id` or equivalent)

2. **HTTP Request** — POST Supabase `workflow_events` body example:

```json
{
  "request_id": "{{ $json.requestId }}",
  "event_type": "integration_failed",
  "step_name": "hubspot_contact_lookup",
  "status": "error",
  "error": "{{ $json.error?.message || 'HubSpot lookup failed' }}",
  "payload": {
    "integration": "hubspot"
  }
}
```

3. Optional: Slack `#automation-alerts` (you may already have this on site-miss).

### B) Retry webhook workflow (new)

Name: **OpsDesk retry failed request**

1. **Webhook** — path `opsdesk-retry-request`, method POST, respond immediately (or when last node finishes).  
   Production URL → root `.env` as `N8N_RETRY_WEBHOOK_URL=http://localhost:5678/webhook/opsdesk-retry-request`  
   (use `/webhook-test/...` only while listening for tests.)

2. **HTTP Request** — GET Supabase `requests?id=eq.{{ $json.body.requestId }}` (Include Response on).

3. **Safe resume (default):** do **not** re-insert from Gmail. Re-run from HubSpot onward using stored `sender_email` / `raw_body` / latest extraction:
   - HubSpot contact search by email  
   - Site lookup from extraction `siteReference` if present  
   - Slack notify (optional if already notified)  
   - Draft Gemini + store/update `proposed_actions`  
   - On success: PATCH request `status` to `proposed` (or prior happy status) + POST `workflow_events` `retry_succeeded` / `status: success`

4. On fail again: same as (A) — `needs_attention` + error event.

Dashboard **Retry** sends:

```json
{
  "requestId": "<uuid>",
  "triggeredBy": "staff@email",
  "lastErrorEventId": "...",
  "lastStep": "hubspot_contact_lookup"
}
```

### Lab test without a real outage

In Supabase SQL:

```sql
update requests
set status = 'needs_attention'
where id = '<request-uuid>';

insert into workflow_events (request_id, event_type, step_name, status, error, payload)
values (
  '<request-uuid>',
  'integration_failed',
  'hubspot_contact_lookup',
  'error',
  'Lab simulated HubSpot failure',
  '{"integration":"hubspot","simulated":true}'::jsonb
);
```

Refresh the workspace — failure banner + **Retry** should appear. Retry needs the webhook URL set and the workflow active.
