# Portfolio Notes: OpsDesk

Canonical **packaged story** for jobs and (later) client conversations. Demo video and README polish track packaging; this file is the source of truth for wording.

**Style:** no em dashes in portfolio copy.

---

## One problem

Maintenance mail lands in a shared inbox. Urgent requests get lost. Chargeable or controlled work isn’t separated from day-to-day fixes. There’s no clear approval step, and no reliable record of who decided what.

## One outcome

Every request becomes a case on the ops desk: classified, routed, drafted, with human approval when it matters, and auditable.

## One line (use everywhere)

> An end-to-end AI workflow for property-maintenance requests: intake, rules-based routing, CRM context, grounded drafts, and human approval gates, with a full audit trail.

**Alternate (playbook frame, DEC-022; use when emphasising pattern fluency):**

> I've built a reusable playbook of production-style AI workflows, demonstrated first on Quayside property-maintenance request handling, routing, enrichment, retrieval, and human-in-the-loop execution.

Prefer the **end-to-end workflow** line for interviews.

---

## Setting

| | |
|---|---|
| Product name | **OpsDesk** |
| First vertical | Property maintenance |
| Fictional company | **Quayside Property Services** |
| Live desk | https://opsdesk-quayside.vercel.app |
| Case study | https://www.michaeljlow.com/projects/opsdesk-ai |
| Repo | https://github.com/MichaelJLow/OpsDesk-AI |
| Data | Synthetic Quayside lab data; real APIs (Gmail, HubSpot, Slack, Supabase) |

---

## Demo scenarios (“beats”)

In a Loom or interview, a **beat** is just one short scene you walk through, not a separate product. Same desk, six scenarios, in this order:

| # | Scenario | What you show |
|---|---|---|
| 1 | **Routine** | Boiler email → draft → Approve → Send |
| 2 | **Urgent** | Water near electrics → urgent channel + hazard on desk |
| 3 | **Chargeable** | Charge-to-tenant → approve authority, then separate lab execute (no invoice) |
| 4 | **Failure** | HubSpot fails → needs attention → Retry |
| 5 | **Grounding** | Desk shows which policies informed the draft (customer email stays clean) |
| 6 | **Evidence pack** | One export of the case: who did what, when |

Supporting (mention, don’t centre): routing eval fixtures (`npm run eval:routing`).

Lab scripts and sample emails: [`docs/demo/README.md`](demo/README.md).

---

## Architecture in one breath

n8n (intake / Slack / draft) → automation-api (Zod + deterministic route + retrieve) → Supabase → Next.js operator desk (approve / send / execute lab / evidence). AI interprets; rules and humans control risk.

---

## What this is / isn’t (say out loud)

**Is**

- A production-**style** simulation with real integrations  
- A capability playbook, Quayside-first (DEC-022)  
- Proof of HITL, safety routing, audit, thin recovery and retrieval  

**Isn’t**

- A finished multi-tenant product or “autonomous property manager”  
- Real invoicing, contractor SMS dispatch, or live client outcomes  
- Full RLS / enterprise IAM (staff login yes; RLS deferred)  
- Embeddings/pgvector (keyword retrieval by design for now)  
- Inspection vertical (post-MVP portability proof)  

Client path (methodology only, no fake delivery claim): [`client-delivery/`](../client-delivery/).

---

## Homepage / CV card (short)

**OpsDesk:** end-to-end AI workflow for property-maintenance requests (Quayside): intake, rules-based routing, CRM context, grounded drafts, and human approval gates, with a full audit trail. Real Gmail, HubSpot, Slack, Supabase; synthetic data.

---

## Case study outline (website; later)

1. Problem (shared inbox)  
2. Manual process pain  
3. Solution (ops desk + gates)  
4. Architecture sketch  
5. Beats 1–6 above  
6. Evaluation (routing fixtures)  
7. Limitations + synthetic → real  
8. Loom / live desk link  

---

## Wording to avoid

- Em dashes in portfolio copy  
- “I built an AI dashboard” (as the whole story)  
- “Universal workflow platform” / finished OS  
- “Autonomous property manager”  
- Invented metrics or fake client results  
- Relabelling pre-pivot SaaS screenshots as Quayside  
- Leading with phase numbers instead of capabilities  

---

## Capture next (packaging, not more platform)

- [x] Lock story ([`portfolio-notes.md`](portfolio-notes.md)): problem, outcome, one-liner, six scenarios  
- [x] Demo walkthrough seed + one live email proof ([`demo/README.md`](demo/README.md))  
- [x] Desk visual polish  
- [ ] Run full scenario pack once on hosted stack (for video)  
- [ ] Screenshots per scenario (site uses real shots; keep evidence folder in sync if needed)  
- [ ] Demo video (~3.5–4 min; Loom or Clipchamp)  
- [x] CV bullets updated (Desktop `MichaelLowCV`)  
- [x] Website case study base: michaeljlow.com `/projects/opsdesk-ai`  
- [x] GitHub README first impression (OpsDesk rename)  

---

## Notes

- 2026-07-28: Product name **OpsDesk** (dropped “AI”); README rewritten for GitHub first impression.  
- 2026-07-27: **End-session packaging:** Quayside desk UI, walkthrough email substance + stagger, draft edit, Sources tidy; Loom signup blocked (FAIL-012); resume video later.  
- 2026-07-27: **Story locked**: problem / outcome / one-liner / six scenarios (portfolio packaging). No em dashes in copy.  
- 2026-07-27: DEC-022: capability playbook over monolithic platform.  
- 2026-07-24: Domain pivot SaaS → Quayside; company name for portfolio.  
