# Evaluation

Deterministic harness for OpsDesk property workflows.

## Canonical harness (recommended)

The full evaluation pack lives in the sibling **ai-workflow-eval** repo:

```text
Libertrade Code/
  ai-workflow-eval/     ← canonical harness + scorecards + baseline
  OpsDesk/              ← product under test
```

From `ai-workflow-eval`:

```bash
npm run eval -- run --pack opsdesk-property
npm run eval -- baseline --pack opsdesk-property   # after intentional policy changes
```

**Lab metrics (2026-07-29):** 17 synthetic cases, 17/17 pass, 22/22 critical checks, baseline at `reports/baseline/opsdesk-property.json`. Deterministic only — not production performance.

Requires OpsDesk as a sibling checkout (or `OPSDESK_PATH`).

## Legacy routing fixtures (thin)

Fixtures in `fixtures/property-routing/` still exercise `applyPropertyRouting` directly inside this repo — useful for quick routing-only checks:

```bash
cd services/automation-api
npm test
# or routing fixtures only:
npm run eval:routing
```

The 7 routing cases were ported into `ai-workflow-eval/packs/opsdesk-property/`. Prefer the pack for scorecards, trust boundaries, grounding, and regression tracking.

Full labelled extraction scoring and Supabase `evaluation_*` persistence remain future work.
