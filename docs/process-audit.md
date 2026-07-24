# Process Audit — Northline Operations Inbox

## Problem statement

Northline Cloud receives sales, support and account-change requests through one shared inbox. Staff manually identify the sender, search HubSpot, find the correct procedure, decide ownership, draft a reply, update systems and chase follow-up. The process is slow, inconsistent and hard to audit.

## Manual workflow (before)

```text
Inbound email arrives in shared Gmail inbox
        ↓
Someone notices it (or it sits unread)
        ↓
Open email → guess intent from subject/body
        ↓
Search HubSpot for sender / company (often incomplete)
        ↓
Ask Slack / colleagues who owns it
        ↓
Find policy or support article (ad hoc)
        ↓
Draft reply in Gmail
        ↓
Manually update HubSpot / create task
        ↓
Notify team in Slack (sometimes)
        ↓
No reliable timeline or recovery if a step fails
```

### Bottlenecks

1. **Discovery delay** — emails wait until someone checks the inbox.
2. **Intent ambiguity** — sales vs support vs billing mixed together.
3. **CRM friction** — repeated HubSpot searches; duplicate contacts risk.
4. **Tribal knowledge** — routing depends on who is online.
5. **Weak audit** — hard to prove what was decided or changed.
6. **Unsafe writes** — billing changes can be executed without a clear approval gate.
7. **No recovery path** — partial failures leave systems inconsistent.

### Why automate

Automation should remove repetitive lookup and drafting work, enforce routing and approval rules, and leave a complete timeline — without handing irreversible actions to an LLM.

---

## Automated workflow (after)

```text
Inbound Gmail message
        ↓
n8n receives and normalises (message ID, sender, subject, body, timestamp)
        ↓
Raw request stored in Supabase (idempotent on external_message_id)
        ↓
LLM classifies intent and extracts structured fields
        ↓
Zod validates structured output (invalid → retry / human triage)
        ↓
HubSpot customer/contact lookup
        ↓
Policy or support context retrieved when needed
        ↓
Deterministic rules calculate route and approval requirements
        ↓
LLM drafts response and proposes actions (propose only)
        ↓
Slack notification to the owning team
        ↓
Human approval where required (account changes)
        ↓
Approved HubSpot / Gmail / Slack side effects execute
        ↓
Audit history, metrics and outcome stored
        ↓
Failures route to a recovery queue (safe replay, no duplicate writes)
```

### What AI does

- Interpret messy language
- Extract structured fields
- Retrieve relevant context (later phases)
- Draft replies and propose actions

### What deterministic logic does

- Schema validation
- Routing constraints and thresholds
- Authorisation for account changes
- Idempotency and retry safety
- Separation of recommendation, approval and execution

### What humans do

- Approve sensitive account changes
- Handle low-confidence or ambiguous cases
- Resolve exceptions and recovery queue items

---

## First vertical slice (MVP)

Sales enquiry only:

```text
Gmail → n8n → store → classify/extract → validate → HubSpot lookup
  → route → Slack `#sales-enquiries` → draft → timeline
```

Support retrieval, billing approval and the full dashboard come after this path is reliable.

## Evidence

| ID | Artefact | Location |
|---|---|---|
| EVID-001 | Manual process map | `docs/images/manual-process.md` (Mermaid source; PNG when exported) |
| EVID-002 | Automated process map | `docs/images/automated-process.md` |
