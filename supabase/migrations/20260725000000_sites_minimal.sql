-- Lesson 9: minimal sites table for property lookup (DEC-014 reviewed in-session)
-- Apply in Supabase SQL Editor. Idempotent-ish seed for Riverside Court.

create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address_line text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create unique index if not exists idx_sites_name_lower on sites (lower(name));

insert into sites (name, address_line, status)
select 'Riverside Court', 'Quayside demo — Riverside Court', 'active'
where not exists (
  select 1 from sites where lower(name) = lower('Riverside Court')
);
