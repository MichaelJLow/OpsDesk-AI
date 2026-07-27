# OpsDesk AI

AI-assisted **property-maintenance operations desk** for fictional **Quayside Property Services**.

> An end-to-end AI workflow for property-maintenance requests: intake, rules-based routing, CRM context, grounded drafts, and human approval gates, with a full audit trail.

Live desk: [opsdesk-quayside.vercel.app](https://opsdesk-quayside.vercel.app) · Story: [`docs/portfolio-notes.md`](docs/portfolio-notes.md)

## Status

| Field | Value |
|---|---|
| Vertical | Property maintenance (Quayside) |
| Focus | Portfolio packaging (story locked; demo pack + desk polish next) |
| Remote | [github.com/MichaelJLow/OpsDesk-AI](https://github.com/MichaelJLow/OpsDesk-AI) |

Living status: [`docs/PROJECT_CONTROL_CENTRE.md`](docs/PROJECT_CONTROL_CENTRE.md) · [`project-status.json`](project-status.json)

## Stack

n8n · Next.js · TypeScript · Zod · Supabase · Gmail · HubSpot · Slack · LLM · Docker · Vercel

## Structure

```text
apps/dashboard/
services/automation-api/
n8n/
docs/                 # project source of truth
client-delivery/      # synthetic → real methodology
supabase/migrations/
evaluation/
```

## Docs

Start: [`docs/README_START_HERE.md`](docs/README_START_HERE.md) · Portfolio story: [`docs/portfolio-notes.md`](docs/portfolio-notes.md)

## Demo beats

Routine → urgent → chargeable HITL → failure/retry → internal grounding → evidence pack. Lab notes: [`docs/demo/README.md`](docs/demo/README.md).

## Non-goals (lab)

No real invoicing or contractor dispatch; keyword retrieval (not pgvector); synthetic data only.
