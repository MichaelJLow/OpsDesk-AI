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
| Docker Desktop (+ WSL2 on Windows) | [ ] | **Required** before n8n can run |
| GitHub CLI (`gh`) | [ ] | Optional; useful for PRs |

## Cloud / SaaS accounts

| Account | Status | Where to put credentials |
|---|---|---|
| GitHub repo `MichaelJLow/OpsDesk-AI` | [x] | Exists (currently empty remote until push) |
| Supabase free project | [ ] | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` |
| HubSpot developer / test account + private app token | [ ] | `HUBSPOT_ACCESS_TOKEN` |
| Gmail test inbox + OAuth client | [ ] | `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` |
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
| Docker installed | | Pending |
| n8n up on :5678 | | Pending |
| n8n volume persistence | | Pending |
| Dashboard `/api/health` | 2026-07-24 | Verified: `{"ok":true,"service":"opsdesk-dashboard"}` on port 3010 |
| Supabase reachable | | Pending — project not created |
| Secrets excluded from Git | 2026-07-24 | `.gitignore` includes `.env` |
