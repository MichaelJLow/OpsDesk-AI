# Account and Environment Setup Checklist

Manual setup required from the project owner. Do **not** commit secrets. Put values only in a local `.env` (gitignored).

Repository remote: https://github.com/MichaelJLow/OpsDesk-AI

## Local tooling

| Item | Status | Notes |
|---|---|---|
| Git | [x] | Local repo initialised; `origin` set |
| Node.js LTS | [x] | v24.14.0 detected |
| npm | [x] | Dashboard and automation-api installs succeeded |
| Python 3 + venv | [ ] | Needed for Phase 2 seed scripts |
| Docker Desktop (+ WSL2 on Windows) | [x] | Installed; Engine running (2026-07-24) |
| GitHub CLI (`gh`) | [ ] | Optional; useful for PRs |

## Cloud / SaaS accounts

| Account | Status | Where to put credentials |
|---|---|---|
| GitHub repo `MichaelJLow/OpsDesk-AI` | [x] | Scaffold pushed; local has uncommitted session docs/n8n changes |
| Supabase free project | [x] | Reusing Macro Signal / AI Pulse. Schema applied. URL + publishable + secret in local `.env` (2026-07-24) |
| HubSpot developer / test account + private app token | [ ] | `HUBSPOT_ACCESS_TOKEN` |
| Gmail test inbox + OAuth client | [x] | Plus-alias `mikelow92+opsdesk@gmail.com` + label `OpsDesk`. n8n Gmail Trigger connected; Fetch Test Event returns id/thread/snippet (2026-07-24) |

## Gmail options (DEC-007)

You do **not** get a true separate mailbox inside a free personal Gmail the way Workspace shared inboxes work. Practical choices:

| Option | How | Recommendation |
|---|---|---|
| **A. New free Gmail** (preferred) | Create e.g. `northline.ops.desk@gmail.com` (or similar). Use only for OpsDesk tests. Connect that account in n8n. | **Best** for demos, OAuth isolation, and portfolio clarity |
| **B. Plus-address + filter** (fallback) | Send tests to `yourname+opsdesk@gmail.com`. Create a Gmail filter → label `OpsDesk`. In n8n Gmail Trigger, search/filter that label. | OK short-term; still the same account and OAuth as personal mail |
| **C. Google Workspace shared mailbox** | Needs a paid Workspace domain | Overkill for this project unless you already have it |

**Practical advice:** use **Option A**. Keep personal Gmail out of the automation. If you must use Option B, never process the whole inbox — always filter by label/query so personal mail cannot enter the workflow.

Record the chosen address here once decided (email only):

- OpsDesk test inbox: `mikelow92+opsdesk@gmail.com` → same account as `mikelow92@gmail.com` (Option B plus-alias + label `OpsDesk`, DEC-007 fallback)
- Chosen: **2026-07-24** (dedicated Gmail blocked while roaming in Brazil; revisit Option A later if useful)





| Slack test workspace + bot | [ ] | `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET` |
| Gemini API key (initial LLM) | [ ] | `GEMINI_API_KEY` |
| Vercel account | [ ] | Deploy later |
| Sentry free project | [ ] | `SENTRY_DSN` |

## Slack channels to create

- [ ] `#sales-enquiries`
- [ ] `#customer-support`
- [ ] `#billing-approvals`
- [ ] `#automation-alerts`

## After accounts exist

1. Copy `.env.example` → `.env` and fill values.
2. Apply `supabase/migrations/20260724000000_initial_schema.sql` in the Supabase SQL editor.
3. Install Docker Desktop, then:
   ```powershell
   docker compose -f n8n/docker-compose.yml up -d
   ```
4. Confirm n8n at http://localhost:5678 and that a test workflow survives restart.
5. Tick Phase 1 items in `PROJECT_CONTROL_CENTRE.md` only after demonstrated.

## Verification log

| Check | Date | Result |
|---|---|---|
| Docker installed | 2026-07-24 | OK — Docker Desktop 4.83 / Engine 29.6.2 |
| n8n up on :5678 | 2026-07-24 | Container `opsdesk-n8n` Up — open http://localhost:5678 |
| n8n volume persistence | | Pending — create owner account, then restart to confirm |
| Dashboard `/api/health` | 2026-07-24 | Verified: `{"ok":true,"service":"opsdesk-dashboard"}` on port 3010 |
| Supabase reachable | 2026-07-24 | Schema applied; URL + keys in local `.env` (not committed) |
| Secrets excluded from Git | 2026-07-24 | `.gitignore` includes `.env` |
