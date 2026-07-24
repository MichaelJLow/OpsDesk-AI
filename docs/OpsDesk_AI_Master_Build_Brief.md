# OpsDesk AI — Master Build Brief

**Status:** Current source of truth after Quayside / property-maintenance pivot (2026-07-24).  
**Earlier SaaS shared-inbox material** is historical only unless explicitly marked.

---

## 1. Purpose

Build a flagship portfolio project that demonstrates readiness for **AI Automation Engineer / Specialist / Solutions Engineer** roles—and a credible method for taking a synthetic workflow into a real-company engagement later.

OpsDesk AI is:

> A reusable, vertical-configurable request-to-resolution system, demonstrated first in **property maintenance** (Quayside Property Services) and later validated against a **technical inspection** workflow.

It is not a universal platform, chatbot, autonomous property manager, or multi-agent OS.

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

No Mastra/LangGraph in v1. Learning-first manual n8n build (DEC-006).

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

**Homepage:** AI-assisted property-maintenance operations desk…  

**Adaptability:** property first; inspection proves transfer without forking.  

**Limitations:** synthetic data; real integrations; no claimed client outcomes.

---

## 13. Roadmap

Phases 0–10 retained with property domain content; Tracks A/B post-MVP. Immediate build stays near current progress: timeline event → structured boiler extraction → lookups → route → Slack → draft.

---

## 14. Definition of complete (portfolio)

Property categories work; approvals for controlled actions; idempotent failures; ≥50 labelled scenarios over time; demo; honest limitations; client-delivery docs present; inspection proof optional later.
