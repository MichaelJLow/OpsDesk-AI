# Failure Log

Meaningful failures found while building OpsDesk AI. Index also maintained in `PROJECT_CONTROL_CENTRE.md`.

---

## Template

### FAIL-XXX

| Field | Value |
|---|---|
| Date | YYYY-MM-DD |
| Scenario | |
| Symptom | |
| Root cause | |
| Production risk | |
| Fix | |
| Regression test | |
| Evidence | |

---

## Entries

### FAIL-001 — Gmail OAuth from n8n Docker fails TLS verify

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | n8n Lesson 1 — Gmail Trigger credential; Sign in with Google after consent |
| Symptom | Browser/callback shows `unable to verify the first certificate; if the root CA is installed locally, try running Node.js with --use-system-ca`. Credential fails to connect. |
| Root cause | Outbound TLS from the Linux n8n container cannot validate the certificate chain (network SSL interception / custom root CA). `--use-system-ca` does not help inside the container for Windows trust store. |
| Production risk | OAuth and all HTTPS integrations (Gmail, HubSpot, Slack, LLM) would fail or be unsafe if misconfigured. Blindly disabling TLS verify in production would enable MITM. |
| Fix | Local-only: `NODE_TLS_REJECT_UNAUTHORIZED=0` in `n8n/docker-compose.yml` (DEC-008). Longer-term: mount corp CA via `NODE_EXTRA_CA_CERTS`. |
| Regression test | After recreate: Gmail OAuth completes; trigger can poll. Before any deploy: assert env does **not** set `NODE_TLS_REJECT_UNAUTHORIZED=0`. |
| Evidence | Screenshot of OAuth error window; DEC-008 |

### FAIL-002 — POST insert invalid after Check existing (wrong `$json`)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 4 — IF true → POST into `requests` after GET check |
| Symptom | `Your request is invalid or could not be processed by the service` on HTTP Request POST |
| Root cause | After Check existing, `$json` refers to Supabase check output (empty or `{ id }`), not normalised email fields. Body sent blank/invalid columns. |
| Production risk | Silent bad inserts or failed writes whenever a node is inserted between normalise and side effect without updating expressions. |
| Fix | Use `$('Edit Fields').item.json.externalMessageId` (etc.) in POST body. **Body fix confirmed 2026-07-24** (duplicate key error = valid payload). Check/IF still not skipping before POST. |
| Regression test | Manual: new email inserts; existing `external_message_id` skips POST (false branch). |
| Evidence | n8n error on POST node; note in Control Centre |

### FAIL-003 — Duplicate guard IF not skipping before POST

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 4 — re-run workflow for already-stored Gmail `external_message_id` |
| Symptom | POST runs and Supabase returns `duplicate key value violates unique constraint "requests_external_message_id_key"` |
| Root cause | Check existing likely returns 0 rows / empty item so IF `id is empty` is true; DB unique constraint catches what IF missed. |
| Production risk | Duplicate attempts error instead of clean skip; noisy failures, harder recovery. |
| Fix | Check node used publishable/anon key; switched to service_role secret so GET returns existing `id`. IF false skips POST. |
| Regression test | Same message twice → second run false branch, no POST error. |
| Evidence | Supabase unique violation; Check success after secret key (2026-07-24) |

### FAIL-004 — Gemini 2.0 Flash free tier `limit: 0`

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 6 — Extract with Gemini HTTP POST |
| Symptom | 429 quota exceeded; metrics show `limit: 0` for `gemini-2.0-flash` |
| Root cause | Model deprecated / no free quota; not a simple rate-limit wait |
| Production risk | Hard dependency on a retired model id breaks extraction overnight |
| Fix | Switch URL model to `gemini-2.5-flash` (DEC-015) |
| Regression test | Boiler email returns structured JSON under `candidates[0].content.parts[0].text` |
| Evidence | n8n error payload citing `gemini-2.0-flash` limit 0 |

### FAIL-005 — IF node boolean vs string `"true"`

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 7 — IF after Zod validate |
| Symptom | `Wrong type: 'true' is a boolean but was expecting a string` |
| Root cause | Right-hand IF value typed as String while `$json.valid` is boolean |
| Production risk | Valid extractions never enter the happy path; silent stall |
| Fix | Set IF compare type to **Boolean** `true` |
| Regression test | Validate → IF true → Mark extraction valid runs |
| Evidence | n8n IF1 error on condition 0 |

### FAIL-006 — PATCH `request_extractions` id expression / pending stuck

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 7 — Mark extraction valid after Zod |
| Symptom | Zod returned valid data but Supabase `validation_status` stayed `pending`; Mark node not green until expression fixed |
| Root cause | Supabase `return=representation` often yields an array; `$('Store extraction').item.json.id` can be undefined — need `[0].id` or `.first().json.id` |
| Production risk | Downstream treats unvalidated extractions as done; audit trail lies |
| Fix | Use array-safe id expression; re-run full path; confirm `validation_status=valid` |
| Regression test | Full workflow → Table Editor shows `valid` on latest extraction |
| Evidence | Manual hard-coded PATCH then expression fix (2026-07-24) |

### FAIL-007 — Site lookup query params Name/Value swapped

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 9 — Lookup site HTTP GET |
| Symptom | PGRST100 `failed to parse filter (*)` |
| Root cause | n8n query field **Name** held `eq.Riverside Court` and **Value** held `*`, producing `?eq.Riverside Court=*` |
| Production risk | All PostgREST filters fail silently in UI misconfig |
| Fix | Prefer full URL `.../sites?name=eq.Riverside%20Court` (or Name=`name`, Value=`eq.…`) |
| Regression test | Lookup returns Riverside Court row |
| Evidence | n8n 400 + screenshot of swapped fields |

### FAIL-008 — Draft node grey despite “connected”

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 11 — Draft reply with Gemini after Slack |
| Symptom | Workflow green through Slack; Draft never executes; solo execute says Parse extraction unexecuted |
| Root cause | Connection looked attached but arrow not hooked; solo step cannot see upstream nodes |
| Production risk | Silent missing draft/notify steps in “completed” runs |
| Fix | Re-hook Slack → Draft; always **Execute workflow** end-to-end to verify |
| Regression test | Draft green; text in Gemini output |
| Evidence | Canvas screenshot with grey Draft |

### FAIL-009 — Store draft JSON body contained URL

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Scenario | Lesson 11 — Store proposed_actions |
| Symptom | `JSON Body` not valid JSON; starts with `https://ff…` |
| Root cause | Supabase URL pasted into body field when duplicating HTTP node |
| Production risk | Failed writes; confusing errors at end of long workflows |
| Fix | URL field = `.../proposed_actions`; body = action fields / JSON |
| Regression test | Row appears in `proposed_actions` with `draft_reply` |
| Evidence | n8n NodeOperationError text |

### FAIL-010 — Zod Validate uses `host.docker.internal` on VPS

| Field | Value |
|---|---|
| Date | 2026-07-26 |
| Scenario | VPS intake after import — Validate HTTP node |
| Symptom | Request lands in desk (store OK); pipeline stops at Validate; no Slack/draft |
| Root cause | Node still called `http://host.docker.internal:3040/...` (local Docker Desktop only). No automation-api on VPS. |
| Production risk | Partial intake looks “working” in inbox while CRM/Slack/draft never run |
| Fix | Deploy `opsdesk-automation-api` on `opsdesk` network; Validate URL → `http://opsdesk-automation-api:3040/v1/validate/extraction` (DEC-020) |
| Regression test | Manual Execute past Validate → HubSpot → Slack → draft; then published poll E2E |
| Evidence | Red Validate node; desk row without draft |


