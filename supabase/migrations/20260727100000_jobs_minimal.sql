-- Minimal jobs table for lab protected execution (chargeable work orders).
-- No billing / contractor dispatch. Apply in Supabase SQL editor.

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  proposed_action_id uuid references proposed_actions (id) on delete set null,
  job_type text not null default 'chargeable_work_order',
  title text,
  status text not null default 'queued',
  lab_only boolean not null default true,
  payload jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_request_id on jobs (request_id);
create unique index if not exists idx_jobs_proposed_action_unique
  on jobs (proposed_action_id)
  where proposed_action_id is not null;
