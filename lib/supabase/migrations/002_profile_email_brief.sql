-- Run this in the Supabase SQL editor.
-- Adds the opt-in toggle for the daily morning brief and ensures timezone
-- column accepts the IANA format (it already does — text column).

alter table public.profiles
  add column if not exists email_brief_enabled boolean not null default false;

-- (timezone already exists as `text default 'UTC'` from the initial schema)
