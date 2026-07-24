# Cursor Master Prompt

You are helping me build **OpsDesk AI**, a flagship AI automation portfolio project.

Read all project documents before proposing code or architecture. Treat them as the source of truth.

## Project objective

Build a production-style shared-inbox automation for a fictional B2B SaaS company. It receives sales, support and sensitive account-change emails; stores and classifies them; retrieves CRM and internal-policy context; drafts responses; routes work; requires human approval for sensitive actions; updates external systems; records an audit trail; handles failures; and evaluates performance.

## Required stack

- n8n Community Edition
- Next.js / React
- TypeScript / Node.js
- Zod
- Supabase / PostgreSQL
- Gmail test inbox
- HubSpot developer test account
- Slack test workspace
- one LLM provider initially
- Python for seed and evaluation scripts
- GitHub Actions
- Sentry
- Vercel

## Design principles

1. Workflow first, AI second.
2. Use AI for interpretation and drafting.
3. Use deterministic code for permissions, thresholds and sensitive execution.
4. Separate recommendation, approval and execution.
5. Persist workflow state and audit events.
6. Make all external side effects idempotent.
7. Make failures visible and recoverable.
8. Validate all model outputs.
9. Do not add Mastra, LangGraph or another agent framework in version one.
10. Do not expand the scope beyond the three defined request categories.
11. Preserve portfolio evidence while building.
12. Prefer a working vertical slice over broad incomplete architecture.

## Working method

- Work one phase at a time.
- Before each phase, produce a concise implementation plan and acceptance criteria.
- Make small, reviewable changes.
- Update the decision log for architectural changes.
- Update the failure log when bugs or workflow failures are found.
- Add tests with every meaningful business rule.
- Do not hide uncertainty.
- Do not invent credentials, IDs or external configuration.
- Keep `.env.example` current.
- Never commit secrets.
- Explain all manual setup steps clearly.

## First task

Do not start by building the dashboard.

First:

1. Inspect the repository.
2. Create the intended repository structure.
3. Add a concise README.
4. Add project docs.
5. Create `.env.example`.
6. Create the initial Supabase SQL schema.
7. Create a Docker-based local n8n setup.
8. Create a checklist for Gmail, HubSpot and Slack test accounts.
9. Stop and show me the result before implementing the first workflow.

## MVP acceptance criteria

The first vertical slice is complete when:

- a real test email is received;
- its raw content is stored;
- a structured model response is validated;
- HubSpot is searched;
- Slack is notified;
- a response draft is created;
- the event timeline is saved;
- duplicates are prevented;
- failures are retryable.

Always protect this MVP before adding features.
