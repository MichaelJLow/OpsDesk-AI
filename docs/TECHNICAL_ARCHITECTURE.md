# Technical Architecture

## Core stack

- n8n Community Edition
- Next.js
- React
- TypeScript / Node.js
- Zod
- Supabase / PostgreSQL
- Gmail
- HubSpot
- Slack
- Gemini, OpenAI or Anthropic API
- Python
- GitHub Actions
- Sentry
- Vercel

## Responsibility split

### n8n

- triggers;
- event transport;
- branching;
- sub-workflows;
- integrations;
- scheduled jobs;
- error workflows.

### TypeScript service

- secure write operations;
- permissions;
- deterministic rules;
- validation;
- idempotency;
- business-state transitions.

### LLM

- language classification;
- structured extraction;
- contextual drafting;
- retrieval-assisted recommendation.

### Supabase

- business source of truth;
- workflow state;
- audit history;
- approvals;
- evaluation records.

### Dashboard

- operator visibility;
- human review;
- failure recovery;
- metrics.

## Initial architecture

```text
Gmail
  ↓
n8n polling trigger
  ↓
normalise and store request
  ↓
structured LLM call
  ↓
Zod validation
  ↓
HubSpot lookup
  ↓
routing rules
  ↓
Slack + response draft
  ↓
Supabase timeline
  ↓
Next.js dashboard
```

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

Version one does not require Mastra or LangGraph.

Add a separate framework only when:

- the model needs repeated bounded tool selection;
- stateful agent loops are genuinely required;
- n8n and typed calls become difficult to maintain;
- the reason is documented in the decision log.
