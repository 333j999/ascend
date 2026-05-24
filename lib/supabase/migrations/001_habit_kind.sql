-- Run this in the Supabase SQL editor if you already created your schema before
-- the `habits.kind` column was added. Safe to run multiple times.

alter table public.habits
  add column if not exists kind text not null default 'good';

-- Optional: enforce the check constraint
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'habits_kind_check'
  ) then
    alter table public.habits
      add constraint habits_kind_check check (kind in ('good','bad'));
  end if;
end $$;
