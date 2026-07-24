# Account and Environment Setup Checklist

Manual setup. Never commit secrets. Local `.env` only.

Remote: https://github.com/MichaelJLow/OpsDesk-AI  
Fictional company: **Quayside Property Services** (property-maintenance vertical)

## Local tooling

| Item | Status | Notes |
|---|---|---|
| Git | [x] | |
| Node.js LTS | [x] | |
| Docker Desktop | [x] | |
| Python venv | [ ] | Phase 2 seeds |
| GitHub CLI | [ ] | Optional |

## Cloud / SaaS

| Account | Status | Notes |
|---|---|---|
| GitHub OpsDesk-AI | [x] | |
| Supabase | [x] | Project `ffcwzhntzdypketzfldo`; schema applied |
| Gmail OpsDesk label | [x] | `mikelow92+opsdesk@gmail.com` |
| HubSpot | [ ] | Client orgs/contacts for Quayside |
| Slack | [ ] | `#maintenance-intake` `#urgent-maintenance` `#approval-queue` `#automation-alerts` |
| Gemini (or chosen LLM) | [x] | API key in local `.env` (`GEMINI_API_KEY`) |
| Vercel / Sentry | [ ] | Later |

## Sample messages (property)

To: `mikelow92+opsdesk@gmail.com`

> Hi, the boiler in Flat 8 at Riverside Court has started making a loud rattling noise. The heating is still working. The tenant can provide access tomorrow after 2 pm. Could somebody take a look?

## Real-client note

A real deployment needs separate credential ownership and access review — see `client-delivery/SYNTHETIC_TO_REAL_TRANSLATION.md`.
