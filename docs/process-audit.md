# Process Audit — Quayside Property Services

## Problem statement

Quayside receives maintenance requests through one shared inbox. Staff manually identify the property, check who is asking and whether they can approve spend, search HubSpot and old emails, judge urgency from experience, chase contractors and leave weak audit trails. Work stalls without a clear owner or next action.

## Current-state (manual) workflow

```text
Inbound email / forward / photo arrives in shared Gmail
        ↓
Someone notices it (or it waits)
        ↓
Guess property, unit, asset and urgency from messy text
        ↓
Search HubSpot / spreadsheets / previous mail
        ↓
Ask Slack who owns the client or site
        ↓
Check warranty / agreement / access (ad hoc)
        ↓
Draft reply or call contractor
        ↓
Chase updates; evidence in random folders
        ↓
No reliable timeline, ownership or approval record
```

### Bottlenecks

1. Discovery delay in the shared inbox  
2. Ambiguous property / unit / asset references  
3. Unclear requester authority for chargeable work  
4. Tribal knowledge for urgency and contractor choice  
5. Missing photos or access details  
6. Weak audit of decisions and approvals  
7. Inconsistent customer updates  
8. No safe recovery when a step fails mid-flight  

### Why automate

Remove repetitive lookup and drafting; enforce safety and authorisation rules; leave a complete timeline—without letting an LLM dispatch contractors or approve spend.

---

## Future-state (OpsDesk) workflow

```text
Inbound maintenance request (Gmail)
        ↓
n8n receives and normalises
        ↓
Raw request stored in Supabase (idempotent on external_message_id)
        ↓
AI extracts organisation, requester, site, asset, issue,
urgency, access, safety indicators, missing information
        ↓
Zod validates structured output
        ↓
HubSpot client/contact lookup
        ↓
Supabase site/asset/history/agreement context
        ↓
Deterministic rules: safety, authority, route, approval
        ↓
AI proposes resolution plan + drafts communications
        ↓
Human approval when risk, cost, ambiguity or authority requires it
        ↓
Slack / Gmail / HubSpot / work-order actions execute
        ↓
Workflow events, decisions, evidence stored
        ↓
Failures → visible recovery queue
```

### Central question

> Where is this request now, what is blocking it, and who or what must act next?

### AI vs rules vs humans

| Layer | Owns |
|---|---|
| **AI** | Interpret language, extract fields, retrieve context, draft, propose plans |
| **Deterministic rules** | Safety escalation, authority, spend thresholds, blocked actions, routing constraints |
| **Humans** | Approvals, ambiguity, exceptions, high-risk dispatch and spend |

---

## First vertical slice

Routine boiler request only (see Master Brief §20). Urgent and chargeable flows follow after that path is reliable.

## Inspection portability (later)

The same audit structure applies to an inspection company; only vertical config, rule packs and domain panels change. Not in MVP build scope.

## Evidence

| ID | Artefact |
|---|---|
| EVID-001 | Earlier generic manual map (historical) — `docs/images/manual-process.md` |
| EVID-pm-01 | Property current-state map — to capture / version as Quayside diagrams |
| EVID-pm-02 | Property future-state map |
