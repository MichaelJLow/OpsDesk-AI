# Build Roadmap — OpsDesk AI (Quayside / property)

## Strategy (DEC-022)

Ship a **capability playbook**: each major item below is (or becomes) a complete vertical slice that can stand alone as a portfolio case study. Connect the strongest modules later — do not wait for a finished “platform” before anything is demoable.

## Active implementation sequence (scope control)

1. Finish Lesson 5 — `workflow_events` after store  
2. Structured extraction for routine boiler request  
3. HubSpot contact + Supabase property lookup  
4. Deterministic routine routing  
5. Slack notify + response draft  
6. Harden first vertical slice  
7. Minimum operator dashboard  
8. Context retrieval  
9. Urgent + controlled-action workflows  
10. Reliability + evaluation  
11. Property portfolio release  
12. **Track A** inspection portability (post-MVP)  
13. **Track B** client-delivery toolkit (docs can exist now)

Do not build property + inspection simultaneously. Do not block a module’s demo on unfinished cross-module integration.

---

## Phase 0 — Define and document

- [x] Repository / brief structure  
- [x] Quayside company profile (pivot 2026-07-24)  
- [x] Process audit (property)  
- [x] Adaptability + client-delivery docs  
- [x] Decision / failure logs  

## Phase 1 — Local infrastructure

- [x] Docker + n8n local  
- [x] Next.js health  
- [x] Supabase project + initial schema  
- [x] Gmail test path  
- [ ] HubSpot / Slack / Gemini accounts  
- [ ] Formal n8n persistence re-check  

## Phase 2 — Synthetic Quayside environment

- [x] Initial schema (generic tables present)  
- [ ] Sites/assets/contractors/agreements seed (migration review first)  
- [ ] 25 orgs / 50 sites / 60 contacts / 12 contractors  
- [ ] Edge cases + policies  

## Phase 3 — First vertical slice (routine boiler)

- [x] Gmail poll + normalise + store + duplicate guard  
- [ ] Timeline event (Lesson 5)  
- [ ] Structured extraction + Zod  
- [ ] HubSpot + property lookup  
- [ ] Routine route + Slack + draft  

## Phase 4 — Operator dashboard

Reusable components; property panels first.

## Phase 5 — Context & grounded resolution

History, warranty, agreements, citations.

## Phase 6 — Safety, approval, controlled execution

Urgent/hazard + chargeable approval queue.

## Phase 7 — Reliability

Idempotency, recovery, safe replay, no duplicate jobs.

## Phase 8 — Evaluation

Property fixtures + shared reliability cases.

## Phase 9 — Security & handover

Isolation, least privilege, runbooks; shadow-mode planning.

## Phase 10 — Portfolio release

Property case study + synthetic-to-real methodology.

### Post-MVP Track A — Inspection portability proof  
### Post-MVP Track B — Client-delivery toolkit  

## Stop rule

Finish the routine boiler slice before expanding.
