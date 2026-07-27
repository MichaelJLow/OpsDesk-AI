# n8n Workflow Runbook — Quayside Property Services

> **OpsDesk intake automation.** Primary workflow: `OpsDesk - Gmail intake` on VPS (`n8n.michaeljlow.com`). Edits may be applied via the n8n Public API (DEC-023); review in the UI and verify with lab runs. Early stages were built directly in the canvas (DEC-006, superseded).

## Pipeline

```text
Gmail → normalise → store → timeline → extract → validate
  → HubSpot + property lookup → route → Slack → draft → approval queue
```

## Build stages (property slice)

| # | Stage | Status |
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
| 11 | Draft reply + store | DONE (+ citations via `/v1/draft/with-citations`) |
| 12 | Failure write + retry webhook | DONE (12A HubSpot error path + retry live) |
| 13 | Urgent / hazard deterministic route | DONE |

Later: full support-intent Slack routing; pgvector if keyword retrieval is insufficient. Inspection vertical is Track A (post-MVP).

## Delivery log

| Date | Milestone |
|---|---|
| 2026-07-24 | Stages 1–11 — first vertical slice happy path (Quayside / boiler / Riverside Court) |
| 2026-07-26 | Hosted E2E — Vercel desk + VPS n8n; Zod sidecar; send/retry webhooks |
| 2026-07-27 | Stage 13 — `Route Property` → patch urgency → Slack urgent/intake; desk hazard badge |
| 2026-07-27 | Controlled/chargeable HITL — `chargeable` route flag, n8n approval branch, desk approve/reject without send |
| 2026-07-27 | Draft citations — Parse draft → `/v1/draft/with-citations`; citations on desk only (not customer email) |

---

## Stage 12 — Failure visible + retryable (DEC-019)

Dashboard shows `needs_attention` and error timeline rows; **Retry** POSTs to `N8N_RETRY_WEBHOOK_URL`.

### A) Write failures on the main intake workflow

**Live (Stage 12A):** `Hubspot Contact Lookup` uses **On Error → Continue (error output)**.

```text
Hubspot Contact Lookup
  ├─ success → If2 → … (happy path)
  └─ error   → Mark request needs attention
               → Log integration failed
               → Slack hubspot failed
```

- PATCH `requests.status = needs_attention`
- POST `workflow_events` (`integration_failed` / `hubspot_contact_lookup` / `error`)
- Slack alert for operator triage
- Desk **Retry** hits existing **OpsDesk retry failed request** webhook

### B) Retry webhook workflow

Name: **OpsDesk retry failed request** (already live on VPS).

Safe resume: do **not** re-insert from Gmail; clear failure / re-run enrichment from stored fields.

---

## Stage 13 — Urgent / hazard route (deterministic)

**Goal:** Safety language forces `#urgent-maintenance` even if the model under-calls urgency.

### Rules (`automation-api`)

`POST http://opsdesk-automation-api:3040/v1/route/property`

| Rule id | Trigger |
|---|---|
| `water_near_electrics` | Water/leak near electrics / light fitting / socket / fuse |
| `gas_or_co_hazard` | Gas smell/leak or CO alarm |
| `active_flooding` | Flooding / burst pipe / water coming through |
| `model_urgent_hazardous` | Model already set `category: urgent_hazardous` |
| `tenant_recharge_language` | Charge/invoice/recharge tenant |
| `improvement_works` | Replace carpet/flooring/kitchen/bathroom |
| `model_controlled_chargeable` | Model already set `category: controlled_chargeable` |
### Live wiring (VPS)

```text
Site found? (true)
  → Route Property
  → Patch request urgency
  → If escalated?
       ├─ true  → Log route escalated → Slack urgent → urgent draft…
       └─ false → If chargeable?
                    ├─ true  → Slack chargeable approval → Log route chargeable
                    │          → Store chargeable work → chargeable draft…
                    └─ false → Slack maintenance intake → routine draft…
```

Routing flags from `POST /v1/route/property`: `escalated`, `chargeable`, `requiresApproval`, `matchedRules`.
Urgent always wins over chargeable.

### Lab cases

**Urgent:** water dripping onto light fitting / wet near electrics → `#urgent-maintenance`, desk **hazard**.  
**Chargeable:** replace carpet + charge to tenant → `#approval-queue`, desk chargeable HITL panel.  
**Regression:** routine boiler → `#maintenance-inbox`, neither flag.