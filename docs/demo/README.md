# Demo folder

- Main demos: Quayside property scenarios (routine, urgent, chargeable, failure, evaluation).  
- Inspection portability demo: **post-MVP** only.  
- Prefer stored/safe demo outputs for public links; never expose live secrets.  
- Always state synthetic data.

## Proven lab scenarios (capture in Loom later)

| Beat | What to show | Proof |
|---|---|---|
| Routine boiler | Email → desk → Slack `#maintenance-inbox` → draft → Approve → Send | Happy path |
| Urgent / hazard | Water near electrics → `#urgent-maintenance` → desk **hazard** badge → urgent draft (no fake dispatch) → timeline `route_escalated` | DEC-021 / Stage 13 |
| Chargeable HITL | Replace carpet / charge to tenant → `#approval-queue` → desk **chargeable** panel → Approve/Reject (no auto-invoice) → `execution_deferred` | Controlled chargeable slice |
| Integration failure → recovery | HubSpot error → `needs_attention` + timeline `integration_failed` + Slack alert → desk **Retry** | DEC-019 / Stage 12A |

Do **not** leave HubSpot pointed at a broken URL in demos — simulate failure briefly, then restore (as in the 2026-07-27 lab).

### Chargeable lab email

To: `mikelow92+opsdesk@gmail.com`  
Subject: `Replace hallway carpet Flat 8 — charge tenant`

> Hi, please replace the worn hallway carpet in Flat 8 at Riverside Court and charge to the tenant. Access is available weekdays after 10 am.