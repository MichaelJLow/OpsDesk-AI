# Decision Log

Detailed architectural and scope decisions for OpsDesk AI. Index also maintained in `PROJECT_CONTROL_CENTRE.md`.

---

## DEC-001 — Gmail polling for local development

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Inbound email must reach n8n during local development without requiring a public HTTPS endpoint.

### Alternatives considered

- Gmail polling trigger in n8n
- Gmail push / webhook via public tunnel (ngrok) or VPS
- Manual “send test payload” only (no real inbox)

### Chosen approach

Use **Gmail polling** during local development.

### Reason

Supports real inbox integration without exposing a public webhook. Matches the master build brief.

### Trade-offs

Requests arrive with a short delay versus push. Polling consumes API quota if interval is too aggressive.

### Follow-up

Switch to webhook intake after a stable public endpoint (e.g. VPS) is available. Revisit before continuous demo hosting.

---

## DEC-002 — Gemini as initial single LLM provider

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Version one needs one model provider for structured classification and drafting. Multiple providers increase cost and evaluation noise before the workflow is stable.

### Alternatives considered

- Gemini API (free tier for synthetic data)
- OpenAI
- Anthropic
- Multi-provider from day one

### Chosen approach

Start with **Gemini** only. Compare a small paid OpenAI or Anthropic budget later for evaluation.

### Reason

Low-cost development on synthetic data; stabilise workflow and fixtures before model shopping.

### Trade-offs

May need prompt adjustments when switching providers. Free-tier rate limits can affect demos.

### Follow-up

After labelled evaluation exists, run a controlled provider comparison and log results.

---

## DEC-003 — Flatten monorepo; relocate build pack under `docs/`

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

The handoff arrived as a nested `OpsDesk-AI-Build-Pack/` folder. The master brief defines a root monorepo with documentation under `/docs`.

### Alternatives considered

- Keep nested build pack as-is
- Flatten into root monorepo with `docs/` as source of truth

### Chosen approach

**Flatten**: move pack contents to `docs/`, create `apps/`, `services/`, `n8n/`, `scripts/`, `evaluation/`, `supabase/`.

### Reason

Matches agreed repository structure and keeps a single documentation home for Control Centre and logs.

### Trade-offs

One-time move; links inside old ZIP layouts break.

### Follow-up

None unless packaging a new handoff ZIP.

---

## DEC-004 — `project-status.json` as machine-readable Control Centre twin

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Session commands and agents need a small structured status file. The build pack required Control Centre updates but did not ship `project-status.json`.

### Alternatives considered

- Control Centre markdown only
- Markdown + `project-status.json`

### Chosen approach

Maintain **both**: human-readable Control Centre and `project-status.json` at repo root.

### Reason

Agents and future CI can read JSON without parsing the full markdown ledger. Markdown remains the living narrative source.

### Trade-offs

Two files can drift if only one is updated. End-session command must update both.

### Follow-up

Add a lightweight consistency check in CI later if drift becomes a problem.

---

## DEC-005 — Cursor start/end session commands (no always-on rule file)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Need persistent project-management discipline for build sessions without overloading every chat with a large always-apply rule.

### Alternatives considered

- `.cursor/rules/opsdesk-project.mdc` with `alwaysApply: true`
- `.cursor/commands/start-session.md` and `end-session.md` only
- Both

### Chosen approach

**Session commands only**: `/start-session` and `/end-session` under `.cursor/commands/`.

### Reason

Operator invokes session discipline intentionally. Avoids redundant always-on context; commands encode the exact start/end checklist.

### Trade-offs

Discipline depends on running the commands. Forgetting `/end-session` can leave Control Centre stale.

### Follow-up

Revisit an always-on thin rule only if session hygiene repeatedly fails.
