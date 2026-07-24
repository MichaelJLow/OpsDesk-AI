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
| Fix | Use `$('Edit Fields').item.json.externalMessageId` (etc.) in POST body. Pending confirmation on resume. |
| Regression test | Manual: new email inserts; existing `external_message_id` skips POST (false branch). |
| Evidence | n8n error on POST node; coaching note in Control Centre |

