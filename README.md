# OpsDesk AI

AI-powered request-to-resolution automation for a shared business inbox.

OpsDesk AI is a production-style portfolio project that turns inbound sales, support and account-change emails into routed, reviewed and completed actions across Gmail, HubSpot, Slack and an internal operations dashboard.

> A production-style simulation built with real integrations and synthetic company data, allowing the entire workflow to be demonstrated without exposing confidential information.

## Current status

| Field | Value |
|---|---|
| Phase | Phase 0 — Define and document |
| Milestone | First working vertical slice |
| Remote | [github.com/MichaelJLow/OpsDesk-AI](https://github.com/MichaelJLow/OpsDesk-AI) |

Living status: [`docs/PROJECT_CONTROL_CENTRE.md`](docs/PROJECT_CONTROL_CENTRE.md) and [`project-status.json`](project-status.json).

Session commands: `/start-session` and `/end-session` (see [`.cursor/commands/`](.cursor/commands/)).

## Stack

- n8n Community Edition
- Next.js / React / TypeScript
- Zod
- Supabase / PostgreSQL
- Gmail, HubSpot, Slack
- One LLM provider initially (Gemini recommended for development)
- Python (seed and evaluation)
- Docker, GitHub Actions, Sentry, Vercel

## Repository structure

```text
opsdesk-ai/
├── .cursor/commands/       # start-session / end-session
├── apps/dashboard/         # Next.js operator dashboard
├── services/automation-api/# Deterministic rules and secure writes
├── n8n/                    # Docker Compose + exported workflows
├── scripts/                # Python seed and evaluation tooling
├── evaluation/             # Labelled scenarios
├── supabase/migrations/    # Schema migrations
├── docs/                   # Source-of-truth project documentation
├── .env.example
├── project-status.json
└── README.md
```

## Documentation

Start with [`docs/README_START_HERE.md`](docs/README_START_HERE.md).

Key docs:

- [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md)
- [`docs/BUILD_ROADMAP.md`](docs/BUILD_ROADMAP.md)
- [`docs/TECHNICAL_ARCHITECTURE.md`](docs/TECHNICAL_ARCHITECTURE.md)
- [`docs/OpsDesk_AI_Master_Build_Brief.md`](docs/OpsDesk_AI_Master_Build_Brief.md)
- [`docs/PROJECT_CONTROL_CENTRE.md`](docs/PROJECT_CONTROL_CENTRE.md)

## MVP (first vertical slice)

```text
Gmail → n8n → store → structured AI classification → Zod validation
  → HubSpot lookup → deterministic route → Slack → draft → timeline
```

Sales enquiries first. Support, billing approvals and full dashboard come after this path works end to end.

## Local setup (Phase 1)

1. Copy `.env.example` to `.env` and fill values locally (never commit secrets).
2. Start n8n: `docker compose -f n8n/docker-compose.yml up -d`
3. Start the dashboard: `cd apps/dashboard && npm run dev`
4. Open n8n at `http://localhost:5678` and the app at `http://localhost:3000`

See [`docs/ENVIRONMENT_AND_SETUP.md`](docs/ENVIRONMENT_AND_SETUP.md) for account checklists.

## Non-goals

No generic chatbot, multi-agent swarm, agent framework in v1, full CRM, or UI polish before the workflow works.
