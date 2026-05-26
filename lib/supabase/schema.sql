-- ─────────────────────────────────────────────────────────────
-- ASCEND — Supabase schema
-- Run this in the Supabase SQL editor after creating a project.
-- Row-level security is enforced everywhere — users can only
-- read/write their own data.
-- ─────────────────────────────────────────────────────────────

-- profile: extends auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  avatar_url text,
  timezone text default 'UTC',
  email_brief_enabled boolean not null default false,
  joined_at timestamptz default now(),
  -- onboarding goals
  income_target_monthly numeric,
  savings_target numeric,
  fitness_focus text,
  bodyweight_goal_kg numeric,
  daily_habits text[],
  primary_focus text
);

-- finance
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  amount numeric not null,
  type text not null check (type in ('income','expense')),
  category text not null,
  description text,
  recurring boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  target numeric not null,
  saved numeric not null default 0,
  deadline date
);

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  lender text not null,
  total numeric not null,
  paid numeric not null default 0,
  monthly_payment numeric,
  interest_rate numeric
);

-- missions / habits
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium',
  completed boolean not null default false,
  due_at timestamptz,
  category text,
  created_at timestamptz default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  icon text,
  kind text not null default 'good' check (kind in ('good','bad')),
  target_per_week int default 7,
  streak int default 0,
  best_streak int default 0,
  created_at timestamptz default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  completed boolean not null default true,
  unique (habit_id, date)
);

-- gym
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  name text,
  duration_min int,
  notes text,
  exercises jsonb,
  created_at timestamptz default now()
);

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  weight_kg numeric,
  body_fat_pct numeric,
  sleep_hours numeric,
  unique (user_id, date)
);

-- mind
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  mood text,
  win text,
  loss text,
  reflection text,
  tags text[]
);

-- discipline daily snapshot (computed daily)
create table if not exists public.discipline_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  date date not null,
  score int not null,
  habits_pct int,
  missions_pct int,
  gym boolean,
  finance_logged boolean,
  sleep_hours numeric,
  unique (user_id, date)
);

-- ── RLS ─────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.savings_goals enable row level security;
alter table public.debts enable row level security;
alter table public.missions enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.body_metrics enable row level security;
alter table public.journal_entries enable row level security;
alter table public.discipline_days enable row level security;

-- standard self-only policies on each table
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profiles','transactions','savings_goals','debts','missions',
    'habits','habit_logs','workouts','body_metrics','journal_entries',
    'discipline_days'
  ])
  loop
    execute format('drop policy if exists "self_select" on public.%I;', t);
    execute format('create policy "self_select" on public.%I for select using (auth.uid() = %s);',
      t, case when t = 'profiles' then 'id' else 'user_id' end);
    execute format('drop policy if exists "self_insert" on public.%I;', t);
    execute format('create policy "self_insert" on public.%I for insert with check (auth.uid() = %s);',
      t, case when t = 'profiles' then 'id' else 'user_id' end);
    execute format('drop policy if exists "self_update" on public.%I;', t);
    execute format('create policy "self_update" on public.%I for update using (auth.uid() = %s);',
      t, case when t = 'profiles' then 'id' else 'user_id' end);
    execute format('drop policy if exists "self_delete" on public.%I;', t);
    execute format('create policy "self_delete" on public.%I for delete using (auth.uid() = %s);',
      t, case when t = 'profiles' then 'id' else 'user_id' end);
  end loop;
end $$;

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
