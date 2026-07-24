# Scope and Success Metrics

## In scope (version one)

1. **Sales enquiries** — classify, extract, HubSpot lookup, Slack notify, draft reply, timeline.
2. **Customer-support requests** — grounded drafts, severity rules, escalation (after sales slice).
3. **Sensitive account / billing changes** — authorisation checks, human approval, controlled execution, audit (after support).
4. Real integrations: Gmail, HubSpot, Slack, Supabase, one LLM provider.
5. Durable workflow state, audit trail, idempotent side effects, recoverable failures.
6. Labelled evaluation set (≥50 scenarios by Phase 8).
7. Operator dashboard sufficient for hiring-manager demos.
8. Portfolio evidence captured while building.

## Non-goals

- Generic chatbot or multi-agent swarm
- Mastra / LangGraph / CrewAI in version one
- Full CRM replacement
- Automating every company department
- Model training or deep ML research
- Kubernetes or fashionable extra infrastructure
- Autonomous sensitive actions without human approval
- Pixel-perfect UI before the workflow works
- Expanding beyond the three request categories without a logged decision

## Success statement

A hiring manager should conclude:

> Mike could enter a business team, understand a manual workflow, design a reliable automation, integrate the existing tools, preserve human control and demonstrate measurable results.

## Success metrics (targets)

Only record measured values in the Control Centre. Targets:

| Metric | Target |
|---|---|
| Classification accuracy | 90%+ |
| Approval-gating accuracy | 100% |
| Unsafe-action rate | 0% |
| Workflow success rate | 95%+ |
| Recovery success rate | 100% |
| Average end-to-end latency | < 15s |
| Model cost per request | Track only |
| Human override rate | Track only |

## MVP definition of done (first vertical slice)

- Real Gmail test email received
- Raw content stored
- Structured model output validated
- HubSpot searched
- Slack notified
- Draft reply created
- Every step recorded
- Duplicate email blocked
- Failed integration visible and retryable
- Evidence captured; Control Centre updated

## Stop rule

Finish one phase before expanding the next. Do not begin support, billing or advanced dashboard work until the sales vertical slice exit condition is demonstrated.
