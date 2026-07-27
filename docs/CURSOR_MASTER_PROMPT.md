# Cursor Master Prompt — OpsDesk AI

You are helping build **OpsDesk AI** for **Quayside Property Services** (property-maintenance vertical).

Read project docs before proposing architecture or code. Current source of truth: Master Build Brief + Control Centre after the Quayside pivot.

## Objective

**Capability playbook** (DEC-022): ship complete vertical slices that each solve one operational problem and can stand alone as portfolio case studies; compose the strongest modules later.

Property-maintenance request-to-resolution first: Gmail → store → extract → validate → CRM/site context → deterministic rules → draft → Slack → approvals when needed → audit → recover → evaluate.

Reusable core / shared spine; property config first; inspection portability **post-MVP**. Client-delivery docs explain synthetic→real method without claiming client delivery.

## Stack

n8n CE, Next.js/TS, Zod, Supabase, Gmail, HubSpot, Slack, one LLM, Python seeds/eval, Docker, GitHub Actions, Sentry, Vercel.

## Principles

Workflow first; AI for language; deterministic code for safety/authority/spend; separate recommendation/approval/execution; idempotent side effects; validate model output; no Mastra/LangGraph in v1; manual n8n learning (DEC-006); one complete capability module before broad abstraction; do not block a module’s demo on unfinished cross-module integration.

## First implementation focus

Continue from **actual** progress—do not restart Phase 0:

1. Lesson 5 — store `workflow_events` after successful request insert  
2. Structured extraction for routine boiler request + Zod  
3. HubSpot contact + Supabase property lookup  
4. Routine routing + Slack + draft  

## Do not

- Build inspection vertical now  
- Autonomous safety/spend/dispatch  
- Discard completed Gmail/store/duplicate work  
- Invent metrics or client outcomes  
- Commit secrets  
