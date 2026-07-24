# Technical Architecture — OpsDesk AI

## Stack

n8n CE · Next.js/React/TS · Zod · Supabase/PostgreSQL · Gmail · HubSpot · Slack · one LLM · Python seeds/eval · Docker · GitHub Actions · Sentry · Vercel

## Boundaries

### n8n
Intake, normalisation plumbing, orchestration, external API calls, schedules, retries coordination, error workflows. **Not** sole business-logic or state store.

### TypeScript application
Deterministic rules, Zod validation, approvals, protected execution endpoints, idempotency, vertical config packs, tool allowlists, operator UI.

### Supabase
Durable entities and events. Planned extensions: sites, assets, jobs, agreements, documents, service_providers (migration reviewed separately).

### Vertical config (code-based)

```ts
type VerticalConfig = {
  id: string;
  displayName: string;
  requestCategories: string[];
  extractionSchemaVersion: string;
  rulePackVersion: string;
  workflowRoutes: string[];
  approvalTypes: string[];
  enabledTools: string[];
  slackChannels: Record<string, string>;
  terminology: {
    organisation: string;
    site: string;
    asset: string;
    job: string;
    serviceProvider: string;
    deliverable: string;
  };
};
```

Property: `property-maintenance` / Quayside labels (Property, Work Order, Contractor…).  
Inspection: post-MVP config only.

## Shared vs vertical extraction

Base Zod object for shared fields; `verticalData` + vertical-specific `.extend()` schemas. Rules consume structured facts—not free-text prompts alone.

## Reusable states

`NEW` → `INTAKE_PROCESSING` → `NEEDS_INFORMATION` → `READY_FOR_REVIEW` → `AWAITING_APPROVAL` → `APPROVED` → `JOB_CREATED` → `SCHEDULED` → `IN_PROGRESS` → `AWAITING_DELIVERABLE` → `RESOLUTION_REVIEW` → `COMPLETED` | `FAILED`

UI maps labels per vertical.

## Proposed repo seams (future; not forced now)

```text
src/core/{requests,approvals,jobs,audit,evaluation}/
src/verticals/{property-maintenance,inspection-services}/
src/integrations/
```

## Security

Secrets in env only; model cannot execute protected writes; approval ≠ execution; least privilege; synthetic data for demos; DEC-008 TLS workaround is local-only.

## Agent frameworks

Forbidden in v1 unless a logged decision proves n8n + typed calls insufficient.
