# Portfolio and Demo Plan: OpsDesk AI

Story source of truth: [`portfolio-notes.md`](portfolio-notes.md).

## Positioning (DEC-022)

OpsDesk is a **playbook of production-style AI workflow capabilities**. Quayside property maintenance is the first vertical setting. Portfolio packaging uses **one problem → one outcome → six demo scenarios**, not a phase checklist.

## Locked story

**Problem:** Maintenance mail lands in a shared inbox. Urgent requests get lost. Chargeable or controlled work isn’t separated from day-to-day fixes. There’s no clear approval step, and no reliable record of who decided what.

**Outcome:** Every request becomes a case on the ops desk: classified, routed, drafted, with human approval when it matters, and auditable.

**One-liner:**

> An end-to-end AI workflow for property-maintenance requests: intake, rules-based routing, CRM context, grounded drafts, and human approval gates, with a full audit trail.

Full wording: [`portfolio-notes.md`](portfolio-notes.md).

## Homepage card

**OpsDesk AI**

*End-to-end AI workflow for property-maintenance requests (Quayside): intake, rules-based routing, CRM context, grounded drafts, and human approval gates, with a full audit trail.*

Highlights:

- Real Gmail, HubSpot, Slack, Supabase (synthetic Quayside data)  
- Structured extraction + Zod validation  
- Deterministic urgent and chargeable routing  
- Human approval; approve ≠ execute / send  
- Failure visibility + retry  
- Keyword retrieval with desk-only internal grounding  
- Evidence pack + thin routing evaluation  

Live desk: https://opsdesk-quayside.vercel.app  

## Demo scenarios (record in this order)

1. Routine boiler: happy path Approve → Send  
2. Water near electrics: urgent escalate  
3. Chargeable carpet: approve → lab work order (no invoice)  
4. HubSpot failure → desk Retry  
5. Internal grounding / retrieval  
6. Evidence pack  

Detail and lab emails: [`demo/README.md`](demo/README.md).

Inspection demo is **post-MVP** and separate.

## Case-study structure (website; last)

1. Problem (Quayside shared inbox)  
2. Manual process audit  
3. Solution (ops desk + gates)  
4. Architecture (n8n + automation-api + desk)  
5–10. Scenarios above  
11. Evaluation (routing fixtures)  
12. From synthetic to real (`client-delivery/`)  
13. Limitations  

## Limitations statement

> OpsDesk AI is a production-style simulation with real APIs and synthetic Quayside property data. It is a growing playbook of capability modules, not a claim of a finished multi-tenant OS, real invoicing, or real-client outcomes. Staff login is in place; row-level security and full recovery queues are deferred and called out honestly.
