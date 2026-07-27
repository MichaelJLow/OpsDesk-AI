# Project Brief — OpsDesk AI

## Project

**OpsDesk AI** — a capability playbook of production-style AI workflows, demonstrated first in property maintenance.

**First vertical:** Property maintenance (Quayside Property Services).  
**Post-MVP proof:** Technical inspection services (same spine, different config).  
**Strategy:** Complete vertical slices first; compose the strongest modules into a broader operating system later (DEC-022).

## One-line description

A reusable playbook of AI-assisted operational capabilities — starting with a property-maintenance desk that turns messy inbound requests into structured, routed and auditable work.

## Target roles

- AI Automation Engineer  
- AI Automation Specialist  
- AI Solutions Engineer  
- Automation Engineer  
- Applied AI / forward-deployed engineering  

## Goal

Demonstrate the ability to:

- map a messy operational workflow;
- ship complete capability modules (vertical slices), each demoable alone;
- separate AI interpretation from deterministic controls;
- integrate Gmail, HubSpot, Slack and a database;
- preserve human approval for high-risk or chargeable actions;
- handle failures safely;
- evaluate behaviour with labelled scenarios;
- document a path from synthetic demo to real-client delivery;
- show pattern fluency across request handling, routing, enrichment, retrieval, approvals, and HITL — not one monolithic app.

## Three request categories (property maintenance)

1. **Routine maintenance** — e.g. boiler rattling, access available tomorrow.  
2. **Urgent / hazardous** — e.g. water near electrics; deterministic escalation.  
3. **Controlled / chargeable / authorisation-sensitive** — e.g. replace flooring and invoice tenant; human approval required.

Fallback: unknown / ambiguous → human triage.

## First vertical slice

Routine boiler-maintenance email: Gmail → store → extract → validate → HubSpot + property lookup → routine route → Slack → draft → timeline.

## Adaptability

Build seams now; build only property workflow now; validate inspection later. Do not build two industries at once. Do not block a slice’s demo on unfinished cross-module integration.

## Real-world client delivery

The repo includes a `client-delivery/` methodology (discovery → audit → pilot → shadow mode → rollout → handover). Synthetic demo ≠ claimed client results.

## Non-goals

- One enormous platform before any module works  
- Generic chatbot or multi-agent swarm  
- Full property-management / CRM product  
- Inspection vertical during MVP  
- No-code workflow/rules builder  
- Autonomous spend, dispatch or safety decisions  
- UI polish before the first slice works  
- Claiming a finished multi-module OS prematurely  

## Success statement

> Mike can enter a messy operational environment, map how work moves, ship complete AI workflow capabilities one problem at a time, use AI where language is messy, keep deterministic control where risk matters, integrate existing tools and prove outcomes with evaluation—and show how that playbook transfers to a real company.
