# ASCEND

> Track the man you're becoming.

A personal operating system for ambitious men. Money, missions, gym, mind, discipline — quantified.

Built with Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Recharts · Framer Motion.

## Getting started

```bash
# 1. install
npm install

# 2. (optional) wire Supabase — works in "preview mode" without it
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. run
npm run dev
```

Open <http://localhost:3000>.

## Routes

| Path | What it is |
|------|------------|
| `/` | Landing page (premium marketing site) |
| `/login`, `/signup` | Auth screens |
| `/onboarding` | 5-step new-user setup |
| `/app/dashboard` | Main command center (default after login) |
| `/app/finance` | Financial Command Center — income, burn, debt, savings |
| `/app/missions` | Daily Mission System — tasks, habits, streaks |
| `/app/gym` | Gym tracker — workouts, PRs, body comp |
| `/app/mind` | Journal — wins, losses, reflections, mood |
| `/app/discipline` | Discipline score — weighted daily readout |
| `/app/analytics` | Life analytics — cross-module trends |
| `/app/settings` | Profile + integrations |

## Architecture

```
app/
  (auth)/              # login, signup, onboarding (shared 2-col layout)
  (app)/               # protected app routes (sidebar + topbar shell)
  page.tsx             # landing
  layout.tsx           # root layout + fonts

components/
  brand/               # logo
  landing/             # hero, features, preview, pricing, footer, ticker
  app-shell/           # sidebar, topbar, page header
  dashboard/           # mission checklist, habit strip, quote card
  charts/              # Recharts wrappers + custom heatmap
  ui/                  # primitives — Button, Card, Stat, Progress, Input, Badge, RadialScore

lib/
  mock-data.ts         # seed/preview data
  utils.ts             # cn, formatters
  supabase/
    client.ts          # browser client
    server.ts          # server client
    schema.sql         # SQL to bootstrap a Supabase project

types/
  index.ts             # all domain types

middleware.ts          # session refresh + auth gate on /app/*
```

## Supabase

The app runs entirely on mock data out of the box.

To enable real auth + persistence:

1. Create a project at <https://supabase.com>.
2. Copy the project URL and anon key into `.env.local`.
3. Open the Supabase SQL editor and run `lib/supabase/schema.sql` — this creates every table with row-level security enforced.
4. Restart `npm run dev`. The middleware will start protecting `/app/*`.

## Design system

A single accent (`ember-500` — `#ff5e1a`) carries every signal in the UI.
Everything else lives in 5 surface tones and 4 ink tones (see `tailwind.config.ts`).

Typography: **Geist** (sans) + **JetBrains Mono** (all numeric/data display).

The aesthetic is "tactical precision" — matte black surfaces, hairline borders, monospace data labels, subtle ember glows. Inspired by Bloomberg Terminal × Linear × military HUDs.

## License

Private — all rights reserved.
