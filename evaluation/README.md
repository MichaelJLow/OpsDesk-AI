# Evaluation

Thin deterministic harness for OpsDesk routing (Phase 8 starter).

## Property routing fixtures

Fixtures live in `fixtures/property-routing/`. They exercise `applyPropertyRouting` in `services/automation-api` — no Gemini, no Gmail, no Slack.

```bash
cd services/automation-api
npm test
# or routing fixtures only:
npm run eval:routing
```

Full labelled extraction scoring and Supabase `evaluation_*` persistence come later.
