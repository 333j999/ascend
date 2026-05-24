import Link from "next/link";
import {
  ArrowUpRight, Flame, Dumbbell,
  BookOpen, ArrowRight, Plus, Wallet, Target as TargetIcon,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { RadialScore } from "@/components/ui/radial-score";
import { MissionChecklist } from "@/components/dashboard/mission-checklist";
import { HabitStrip } from "@/components/dashboard/habit-strip";
import { QuoteCard } from "@/components/dashboard/quote-card";
import { ChartArea } from "@/components/charts/area-chart";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import {
  MOCK_ANALYTICS, MOCK_MISSIONS, MOCK_HABITS, MOCK_MONTHLY_FLOW,
  MOCK_SAVINGS_GOALS, MOCK_DISCIPLINE, MOCK_USER, MOCK_WORKOUTS,
  MOCK_BODY_METRICS, MOCK_JOURNAL,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const a = MOCK_ANALYTICS;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return "Late night, operator";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────── */}
      <PageHeader
        code={`▢ Operator · ${MOCK_USER.name.split(" ")[0]} · ${new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}`}
        title={<>{greeting},<span className="italic font-light text-ember-300"> {MOCK_USER.name.split(" ")[0]}.</span></>}
        subtitle="This is the man you are today. The numbers don't lie. Make the next hour count."
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" href="/app/missions">
              Today&rsquo;s Plan <ArrowRight className="size-3.5" />
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="size-3.5" /> Quick Log
            </Button>
          </div>
        }
      />

      {/* ── Top KPI row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Stat
            label="Net Worth"
            value={formatCurrency(a.net_worth)}
            delta={6.0}
            deltaLabel="vs last month"
          />
        </Card>
        <Card>
          <Stat
            label="Monthly Income"
            value={formatCurrency(a.monthly_income)}
            delta={4.6}
            deltaLabel="vs Apr"
          />
        </Card>
        <Card>
          <Stat
            label="Monthly Burn"
            value={formatCurrency(a.monthly_expenses)}
            delta={1.7}
            deltaLabel="vs Apr"
          />
        </Card>
        <Card>
          <Stat
            label="Savings Rate"
            value={`${Math.round(a.savings_rate * 100)}`}
            unit="%"
            delta={5.4}
            deltaLabel="trending"
          />
        </Card>
      </div>

      {/* ── Discipline + Missions + Quote ─────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Discipline */}
        <Card className="col-span-12 lg:col-span-4 flex flex-col items-center p-6">
          <CardHeader
            label="▢ Discipline · today"
            title="Score"
            className="self-stretch"
            action={
              <span className="font-mono text-[11px] text-signal-green tabular-nums inline-flex items-center gap-0.5">
                <ArrowUpRight className="size-3" strokeWidth={2.4} /> +8.4%
              </span>
            }
          />
          <RadialScore value={a.discipline_score} size={210} stroke={10} className="my-2" />
          <div className="mt-3 grid grid-cols-3 gap-2 w-full text-center">
            <MiniKpi label="Habits"  value="92%" />
            <MiniKpi label="Mission" value="71%" />
            <MiniKpi label="Sleep"   value="8.2h" />
          </div>
        </Card>

        {/* Missions */}
        <Card className="col-span-12 lg:col-span-5">
          <MissionChecklist initial={MOCK_MISSIONS} />
        </Card>

        {/* Streak + Quote */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-ember-500/30 shadow-ember-glow-sm">
            <CardHeader label="▢ Active streak" title="Don't break it." />
            <div className="flex items-baseline gap-2">
              <Flame className="size-7 text-ember-400" strokeWidth={1.5} />
              <span className="stat text-5xl text-ember-300 tracking-tightest">{a.current_streak}</span>
              <span className="font-mono text-xs text-ink-muted">days</span>
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Best · {a.longest_streak} days
            </div>
            <Progress value={(a.current_streak / a.longest_streak) * 100} className="mt-4" glow />
          </Card>
          <QuoteCard />
        </div>
      </div>

      {/* ── Money + Savings ─────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader
            label="▢ Cash flow · 7 months"
            title="Income vs Burn"
            action={
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-500" /> Income</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-edge" /> Burn</span>
              </div>
            }
          />
          <ChartArea
            data={MOCK_MONTHLY_FLOW}
            xKey="month"
            yKeys={[
              { key: "income", label: "Income", color: "#ff5e1a" },
              { key: "expenses", label: "Burn", color: "#3a3a44" },
            ]}
            height={260}
            format="currencyK"
          />
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader label="▢ Savings · active goals" title="Progress" />
          <div className="space-y-5">
            {MOCK_SAVINGS_GOALS.map((g) => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-ink-primary">{g.name}</span>
                    <span className="stat text-sm text-ink-secondary">
                      ${(g.saved / 1000).toFixed(1)}k <span className="text-ink-muted">/ ${(g.target / 1000).toFixed(0)}k</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={pct} className="flex-1" />
                    <span className="font-mono text-[11px] text-ember-400 tabular-nums w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Habits + Gym + Body ─────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader label="▢ Habits · this week" title="Consistency check" />
          <HabitStrip habits={MOCK_HABITS} />
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Gym · last session"
            title={
              <Link href="/app/gym" className="hover:text-ember-400 transition-colors inline-flex items-center gap-1">
                {MOCK_WORKOUTS[0].name} <ArrowRight className="size-3.5 opacity-50" />
              </Link>
            }
            action={
              <span className="font-mono text-[11px] text-signal-green inline-flex items-center gap-1 uppercase tracking-widest">
                <Dumbbell className="size-3" /> PR
              </span>
            }
          />
          <div className="grid grid-cols-3 gap-3 mb-5">
            <MiniKpi label="Duration" value={`${MOCK_WORKOUTS[0].duration_min}min`} />
            <MiniKpi label="Exercises" value={`${MOCK_WORKOUTS[0].exercises.length}`} />
            <MiniKpi label="Top set" value="200kg" />
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {MOCK_WORKOUTS[0].exercises.map((ex) => (
              <div key={ex.name} className="flex items-center justify-between py-1.5 border-b border-edge-subtle last:border-0">
                <span className="text-ink-primary">{ex.name}</span>
                <span className="text-ink-secondary tabular-nums">
                  {ex.sets.map(s => `${s.reps}×${s.weight_kg}`).join("  ")}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Body + Discipline timeline + Journal ─────────────── */}
      <div className="grid grid-cols-12 gap-4">

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader label="▢ Body · 6 months" title="Composition" />
          <ChartArea
            data={MOCK_BODY_METRICS}
            xKey="date"
            yKeys={[{ key: "weight_kg", label: "Weight", color: "#ff5e1a" }]}
            height={140}
            format="weight"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniKpi label="Current" value={`${MOCK_BODY_METRICS.at(-1)?.weight_kg}kg`} />
            <MiniKpi label="Δ since Jan" value="-3.6kg" />
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ Discipline · 90 days"
            title="The chain"
            action={<span className="font-mono text-[11px] text-ember-400">Avg · 78</span>}
          />
          <StreakHeatmap data={MOCK_DISCIPLINE} />
        </Card>

        <Card className="col-span-12 lg:col-span-3">
          <CardHeader
            label="▢ Journal · latest"
            title="Yesterday"
            action={<Link href="/app/mind" className="btn-link inline-flex items-center gap-1">View <ArrowRight className="size-3" /></Link>}
          />
          <div className="space-y-3 text-sm text-ink-secondary leading-relaxed">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400 mr-2">Win</span>
              {MOCK_JOURNAL[0].win}
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal-red mr-2">Loss</span>
              {MOCK_JOURNAL[0].loss}
            </div>
            <div className="text-ink-primary italic">
              &ldquo;{MOCK_JOURNAL[0].reflection}&rdquo;
            </div>
          </div>
        </Card>
      </div>

      {/* ── Quick actions row ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: "/app/finance",    label: "Log Expense",   icon: Wallet },
          { href: "/app/missions",   label: "Add Mission",   icon: TargetIcon },
          { href: "/app/gym",        label: "Log Workout",   icon: Dumbbell },
          { href: "/app/mind",       label: "New Journal",   icon: BookOpen },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href} href={href}
            className="card-interactive p-5 flex items-center gap-3 group"
          >
            <span className="size-10 rounded-xs border border-edge-subtle bg-surface-3 grid place-items-center group-hover:border-ember-500/40 group-hover:bg-ember-500/5 transition-colors">
              <Icon className="size-4 text-ink-secondary group-hover:text-ember-400 transition-colors" strokeWidth={1.6} />
            </span>
            <span className="flex-1">
              <span className="block text-sm text-ink-primary">{label}</span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-muted">Quick action</span>
            </span>
            <ArrowRight className="size-4 text-ink-muted group-hover:text-ember-400 transition-colors" />
          </Link>
        ))}
      </div>

    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card bg-surface-3 p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{label}</div>
      <div className="mt-1 stat text-lg text-ink-primary tracking-tight">{value}</div>
    </div>
  );
}
