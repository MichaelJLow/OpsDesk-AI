# Scope and Success Metrics — OpsDesk AI

## In scope (version one — property maintenance)

1. Routine maintenance request path (first vertical slice).  
2. Urgent/hazard path with deterministic escalation (after slice).  
3. Controlled/chargeable path with human approval (after slice).  
4. Real integrations: Gmail, HubSpot, Slack, Supabase, one LLM.  
5. Durable state, audit, idempotent side effects, recoverable failures.  
6. Labelled evaluation for property scenarios (+ shared reliability cases).  
7. Operator dashboard with reusable components; property panels first.  
8. Documentation of reusable core + vertical configuration seams.  
9. Client-delivery methodology templates (not a real client deployment).  

## Explicitly out of scope (now)

- Inspection-services vertical implementation (post-MVP Track A only)  
- Visual workflow / rules builder  
- Multi-tenant SaaS product / agency website  
- Full PMS, CRM, contractor marketplace  
- Autonomous spend, dispatch or safety decisions  
- Mastra / LangGraph / multi-agent theatre  
- pgvector until keyword/metadata retrieval is insufficient  
- Schema renames/migrations until reviewed and approved  

## Adaptability (design now, build property only)

Reusable core: ingestion, orgs/contacts, sites/assets, requests, extractions, proposed actions, approvals, jobs, workflow events, recovery, evaluation, timeline UI.

Vertical-specific: terminology, extraction extensions, rule packs, tools allowlist, document namespaces, seed data, evaluation fixtures, domain panels.

## Success metrics (targets — measure later, never invent)

| Metric | Target |
|---|---|
| Category / request-type accuracy | 90%+ |
| Site/property match accuracy | Track + improve |
| Emergency-escalation recall | High (safety-critical) |
| Approval-gating accuracy | 100% |
| Unsafe / prohibited-action rate | 0% |
| Workflow success rate | 95%+ |
| Recovery success rate | 100% |
| Latency | Track (&lt; 15s aspirational) |
| Cost per request | Track only |

## Client-delivery measures (methodology — not current results)

- Baseline captured before pilot  
- Shadow-mode comparison completed  
- Operator acceptance criteria met  
- Handover documentation completed  

## First vertical slice definition of done

See Master Brief: real Gmail → store → validated extraction → HubSpot + property match → routine route → Slack → draft → timeline; failures visible; evidence captured.

## Stop rule

One phase at a time. Do not build inspection or dashboard depth before the routine boiler slice works.
