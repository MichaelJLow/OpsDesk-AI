# Architecture — OpsDesk AI (Property vertical)

## Layers

```text
Gmail
  → n8n (intake, orchestration, integrations)
  → Supabase (durable state + audit)
  → TypeScript rules + Zod (deterministic control)
  → LLM (extract / draft / propose only)
  → HubSpot (CRM context) + Slack (notify)
  → Next.js operator Control Centre
  → Human approval when required
  → Recovery queue on failure
```

## Three conceptual layers

1. **Reusable operational core**  
2. **Vertical configuration** (property-maintenance now; inspection later)  
3. **Client configuration** (real engagements — see `client-delivery/`)

## Responsibility split

| Component | Responsibility |
|---|---|
| n8n | Triggers, transport, HubSpot/Slack/Gmail, schedules, error workflows |
| TypeScript / Next.js | Rules, approvals, safe writes, schemas, vertical config, UI |
| Supabase | Source of truth for workflow state and audit |
| HubSpot | Organisations/contacts — not request state |
| LLM | Interpretation and drafting — propose only |

## Agent policy

No Mastra/LangGraph in v1. Optional later **Resolution Planner** (bounded tools, structured plan, no autonomous spend/dispatch). Not required for first slice.

## Historical note

Earlier diagrams under `docs/images/*` describing a SaaS sales/support/billing inbox are **historical** (pre–Quayside pivot). Property diagrams should be versioned as new sources (e.g. `manual-process-quayside.md`).

## Sequence (property)

Inbound → normalise → store → extract → validate → CRM + site context → rules → draft/propose → approve if needed → execute → audit → recover on failure.
