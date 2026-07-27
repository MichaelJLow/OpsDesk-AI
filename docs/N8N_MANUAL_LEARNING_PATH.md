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
| 13 | Urgent / hazard deterministic route | DONE |

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
**Lesson 13** done 2026-07-27 (`Route property` → `If escalated?` → Slack urgent / intake; routine + water/electrics lab both proven).

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

---

## Lesson 13 — Urgent / hazard route (deterministic)

**Goal:** Safety language forces `#urgent-maintenance` even if the model under-calls urgency.

### Rules (automation-api)

`POST http://opsdesk-automation-api:3040/v1/route/property`

Escalates when any match:

| Rule id | Trigger |
|---|---|
| `water_near_electrics` | Water/leak near electrics / light fitting / socket / fuse |
| `gas_or_co_hazard` | Gas smell/leak or CO alarm |
| `active_flooding` | Flooding / burst pipe / water coming through |
| `model_urgent_hazardous` | Gemini already set `category: urgent_hazardous` |

On escalate, response forces: `category: urgent_hazardous`, `urgency` at least `high`, `suggestedRoute: urgent_maintenance`, `escalated: true`, `matchedRules: [...]`.

### Exact build — do these nodes in order

**Where:** on **Site found? → true**, **before** `Slack maintenance intake`.  
**If1** stays Zod valid/invalid — do not put Route between Validate and If1.

```text
Site found? (true)
  → Route property
  → If escalated?
       ├─ true  → Slack urgent maintenance → Patch request urgency → draft path
       └─ false → Slack maintenance intake → draft path
```

#### Node 1 — `Route property`

1. Disconnect the wire into **`Slack maintenance intake`**.
2. **+** → **HTTP Request** → rename exactly **`Route property`**

| Setting | Value |
|---|---|
| Method | **POST** |
| URL | `http://opsdesk-automation-api:3040/v1/route/property` |
| Send Headers | **On** → `Content-Type` = `application/json` |
| Send Body | **On** → Body Content Type **JSON** → **Using JSON** |

Paste this body exactly:

```json
{
  "structured_output": {{ $('Validate with Zod').item.json.data.toJsonString() }},
  "raw_body": {{ $('Edit Fields').item.json.body.toJsonString() }},
  "subject": {{ $('Edit Fields').item.json.subject.toJsonString() }}
}
```

#### Node 2 — `If escalated?`

1. **+** after `Route property` → **If** → rename exactly **`If escalated?`**
2. Condition:

| Left | Operator | Right |
|---|---|---|
| `{{ $json.escalated }}` | **is equal to** | `true` |

Right-side type must be **Boolean** (not String). Same as If1 / FAIL-005.

#### Node 3 — `Slack urgent maintenance` (true branch)

1. Duplicate **`Slack maintenance intake`** (keeps auth/headers).
2. Rename exactly **`Slack urgent maintenance`**.
3. Put it on **`If escalated?` → true**.
4. Change body channel to your `#urgent-maintenance` Channel ID:

```json
{
  "channel": "C_URGENT_CHANNEL_ID",
  "text": "URGENT / HAZARD maintenance request\nSite: {{ $('Route property').item.json.siteReference }}\nUnit: {{ $('Route property').item.json.unitReference }}\nAsset: {{ $('Route property').item.json.assetType }}\nIssue: {{ $('Route property').item.json.issueSummary }}\nUrgency: {{ $('Route property').item.json.urgency }}\nRules: {{ $('Route property').item.json.matchedRules.toJsonString() }}\nSender: {{ $('Edit Fields').item.json.senderEmail }}\nRoute: {{ $('Route property').item.json.suggestedRoute }}"
}
```

Bot must be in the channel: `/invite @OpsDesk AI` in `#urgent-maintenance`.

#### Node 4 — reconnect false branch

Wire **`If escalated?` → false** → existing **`Slack maintenance intake`** (do not change that node).

#### Node 5 — `Patch request urgency` (true, after Slack urgent)

1. **+** after `Slack urgent maintenance` → **HTTP Request**
2. Rename exactly **`Patch request urgency`**

| Setting | Value |
|---|---|
| Method | **PATCH** |
| URL | `https://ffcwzhntzdypketzfldo.supabase.co/rest/v1/requests?id=eq.{{ $('Insert request').item.json.id }}` |
| Auth | Same Supabase Header Auth as other nodes |
| Send Body | **On** → JSON → **Using JSON** |

```json
{
  "category": "{{ $('Route property').item.json.category }}",
  "urgency": "{{ $('Route property').item.json.urgency }}"
}
```

If Insert returns an array, use `{{ $('Insert request').first().json.id }}`.

Wire both Slack paths into your existing draft chain when ready.

### Lab test email

To: `mikelow92+opsdesk@gmail.com`  
Subject: `URGENT water on light fitting Flat 8 Riverside Court`

> Hi, there is water dripping onto the light fitting in the hallway of Flat 8 at Riverside Court. It is still wet near the electrics. Please treat as urgent.

Expect: escalated true → urgent Slack → desk shows hazard / high urgency.

### Regression

Routine boiler email must still go to `#maintenance-inbox` with `escalated: false`.
