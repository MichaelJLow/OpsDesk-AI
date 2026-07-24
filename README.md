# OpsDesk AI

AI-assisted **property-maintenance operations desk** for fictional **Quayside Property Services**.

> A reusable, vertical-configurable request-to-resolution system—property first, inspection portability later—with real integrations and synthetic data.

## Status

| Field | Value |
|---|---|
| Vertical | Property maintenance (Quayside) |
| Phase | 1 / early 3 |
| Remote | [github.com/MichaelJLow/OpsDesk-AI](https://github.com/MichaelJLow/OpsDesk-AI) |

Living status: [`docs/PROJECT_CONTROL_CENTRE.md`](docs/PROJECT_CONTROL_CENTRE.md) · [`project-status.json`](project-status.json)

## Stack

n8n · Next.js · TypeScript · Zod · Supabase · Gmail · HubSpot · Slack · LLM · Python · Docker · Vercel · Sentry

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

Start: [`docs/README_START_HERE.md`](docs/README_START_HERE.md)

## MVP slice

Routine boiler maintenance email through intake → store → extract → lookup → route → Slack → draft → timeline.

## Non-goals

No chatbot swarm, no inspection build during MVP, no autonomous spend/dispatch, no claimed real-client outcomes.
