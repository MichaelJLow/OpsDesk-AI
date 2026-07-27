# Start Here — OpsDesk AI

**OpsDesk AI** is a reusable request-to-resolution system, demonstrated first as a **property-maintenance operations desk** for fictional **Quayside Property Services**.

## Three layers

1. Reusable OpsDesk core  
2. Property-maintenance vertical (active)  
3. Future inspection portability + client-delivery methodology  

## Read in order

1. [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md)  
2. [`company-profile.md`](company-profile.md)  
3. [`BUILD_ROADMAP.md`](BUILD_ROADMAP.md)  
4. [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md)  
5. [`PROJECT_CONTROL_CENTRE.md`](PROJECT_CONTROL_CENTRE.md) + root `project-status.json`  
6. [`OpsDesk_AI_Master_Build_Brief.md`](OpsDesk_AI_Master_Build_Brief.md)  
7. [`client-delivery/README.md`](../client-delivery/README.md)  

## Working method

- `/start-session` and `/end-session`  
- One current task; preserve scope  
- n8n workflow runbook: [`N8N_WORKFLOW_RUNBOOK.md`](N8N_WORKFLOW_RUNBOOK.md)  

## Current implementation (honest)

Done: local n8n, Gmail intake, normalise, Supabase `requests` store, duplicate guard.  
Next: `workflow_events` timeline → boiler structured extraction → HubSpot/property lookup → route → Slack → draft.

## Critical rules

Do not build inspection vertical during property MVP.  
Do not add agent frameworks in v1.  
Do not invent metrics or claim real-client results.
