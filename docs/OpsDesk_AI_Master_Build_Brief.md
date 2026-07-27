# OpsDesk AI — Master Build Brief

**Status:** Current source of truth after Quayside / property-maintenance pivot (2026-07-24).  
**Earlier SaaS shared-inbox material** is historical only unless explicitly marked.

---

## 1. Purpose

Build a flagship portfolio project that demonstrates readiness for **AI Automation Engineer / Specialist / Solutions Engineer** and applied / forward-deployed roles—and a credible method for taking synthetic workflows into a real-company engagement later.

OpsDesk AI is:

> A **capability playbook** of production-style AI workflows (DEC-022): each module is a complete vertical slice that solves one operational problem and can stand alone as a case study. Demonstrated first in **property maintenance** (Quayside Property Services); later validated against a **technical inspection** workflow. Strongest modules may later share data and connect into a broader operating system.

It is not a universal platform built before anything works, a chatbot, an autonomous property manager, or a multi-agent OS.

---

## 2. Fictional company

See [`company-profile.md`](company-profile.md) — **Quayside Property Services**.

---

## 3. Three request categories

### A. Routine maintenance (first vertical slice)

Example boiler rattling / Flat 8 / Riverside Court / access after 2pm.

Flow: store → extract → validate → HubSpot + property match → history/warranty → routine rules → Slack → draft → timeline.

### B. Urgent / hazardous

Example: water near light fitting. AI may flag language; **deterministic rules** force escalation, block routine progression, require human decision for consequential actions.

### C. Controlled / chargeable / authorisation-sensitive

Example: replace flooring and invoice tenant. Authority check → proposed action → approval → execute only after approval → audit.

### Fallback

Unknown / ambiguous / human triage.

---

## 4. Future-state workflow

```text
Inbound maintenance request
        ↓
n8n normalises
        ↓
Raw request in Supabase
        ↓
AI extraction (validated with Zod)
        ↓
HubSpot contact/org + Supabase site/asset/history
        ↓
Deterministic rules (safety, authority, route, approval)
        ↓
AI proposes plan + drafts communications
        ↓
Human approval when required
        ↓
Slack / Gmail / HubSpot / job actions
        ↓
Audit events; failures → recovery queue
```

Central question: *Where is this request, what blocks it, who acts next?*

---

## 5. Hybrid architecture

| Layer | Owns |
|---|---|
| **n8n** | Intake, orchestration, HubSpot/Slack/Gmail calls, schedules, error workflows |
| **Next.js / TypeScript** | Inbox UI, rules, approvals, safe execution, Zod, idempotency, vertical config |
| **Supabase** | Durable state: orgs, contacts, sites, assets, requests, jobs, approvals, events |
| **HubSpot** | Client/contact CRM context — not request state |
| **Slack** | Notifications — not system of record |
| **LLM** | Extract, retrieve-assisted draft/plan — never execute protected actions |

No Mastra/LangGraph in v1. Canvas-first n8n for the initial slice (DEC-006); API-assisted iteration thereafter (DEC-023).

---

## 6. Vertical adaptability

**Build seams now. Build only property now. Validate inspection later.**

1. **Reusable core** — ingestion, orgs/contacts, sites/assets, requests, extractions, proposed actions, approvals, jobs, events, recovery, evaluation, timeline UI  
2. **Vertical config** — terminology, schema extensions, rule packs, tools, docs namespace, seeds, fixtures, panels  
3. **Client config** — real inbox, policies, thresholds, contractors (documented in `client-delivery/`; not a no-code product)

---

## 7. Data model direction (no migration in this docs pass)

**Retain:** companies, contacts, requests, request_extractions, proposed_actions, approvals, workflow_events, evaluation_*.

**Plan to add (reviewed migration later):** sites, assets, site_contacts, service_providers, agreements, jobs, documents; optional request columns (`vertical`, `site_id`, `asset_id`, …); `vertical_data` JSON for true vertical specifics.

Prefer reusable fields over `tenant_name` / `boiler_problem` on core tables.

---

## 8. First vertical slice (MVP)

Routine boiler email end-to-end (definition of done in handoff §20 / Control Centre Phase 3).

Do **not** require Resolution Planner for this slice.

---

## 9. Post-MVP Track A — Inspection portability

Same Gmail intake and core; inspection schema + rules + small dataset + reuse report. Not simultaneous with property MVP.

---

## 10. Post-MVP Track B — Client delivery

See `client-delivery/`: playbook, audit templates, synthetic-to-real matrix. Templates ≠ completed client work.

---

## 11. Evaluation

Shared reliability cases + `evaluation/property-maintenance/` (+ future `inspection-services/`). Never invent metrics.

---

## 12. Portfolio positioning

**Strategy (DEC-022):** capability playbook — complete vertical slices first; compose strongest modules later.

**Homepage:** A reusable playbook of production-style AI workflows — starting with property-maintenance request handling, routing, enrichment, and human-in-the-loop execution for Quayside.

**Adaptability:** property first; inspection proves transfer without forking.

**Limitations:** synthetic data; real integrations; growing playbook, not a finished multi-module OS; no claimed client outcomes.

---

## 13. Roadmap

Phases 0–10 are delivery vehicles for capability modules, not a mandate to finish a monolith first. Tracks A/B post-MVP. Immediate build stays near current progress: urgent/hazard routing → evidence capture → next module.

---

## 14. Definition of complete (portfolio)

At least one standalone capability case study ships; property categories work; approvals for controlled actions; idempotent failures; ≥50 labelled scenarios over time; demo; honest limitations; client-delivery docs present; inspection proof optional later. Cross-module OS narrative only after 2–3 strong slices.
