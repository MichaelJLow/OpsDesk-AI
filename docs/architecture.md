# Architecture — OpsDesk AI (Draft v0)

## Purpose

Initial architecture for Northline Cloud’s shared-inbox automation. Version one uses n8n for orchestration and integrations, TypeScript for deterministic rules and secure writes, Supabase for durable state, and a single LLM for interpretation and drafting.

## Initial architecture (MVP)

```text
Gmail
  ↓
n8n polling trigger
  ↓
normalise and store request (Supabase)
  ↓
structured LLM call
  ↓
Zod validation
  ↓
HubSpot lookup
  ↓
deterministic routing rules
  ↓
Slack notification + response draft
  ↓
Supabase workflow timeline
  ↓
Next.js dashboard (visibility; after vertical slice)
```

## Responsibility split

| Component | Responsibility |
|---|---|
| **n8n** | Triggers, event transport, branching, HubSpot/Slack/Gmail nodes, schedules, error workflows |
| **TypeScript automation API** | Secure writes, permissions, deterministic rules, validation helpers, idempotency, state transitions |
| **LLM** | Classification, structured extraction, contextual drafting — propose only |
| **Supabase / PostgreSQL** | Companies, contacts, requests, extractions, proposed actions, approvals, workflow events, evaluations |
| **Next.js dashboard** | Operator inbox, review, timeline, failure recovery, metrics |

## Later architecture

```text
Gmail / webhook
       ↓
n8n integration layer
       ↓
TypeScript automation API
       ↓
PostgreSQL workflow state
       ↓
AI interpretation and retrieval
       ↓
deterministic policy checks
       ↓
human review
       ↓
approved external actions
       ↓
audit, monitoring and evaluation
```

## Agent-framework policy

Version one does **not** use Mastra, LangGraph, CrewAI or similar.

Add a separate framework only when:

- the model needs repeated bounded tool selection;
- stateful agent loops are genuinely required;
- n8n and typed calls become hard to maintain;
- the reason is logged in `docs/decision-log.md`.

## Data stores (outline)

Primary tables: `companies`, `contacts`, `requests`, `request_extractions`, `proposed_actions`, `approvals`, `workflow_events`, `evaluation_cases`, `evaluation_results`.

Full field list: `OpsDesk_AI_Master_Build_Brief.md` §7.

## Integrations

| System | Role in MVP |
|---|---|
| Gmail | Inbound test inbox (polling locally) |
| HubSpot | CRM lookup (and later controlled writes) |
| Slack | Team notifications |
| Gemini (initial) | Structured classification and drafting |
| Sentry | Error monitoring (wired in later phases) |
| Vercel | Dashboard hosting (later) |

## Security boundaries

- Secrets only in environment variables; never committed.
- Model output never executes sensitive writes directly.
- Recommendation → approval → execution are separate states.
- Least-privilege tokens for each integration.
- Synthetic PII only in this simulation.

## Diagram source

Mermaid draft for portfolio export: `docs/images/architecture-v0.md`.
