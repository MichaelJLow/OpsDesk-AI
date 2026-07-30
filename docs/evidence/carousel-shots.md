# OpsDesk carousel shots (post command-centre redesign)

The old six-shot carousel showed separate screens for intake, CRM, and draft review. The redesigned desk puts those on **one case workspace**, so the portfolio carousel should be **four shots** that still cover the same workflow end to end.

## Recommended carousel (4 shots)

| # | Label | Walkthrough seed | What to show | Replaces (old 6) |
|---|--------|------------------|--------------|------------------|
| 1 | **Command centre** | `demo-grounding-access` | Full Case overview: queue + resident message + proposed reply + evidence rail (HubSpot match, policy, recommended next step) | Gmail intake · HubSpot context · Draft review |
| 2 | **Urgent routing** | `demo-urgent-electrics` | Hazard case: queue hazard pill, decision banner, Activity or Slack event on timeline | Urgent routing |
| 3 | **Approval gates** | `demo-chargeable-carpet` | Chargeable authority held: action dock + evidence rail “approve authority first” next step | Chargeable work (+ draft approve lives in panel on shot 1) |
| 4 | **Failure recovery** | `demo-hubspot-failed` | Needs-attention state: failed step on Activity, retry in dock, audit visible | Failure recovery |

**Cover / card image:** crop or widen shot 1 (command centre) — same desk, no separate hero concept needed.

## File naming (Michael Low Site)

Save under `Michael Low Site/public/images/projects/opsdesk/`:

| Asset | Filename |
|-------|----------|
| Cover + card | `opsdesk-editorial-story-cover-v5.png` |
| Carousel 1 | `command-centre-editorial-v1.png` |
| Carousel 2 | `urgent-routing-editorial-v3.png` |
| Carousel 3 | `approval-gates-editorial-v1.png` |
| Carousel 4 | `failure-recovery-editorial-v3.png` |

Eval scorecard image is unchanged: `eval-scorecard-editorial.png`.

## Capture checklist

1. Seed walkthrough on hosted desk (Lab → Reset & seed walkthrough).
2. Log in as staff; set browser to **1440×900** (or 1280×800) for consistent framing.
3. **Shot 1:** Open Contractor access times case → Case overview tab → capture full desk (sidebar + queue + canvas + evidence rail).
4. **Shot 2:** Open URGENT water/light case → show hazard state; prefer Activity tab if Slack routing event reads clearly.
5. **Shot 3:** Open chargeable carpet case → show proposed authority approval in bottom dock before approve.
6. **Shot 4:** Open HubSpot-failed case → needs_attention + Retry visible.
7. Optional editorial pass: light crop, subtle warm background, no fake metrics.

## Copy alignment

Carousel labels and notes live in:

- `Michael Low Site/src/content/projects/opsdesk-ai.mdx` → `screenshot.shots`
- `docs/portfolio-notes.md` → demo beats + capture section

Demo walkthrough seeds remain six cases for Loom/video; the **website carousel is four composite moments**, not six separate products.
