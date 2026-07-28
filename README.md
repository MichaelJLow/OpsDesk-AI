# OpsDesk

Operator desk for **Quayside Property Services** property-maintenance requests.

> An end-to-end AI workflow for property-maintenance requests: intake, rules-based routing, CRM context, grounded drafts, and human approval gates, with a full audit trail.

| | |
|---|---|
| Live desk | [opsdesk-quayside.vercel.app](https://opsdesk-quayside.vercel.app) |
| Case study | [michaeljlow.com/projects/opsdesk-ai](https://www.michaeljlow.com/projects/opsdesk-ai) |
| Story (canonical wording) | [`docs/portfolio-notes.md`](docs/portfolio-notes.md) |
| Demo seed | [`docs/demo/README.md`](docs/demo/README.md) |
| Repo | [github.com/MichaelJLow/OpsDesk-AI](https://github.com/MichaelJLow/OpsDesk-AI) |

Staff login is invite-only. The live desk uses synthetic Quayside data with real Gmail, HubSpot, Slack and Supabase integrations.

---

## Problem

Maintenance mail lands in a shared inbox. Urgent requests get buried. Chargeable work is mixed with day-to-day fixes. There is no clear approval step, and no reliable record of who decided what.

## Outcome

Every request becomes a **case** on the ops desk: classified, routed, drafted, with human approval when it matters, and auditable.

## What you can show

| Beat | What happens |
|---|---|
| Routine | Boiler email → AI draft → **Edit** (optional) → Approve → Send |
| Urgent | Water near electrics → hazard route + Slack escalation |
| Chargeable | Charge-to-tenant → approve authority → lab work order (**no invoice**) |
| Failure | HubSpot fails → `needs_attention` → Retry |
| Grounding | Internal **Sources** on the desk (not in the customer email) |
| Evidence | Export a markdown audit pack for the case |

Walkthrough seed (six ready cases, no email spam): gear menu on the desk → **Reset & seed walkthrough**, or `node scripts/seed-demo-walkthrough.mjs`.

---

## Architecture (one breath)

```text
Gmail → n8n (intake / Slack / draft)
      → automation-api (Zod validate · deterministic route · keyword retrieve)
      → Supabase
      → Next.js desk (approve / edit / send / lab execute / evidence)
```

**AI interprets** messy language. **Rules and humans** control risk (urgency, chargeable authority, send).

Stack: n8n · Next.js · TypeScript · Zod · Supabase · Gmail · HubSpot · Slack · Gemini · Docker · Vercel

---

## Repo layout

```text
apps/dashboard/           # Operator desk (Vercel)
services/automation-api/  # Validate / route / retrieve / draft citations
n8n/                      # Local compose + workflow notes
docs/                     # Control centre, story, demo pack
supabase/migrations/
evaluation/               # Thin routing fixtures (`npm run eval:routing`)
scripts/                  # Walkthrough seed
client-delivery/          # Synthetic → real engagement notes (methodology)
```

Living project status: [`docs/PROJECT_CONTROL_CENTRE.md`](docs/PROJECT_CONTROL_CENTRE.md) · [`project-status.json`](project-status.json)

---

## What this is / isn’t

**Is**

- A production-**style** lab with real integrations
- Quayside-first proof of HITL, safety routing, audit, thin recovery and retrieval
- A reusable workflow pattern (capability playbook), not a chatbot glued to an inbox

**Isn’t**

- A finished multi-tenant product or “autonomous property manager”
- Real invoicing, contractor SMS dispatch, or live client outcomes
- Full RLS / enterprise IAM (staff login yes; RLS deferred)
- Embeddings / pgvector (keyword retrieval by design for now)

---

## Local desk (short)

```bash
# From apps/dashboard — needs monorepo root .env (see .env.example)
npm install
npm run dev
```

Required env (root `.env`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Optional webhooks for send/retry: `N8N_SEND_WEBHOOK_URL`, `N8N_RETRY_WEBHOOK_URL`.

More detail: [`apps/dashboard/README.md`](apps/dashboard/README.md) · [`docs/README_START_HERE.md`](docs/README_START_HERE.md)

---

## Evaluation

Deterministic routing fixtures (no LLM spend):

```bash
cd services/automation-api
npm run eval:routing
```

---

## Licence / use

Personal portfolio / lab project. Not a public SaaS. Contact via [michaeljlow.com](https://www.michaeljlow.com) for workflow-audit conversations.
