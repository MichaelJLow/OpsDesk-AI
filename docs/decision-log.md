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

---

## DEC-006 — Manual n8n workflow build (learning-first)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

n8n is a core skill for the target AI Automation roles. Auto-generating or importing a finished workflow would skip the learning value of triggers, credentials, IF branches, error paths and node configuration.

### Alternatives considered

- Agent builds / imports complete workflow JSON
- Pair-programming walkthrough where Mike builds every node in the UI
- Mix: agent scaffolds JSON, Mike edits

### Chosen approach

**Manual guided build.** The agent provides step-by-step instructions, explains why each node exists, and waits while Mike configures the workflow in the n8n UI. Do **not** auto-create the business workflow or silently overwrite `n8n/workflows/*.json` unless Mike explicitly asks for an export/backup after he built it.

### Reason

Portfolio credibility and job readiness require real n8n fluency (branching, credentials, polling, error workflows), not only a working demo.

### Trade-offs

Slower than importing JSON. More session time on UI steps. Risk of small config mistakes — treated as learning/failure-log material.

### Follow-up

After the sales vertical slice works, export a sanitised workflow JSON for the repo as evidence. Optional later: compare Mike’s build to a reference export for review only.

---

## DEC-007 — Dedicated Gmail test inbox preferred over plus-alias

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active |

### Context

Need a real Gmail source for OpsDesk without polluting a personal inbox or confusing OAuth demos.

### Alternatives considered

- New free Gmail account dedicated to OpsDesk
- Plus-address / filter on existing Gmail (`you+opsdesk@gmail.com`)
- Google Workspace shared mailbox / Group

### Chosen approach

**Prefer a separate free Gmail account** for the OpsDesk test inbox. Plus-addressing on an existing account is an acceptable short-term fallback if creating a new account is blocked.

### Reason

Cleaner OAuth consent, clearer demos, no risk of personal mail entering the workflow, easier to revoke project access later.

### Trade-offs

One more account to manage. Plus-alias fallback shares credentials with personal mail and needs strict Gmail search filters in n8n.

### Follow-up

Document the chosen address in `ACCOUNT_SETUP_CHECKLIST.md` once created (email only — never tokens in docs).

**Update 2026-07-24:** Option B chosen in practice — `mikelow92+opsdesk@gmail.com` + label `OpsDesk` (dedicated Gmail blocked by Google verification while roaming on O2 UK in Brazil).

---

## DEC-008 — Temporary TLS verify disable for local n8n Docker (SSL interception)

| Field | Value |
|---|---|
| Date | 2026-07-24 |
| Status | Active — local only |

### Context

Gmail OAuth from n8n in Docker fails after Google consent with: `unable to verify the first certificate` / Node `--use-system-ca` hint. Same class of issue previously seen with npm and git on this machine (TLS interception / custom root CA).

### Alternatives considered

- Mount corporate root CA into the container (`NODE_EXTRA_CA_CERTS`)
- Run n8n on the Windows host with `--use-system-ca`
- `NODE_TLS_REJECT_UNAUTHORIZED=0` inside Docker for local learning only
- n8n Cloud trial (avoids local TLS, but not our target stack)

### Chosen approach

Set `NODE_TLS_REJECT_UNAUTHORIZED=0` in [`n8n/docker-compose.yml`](../n8n/docker-compose.yml) for **local development only**, so Lesson 1 OAuth can complete.

### Reason

Unblocks learning and the sales vertical slice immediately. Proper CA mounting needs the corp cert file and more setup time.

### Trade-offs

Disables TLS certificate verification for outbound HTTPS from the n8n container (MITM risk on hostile networks). Unacceptable for hosted/production. Must be removed or replaced with `NODE_EXTRA_CA_CERTS` before any shared deploy.

### Follow-up

Replace with mounted corporate CA when available. Never ship this env var to VPS/cloud. Revisit before Phase 10 portfolio “security” section — document honestly as a local network constraint.

