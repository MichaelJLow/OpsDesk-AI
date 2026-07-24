-- OpsDesk AI initial schema (Phase 1 stub)
-- Apply via Supabase SQL editor or CLI once the project exists.
-- Seed data arrives in Phase 2.

create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  industry text,
  lifecycle_stage text,
  plan text,
  account_owner text,
  support_tier text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies (id) on delete set null,
  name text not null,
  email text not null unique,
  role text,
  authorised_for_account_changes boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  external_message_id text not null unique,
  sender_email text not null,
  subject text,
  raw_body text,
  category text,
  confidence numeric,
  company_id uuid references companies (id) on delete set null,
  contact_id uuid references contacts (id) on delete set null,
  status text not null default 'received',
  urgency text,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists request_extractions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  model_provider text,
  model_name text,
  prompt_version text,
  structured_output jsonb,
  validation_status text not null default 'pending',
  latency_ms integer,
  estimated_cost numeric,
  created_at timestamptz not null default now()
);

create table if not exists proposed_actions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  action_type text not null,
  payload jsonb,
  reason text,
  risk_level text,
  requires_approval boolean not null default false,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  proposed_action_id uuid not null references proposed_actions (id) on delete cascade,
  reviewer_id text,
  decision text not null,
  edited_payload jsonb,
  reason text,
  decided_at timestamptz not null default now()
);

create table if not exists workflow_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests (id) on delete cascade,
  workflow_run_id text,
  event_type text not null,
  step_name text,
  status text not null,
  payload jsonb,
  error text,
  occurred_at timestamptz not null default now()
);

create table if not exists evaluation_cases (
  id uuid primary key default gen_random_uuid(),
  fixture_name text not null unique,
  input jsonb not null,
  expected_output jsonb not null,
  tags text[] default '{}',
  split text not null default 'dev',
  created_at timestamptz not null default now()
);

create table if not exists evaluation_results (
  id uuid primary key default gen_random_uuid(),
  evaluation_case_id uuid not null references evaluation_cases (id) on delete cascade,
  prompt_version text,
  model text,
  actual_output jsonb,
  score numeric,
  latency_ms integer,
  estimated_cost numeric,
  created_at timestamptz not null default now()
);

create index if not exists idx_requests_external_message_id on requests (external_message_id);
create index if not exists idx_workflow_events_request_id on workflow_events (request_id);
create index if not exists idx_contacts_email on contacts (email);
