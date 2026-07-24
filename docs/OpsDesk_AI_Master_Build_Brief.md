# OpsDesk AI — Master Build Brief

## Purpose

Build one flagship portfolio project that demonstrates readiness for **AI Automation Engineer / AI Automation Specialist / AI Solutions Engineer** roles.

The project is not primarily an AI demo. It is a production-style business automation that shows:

- process discovery and workflow redesign;
- n8n automation;
- APIs, webhooks, JSON, OAuth and third-party integrations;
- selective use of LLMs for messy language;
- deterministic rules for sensitive decisions;
- human approval;
- CRM, email and Slack integration;
- logging, retries, monitoring and recovery;
- evaluation against labelled scenarios;
- documentation, handover and measurable business outcomes.

The final deliverable is both:

1. A working automation system.
2. A polished portfolio case study that makes the engineering and business thinking easy to understand.

---

# 1. Project Summary

## Working name

**OpsDesk AI**

## One-line description

An AI-powered shared-inbox automation that turns inbound business emails into routed, reviewed and completed actions across Gmail, HubSpot, Slack and an internal operations dashboard.

## Portfolio positioning

> Operations teams often receive sales, support and account-change requests through the same shared inbox. Staff manually identify the sender, search the CRM, find the correct internal procedure, decide ownership, draft a response, update systems and chase follow-up. OpsDesk AI turns that fragmented process into a controlled and auditable request-to-resolution workflow.

## Main project message

> Mike can understand a messy business workflow, select the right combination of automation, AI and code, integrate existing systems, preserve human control, handle failures and prove the outcome.

---

# 2. Project Scope

## The fictional company

Create a realistic but fictional B2B SaaS business with:

- 30 customer or prospect companies;
- 60 contacts;
- account plans and lifecycle stages;
- customer notes and prior requests;
- internal support and account policies;
- a shared operations inbox;
- HubSpot as CRM;
- Slack channels for team routing.

The business data is synthetic. The APIs, workflows, approvals, model calls, database, logging and testing are real.

Describe it publicly as:

> A production-style simulation built with real integrations and synthetic company data, allowing the entire workflow to be demonstrated without exposing confidential information.

## Three request categories

### A. Sales enquiry

Example:

> We are interested in the enterprise plan for around 80 users. Can someone arrange a demonstration next week?

Expected flow:

1. Extract company, contact, estimated seats and request.
2. Find or create CRM records.
3. Classify and qualify the opportunity.
4. Draft a reply.
5. Notify `#sales-enquiries`.
6. Create a follow-up task.
7. Save the complete event timeline.

### B. Customer-support request

Example:

> Our finance team can no longer export the monthly report. It worked last week but now returns an error.

Expected flow:

1. Match sender to account.
2. Retrieve plan and account context.
3. Search support documents.
4. Classify severity and likely issue.
5. Draft a grounded response.
6. Create or update a support case.
7. Escalate low-confidence or high-severity cases.
8. Save the timeline.

### C. Sensitive account or billing change

Example:

> Please change the billing contact and send future invoices to our new office address.

Expected flow:

1. Extract requested changes.
2. Check whether the sender is authorised.
3. Retrieve the account-change policy.
4. Prepare the CRM update.
5. Route to human approval.
6. Execute only after approval.
7. Record approver, previous values and final values.
8. Send confirmation.

---

# 3. Core Workflow

```text
Inbound Gmail message
        ↓
n8n receives and normalises it
        ↓
Request stored in PostgreSQL
        ↓
LLM classifies intent and extracts structured fields
        ↓
HubSpot customer/contact lookup
        ↓
Relevant policy or support context retrieved
        ↓
Deterministic rules calculate route and approval requirements
        ↓
LLM drafts response and proposes actions
        ↓
Human approval where required
        ↓
HubSpot / Slack / Gmail actions execute
        ↓
Audit history, metrics and outcome stored
        ↓
Failures route to a recovery queue
```

## Architectural principle

Use:

- **AI** for interpreting language, extracting information, retrieving context and drafting.
- **Deterministic code** for permissions, thresholds, validation, routing constraints and irreversible actions.
- **Humans** for sensitive changes, ambiguity, exceptions and low-confidence cases.

Do not hand the whole process to an autonomous agent.

---

# 4. Technology Stack

## Automation

### n8n Community Edition

Use n8n as the orchestration and integration centre for:

- Gmail polling or webhook intake;
- normalisation;
- workflow branching;
- HubSpot integration;
- Slack messages;
- scheduled follow-ups;
- human approval triggers;
- sub-workflows;
- error workflows;
- evaluation runs.

Run locally through Docker during development. Move to the existing VPS later only when live webhooks or continuous operation are needed.

## Application and custom logic

### Next.js + React + TypeScript

Build the operator dashboard:

- Operations Inbox;
- Request Workspace;
- Human Review Queue;
- Workflow Timeline;
- Failure Centre;
- Metrics and Evaluation.

### Node.js / TypeScript service code

Use for:

- API endpoints;
- secure write actions;
- deterministic business rules;
- schema validation;
- permission checks;
- idempotency;
- reusable integration helpers.

### Zod

Validate:

- inbound webhook payloads;
- model structured outputs;
- proposed actions;
- integration responses;
- approval payloads.

## Database

### Supabase / PostgreSQL

Store:

- companies;
- contacts;
- requests;
- workflow runs;
- extracted fields;
- proposed actions;
- approvals;
- audit events;
- failures;
- evaluations;
- user roles.

Use Row Level Security for dashboard access where appropriate.

### pgvector

Optional, only for policy and support-document retrieval. Do not add it until simple keyword or metadata retrieval is insufficient.

## Business integrations

- Gmail test inbox;
- HubSpot developer test account;
- Slack free workspace;
- Google Drive or local document store;
- optional Airtable later, but not in the first slice.

## Model

Start with one provider.

Recommended low-cost development option:

- Gemini API free tier using synthetic data.

Final testing option:

- compare with a small paid OpenAI or Anthropic API budget.

Do not begin with multiple models. First stabilise the workflow and evaluation set.

## Python

Use Python for:

- synthetic company data;
- synthetic email generation;
- evaluation fixtures;
- batch regression runs;
- attachment preprocessing if needed;
- metric calculation.

## Operations

- Docker Desktop;
- Git and GitHub;
- GitHub Actions;
- Postman;
- Sentry;
- Vercel Hobby;
- n8n execution logs;
- environment variables and secrets management.

## Agent framework decision

Do **not** begin with Mastra or LangGraph.

The first version should use:

- direct structured LLM calls from n8n; or
- one bounded n8n AI Agent node if tool selection is genuinely needed.

A separate agent framework can be a later extension after the core automation works. AI automation roles value workflow selection, integrations and reliability more than unnecessary multi-agent complexity.

---

# 5. MVP Definition

The MVP is not the complete dashboard and all three workflows.

The MVP is one full vertical slice:

```text
Gmail
→ n8n
→ classify and extract
→ HubSpot lookup
→ deterministic route
→ Slack notification
→ draft response
→ store result and timeline
```

Start with the sales-enquiry workflow because it has the lowest risk.

## MVP definition of done

- A real test email is received.
- The sender and content are stored.
- The model returns validated JSON.
- HubSpot is searched.
- A Slack message is posted.
- A draft reply is created or displayed.
- Every step is recorded.
- A duplicate email does not run twice.
- A failed integration is visible and retryable.

Do not build the full dashboard before this works.

---

# 6. Build Roadmap

## Phase 0 — Portfolio-first project setup

Create the repository and documentation before coding:

- project brief;
- scope and non-goals;
- manual process map;
- automated process map;
- architecture diagram draft;
- decision log;
- failure log;
- metrics log;
- screenshot folder.

Create the public project story from day one.

Deliverables:

- `README.md`
- `/docs/process-audit.md`
- `/docs/architecture.md`
- `/docs/decision-log.md`
- `/docs/failure-log.md`
- `/docs/portfolio-notes.md`

## Phase 1 — Local infrastructure

1. Install Docker Desktop.
2. Run n8n Community Edition with a persistent volume.
3. Create the GitHub repository.
4. Create the Next.js app.
5. Create the Supabase project.
6. Create `.env.example`.
7. Confirm secrets are excluded from Git.
8. Create a simple health-check page and endpoint.

Deliverable:

- local n8n;
- running Next.js app;
- connected Supabase database;
- clean repository.

## Phase 2 — Synthetic business environment

1. Define company, contact, plan and request schemas.
2. Write a deterministic Python seed script.
3. Generate 30 companies and 60 contacts.
4. Create 10 manually curated edge-case accounts.
5. Create internal policy documents.
6. Load customer and contact data into HubSpot test account.
7. Load source-of-truth data into Supabase.

Deliverable:

- repeatable synthetic environment;
- data can be reset from seed.

## Phase 3 — First vertical slice

1. Create the Gmail test inbox.
2. Build n8n Gmail polling workflow.
3. Normalise sender, subject, body, timestamp and message ID.
4. Store the raw request.
5. Call the model for classification and extraction.
6. Validate structured output.
7. Search HubSpot for the contact and company.
8. Send a Slack notification.
9. Generate a response draft.
10. Record workflow events.

Deliverable:

- one sales enquiry moves end to end.

## Phase 4 — Dashboard

Build:

- Operations Inbox;
- Request Workspace;
- Timeline;
- model output panel;
- CRM context panel;
- draft response panel.

Deliverable:

- a hiring manager can understand the workflow without opening n8n.

## Phase 5 — Support workflow and retrieval

1. Add support classification.
2. Create support documents.
3. Retrieve relevant support context.
4. Require citations to source documents.
5. Add severity rules.
6. Add escalation logic.
7. Add support Slack routing.

Deliverable:

- grounded support recommendation with safe escalation.

## Phase 6 — Sensitive account changes

1. Add billing/account-change extraction.
2. Add authorised-contact rules.
3. Retrieve account-change policy.
4. Create human approval queue.
5. Separate recommendation, approval and execution states.
6. Log before-and-after values.
7. Execute CRM update only after approval.
8. Send confirmation.

Deliverable:

- sensitive actions cannot bypass approval.

## Phase 7 — Reliability

Implement:

- idempotency keys;
- duplicate-message handling;
- structured-output retry;
- timeouts;
- rate-limit handling;
- integration retries;
- partial-failure state;
- dead-letter/recovery queue;
- manual replay;
- safe resume from failed step.

Deliverable:

- failure is visible, recoverable and does not duplicate side effects.

## Phase 8 — Evaluation

1. Create 50 labelled email scenarios.
2. Separate development and test sets.
3. Define expected:
   - category;
   - extracted fields;
   - route;
   - required approval;
   - allowed actions;
   - prohibited actions.
4. Run batch evaluations.
5. Store prompt/model version.
6. Track quality, latency and cost.
7. Add every discovered failure as a regression case.

Deliverable:

- repeatable evaluation report, not subjective testing.

## Phase 9 — Security and handover

Add:

- role-based access;
- least-privilege credentials;
- secrets management;
- PII minimisation notes;
- auditability;
- retention policy;
- operator guide;
- maintenance runbook;
- troubleshooting guide;
- short training video.

Deliverable:

- another person could operate and maintain it.

## Phase 10 — Portfolio release

Create:

- polished project page;
- four-minute demo;
- architecture diagram;
- before-and-after map;
- public GitHub README;
- screenshots;
- evaluation report;
- limitations section;
- CV bullets.

---

# 7. Database Outline

## companies

- id
- name
- domain
- industry
- lifecycle_stage
- plan
- account_owner
- support_tier
- status
- created_at

## contacts

- id
- company_id
- name
- email
- role
- authorised_for_account_changes
- created_at

## requests

- id
- external_message_id
- sender_email
- subject
- raw_body
- category
- confidence
- company_id
- contact_id
- status
- urgency
- received_at

## request_extractions

- id
- request_id
- model_provider
- model_name
- prompt_version
- structured_output
- validation_status
- latency_ms
- estimated_cost

## proposed_actions

- id
- request_id
- action_type
- payload
- reason
- risk_level
- requires_approval
- status

## approvals

- id
- proposed_action_id
- reviewer_id
- decision
- edited_payload
- reason
- decided_at

## workflow_events

- id
- request_id
- workflow_run_id
- event_type
- step_name
- status
- payload
- error
- occurred_at

## evaluation_cases

- id
- fixture_name
- input
- expected_output
- tags
- split

## evaluation_results

- id
- evaluation_case_id
- prompt_version
- model
- actual_output
- score
- latency_ms
- estimated_cost
- created_at

---

# 8. Structured AI Output

Example schema:

```ts
const RequestClassification = z.object({
  category: z.enum(["sales", "support", "account_change", "unknown"]),
  confidence: z.number().min(0).max(1),
  companyName: z.string().nullable(),
  contactName: z.string().nullable(),
  urgency: z.enum(["low", "normal", "high", "critical"]),
  extractedFields: z.record(z.unknown()),
  missingInformation: z.array(z.string()),
  suggestedRoute: z.enum([
    "sales",
    "support",
    "billing_approval",
    "human_triage"
  ]),
  draftReply: z.string(),
});
```

Rules:

- invalid output is never silently accepted;
- low confidence routes to human triage;
- the model may propose but does not execute sensitive writes;
- deterministic code controls authorisation and approvals;
- all model configurations are versioned.

---

# 9. Required Failure Scenarios

The portfolio demo and evaluation set should cover:

1. Duplicate Gmail event.
2. Invalid model JSON.
3. Unknown sender.
4. Ambiguous account match.
5. Multiple intents in one email.
6. Missing required details.
7. Unauthorised billing request.
8. HubSpot timeout.
9. Slack failure.
10. Model confidence below threshold.
11. Stale policy document.
12. Retry after a successful side effect.

For each failure, document:

- symptom;
- root cause;
- risk;
- fix;
- regression test;
- final behaviour.

---

# 10. Portfolio Strategy

## Homepage project card

**OpsDesk AI**

*An AI-powered customer-operations workflow that turns inbound emails into routed, reviewed and completed actions.*

Processes real emails, retrieves CRM and policy context, drafts responses, routes sensitive changes for approval and updates HubSpot and Slack through reliable n8n workflows.

Highlights:

- Gmail, HubSpot and Slack integration;
- AI classification and structured extraction;
- human approval for sensitive actions;
- recoverable failures and audit history;
- evaluated against labelled business scenarios.

Buttons:

- View case study
- Watch demo
- Explore repository

## Project page structure

1. Hero and one-line value proposition.
2. Manual business process.
3. Workflow audit.
4. Automated solution.
5. Architecture.
6. Sales scenario.
7. Support scenario.
8. Sensitive account-change scenario.
9. Human-in-the-loop design.
10. Reliability and failure handling.
11. Evaluation results.
12. Security and permissions.
13. Technical decisions and trade-offs.
14. Iteration and lessons.
15. Limitations.
16. Repository and demo links.

## Portfolio metrics

Track real measurements:

- number of labelled scenarios;
- classification accuracy;
- extraction accuracy;
- approval-routing accuracy;
- unsafe-action rate;
- human override rate;
- workflow success rate;
- average handling time;
- latency;
- model cost per case;
- recovery success rate.

Never invent results.

## Public limitation statement

> OpsDesk AI is a production-style simulation built with real APIs, workflows and failure handling. The company and customer records are synthetic so the project can be demonstrated publicly without exposing confidential information.

---

# 11. Demo Video Plan

Target length: **four minutes**.

## 0:00–0:25 — Problem

Show the manual process map and explain the fragmented workflow.

## 0:25–1:25 — Sales happy path

Send a real test email and show:

- Gmail;
- n8n execution;
- extraction;
- HubSpot lookup;
- Slack notification;
- draft reply;
- event timeline.

## 1:25–2:25 — Sensitive account change

Show:

- sender matching;
- authorisation check;
- policy;
- proposed update;
- human approval;
- controlled execution;
- audit history.

## 2:25–3:15 — Failure and recovery

Simulate HubSpot failure and show:

- workflow stops safely;
- no duplicate side effect;
- recovery queue;
- retry from failed step;
- successful completion.

## 3:15–3:45 — Evaluation

Show:

- labelled cases;
- quality metrics;
- cost and latency;
- a failure that became a regression test.

## 3:45–4:00 — Conclusion

Suggested line:

> This project demonstrates how I approach AI automation: understand the workflow first, use AI selectively, integrate the systems already in place, preserve human control and design for failure rather than only the happy path.

---

# 12. Live Demo Mode

Do not expose live credentials.

Create a safe Demo Mode with five seeded scenarios:

- Sales enquiry.
- Support request.
- Billing change.
- Missing information.
- CRM failure.

The visitor selects a scenario and clicks **Run scenario**.

The dashboard shows:

- input email;
- current step;
- extracted data;
- CRM context;
- proposed actions;
- approval state;
- timeline;
- final result.

Use stored outputs or restricted sandbox executions to control cost and security.

---

# 13. Evidence to Capture While Building

## Decision log

```text
Decision 004: Use Gmail polling before public webhooks
Reason: Supports local development without a public endpoint
Trade-off: Requests arrive with a short delay
Future: Switch to webhook after VPS deployment
```

## Failure log

```text
Failure 011: Duplicate HubSpot contact created
Cause: Retry repeated a successful API call
Fix: Added idempotency key and existing-contact check
Regression test: duplicate-contact-02
```

## Metric history

```text
v0.1 routing accuracy: 72%
v0.2 routing accuracy: 86%
v0.3 routing accuracy: 94%
```

## Screenshots

Capture:

- early n8n workflow;
- completed workflow;
- failed execution;
- human approval;
- timeline;
- evaluation dashboard;
- before-and-after maps;
- architecture evolution.

---

# 14. Repository Structure

```text
opsdesk-ai/
├── apps/
│   └── dashboard/
├── services/
│   └── automation-api/
├── n8n/
│   ├── inbound-request-workflow.json
│   ├── approval-workflow.json
│   ├── error-workflow.json
│   └── evaluation-workflow.json
├── scripts/
│   ├── seed_data.py
│   ├── generate_scenarios.py
│   └── run_evaluations.py
├── evaluation/
│   ├── cases.json
│   └── expected_outputs.json
├── docs/
│   ├── architecture.md
│   ├── process-audit.md
│   ├── security.md
│   ├── runbook.md
│   ├── decision-log.md
│   ├── failure-log.md
│   └── portfolio-notes.md
├── .env.example
└── README.md
```

Export sanitised n8n workflows. Never commit credentials, production IDs or personal data.

---

# 15. Non-Goals

Do not build:

- a general-purpose chatbot;
- a large multi-agent control centre;
- a full CRM;
- every company department;
- five automation platforms;
- model training;
- deep ML;
- Kubernetes;
- autonomous sensitive actions;
- a complex agent framework in version one;
- pixel-perfect UI before the workflow works.

Depth and reliability matter more than feature count.

---

# 16. Definition of Complete

The project is portfolio-ready when:

- all three request categories work;
- a real Gmail test inbox is integrated;
- HubSpot and Slack are integrated;
- model output is structured and validated;
- sensitive actions require approval;
- workflows are idempotent;
- failures are visible and recoverable;
- at least 50 labelled scenarios exist;
- metrics are displayed;
- architecture and process maps exist;
- repository is documented;
- four-minute demo is recorded;
- public project page is complete;
- limitations are stated honestly.

---

# 17. CV Entry

## OpsDesk AI — AI Customer Operations Automation  
**n8n · TypeScript · Next.js · HubSpot · Supabase · Slack · Gmail · LLM APIs**

- Built a production-style request-to-resolution system that classifies inbound business emails, retrieves CRM and policy context, drafts responses and executes approved actions across HubSpot, Slack and Gmail.
- Designed human-in-the-loop controls, role-based permissions and deterministic safeguards for sensitive account changes.
- Implemented API integrations with schema validation, idempotent retries, failure recovery, audit trails and workflow monitoring.
- Evaluated the system against labelled scenarios, tracking routing accuracy, extraction quality, approval safety, latency and cost.

Replace general wording with actual metrics when available.

---

# 18. First Ten Tasks

1. Create the repository and copy this build pack into `/docs`.
2. Write the fictional company profile in one page.
3. Draw the manual and automated workflow maps.
4. Install Docker Desktop and start local n8n.
5. Create Supabase project and initial schema.
6. Create HubSpot developer test account.
7. Create Gmail test inbox and Slack test workspace.
8. Write Python data seed script.
9. Build the Gmail → n8n → store-request path.
10. Add one structured sales-classification call and validate it.

Do not work on the dashboard beyond a basic request table until task 10 works end to end.
