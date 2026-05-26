import Link from "next/link";
import { redirect } from "next/navigation";
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
import { EmptyState } from "@/components/ui/empty-state";
import { MissionChecklist } from "@/components/dashboard/mission-checklist";
import { HabitStrip } from "@/components/dashboard/habit-strip";
import { QuoteCard } from "@/components/dashboard/quote-card";
import { ChartArea } from "@/components/charts/area-chart";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import { QuickLogButton } from "@/components/app-shell/quick-log-button";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  getTransactions, getSavingsGoals, getMissions, getHabits,
  getWorkouts, getBodyMetrics, getJournalEntries, getDisciplineDays,
  aggregateMonthlyFlow, calculateMonthSummary,
} from "@/lib/supabase/queries";
import { computeDashboardSummary } from "@/lib/discipline";
import { getBriefing } from "@/lib/briefing";
import { BriefingCard } from "@/components/briefing/briefing-card";
import { hourInTZ } from "@/lib/timezone";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tz = user.profile?.timezone ?? "UTC";
  const [transactions, savingsGoals, missions, habits, workouts, bodyMetrics, journal, discipline] = await Promise.all([
    getTransactions(user.id, 50),
    getSavingsGoals(user.id),
    getMissions(user.id, tz),
    getHabits(user.id, tz),
    getWorkouts(user.id, 5),
    getBodyMetrics(user.id, 6),
    getJournalEntries(user.id, 1),
    getDisciplineDays(user.id, 90, tz),
  ]);

  const monthSummary = calculateMonthSummary(transactions);
  const monthlyFlow = aggregateMonthlyFlow(transactions);
  const summary = computeDashboardSummary({ transactions, missions, habits, workouts, bodyMetrics, discipline, tz });
  const latestWorkout = workouts[0];
  const latestJournal = journal[0];

  const hour = hourInTZ(tz);
  const greeting = (() => {
    if (hour < 5) return "Late night, operator";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const firstName = user.name.split(" ")[0];

  // Show the briefing band when it's morning (5am — 12pm local).
  // Outside that window the dashboard goes straight to KPIs.
  const showBriefing = hour >= 5 && hour < 12;
  const briefing = showBriefing
    ? await getBriefing(user.id, tz)
    : null;

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────── */}
      <PageHeader
        code={`▢ Operator · ${firstName} · ${new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}`}
        title={<>{greeting},<span className="italic font-light text-ember-300"> {firstName}.</span></>}
        subtitle={
          summary.hasAnyData
            ? "This is the man you are today. The numbers don't lie. Make the next hour count."
            : "Empty board. That's the cleanest start there is. Log your first move below."
        }
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" href="/app/missions">
              Today&rsquo;s Plan <ArrowRight className="size-3.5" />
            </Button>
            <QuickLogButton />
          </div>
        }
      />

      {briefing && <BriefingCard briefing={briefing} firstName={firstName} />}

      {/* ── Top KPI row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Stat label="Net (this month)" value={formatCurrency(monthSummary.net)} hint={summary.hasAnyData ? "income − burn" : "no data yet"} />
        </Card>
        <Card>
          <Stat label="Income · this month" value={formatCurrency(monthSummary.income)} hint={summary.hasAnyData ? "" : "log to begin"} />
        </Card>
        <Card>
          <Stat label="Burn · this month" value={formatCurrency(monthSummary.expenses)} hint={summary.hasAnyData ? "" : "log to begin"} />
        </Card>
        <Card>
          <Stat
            label="Savings Rate"
            value={monthSummary.income > 0 ? `${Math.round(((monthSummary.income - monthSummary.expenses) / monthSummary.income) * 100)}` : "—"}
            unit={monthSummary.income > 0 ? "%" : ""}
            hint="of income"
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
          />
          <RadialScore value={summary.disciplineScore} size={210} stroke={10} className="my-2" />
          <div className="mt-3 grid grid-cols-3 gap-2 w-full text-center">
            <MiniKpi label="Habits"  value={`${summary.habitsPct}%`} />
            <MiniKpi label="Mission" value={`${summary.missionsPct}%`} />
            <MiniKpi label="Sleep"   value={summary.sleepHours ? `${summary.sleepHours.toFixed(1)}h` : "—"} />
          </div>
        </Card>

        {/* Missions */}
        <Card className="col-span-12 lg:col-span-5">
          <MissionChecklist initial={missions} />
        </Card>

        {/* Streak + Quote */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className={summary.currentStreak > 0 ? "bg-gradient-to-br from-surface-2 to-surface-1 border-ember-500/30 shadow-ember-glow-sm" : ""}>
            <CardHeader label="▢ Active streak" title={summary.currentStreak > 0 ? "Don't break it." : "Start your streak"} />
            <div className="flex items-baseline gap-2">
              <Flame className="size-7 text-ember-400" strokeWidth={1.5} />
              <span className="stat text-5xl text-ember-300 tracking-tightest">{summary.currentStreak}</span>
              <span className="font-mono text-xs text-ink-muted">days</span>
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Best · {summary.longestStreak} days
            </div>
            {summary.longestStreak > 0 && (
              <Progress value={(summary.currentStreak / Math.max(summary.longestStreak, 1)) * 100} className="mt-4" glow />
            )}
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
          {transactions.length > 0 ? (
            <ChartArea
              data={monthlyFlow}
              xKey="month"
              yKeys={[
                { key: "income", label: "Income", color: "#ff5e1a" },
                { key: "expenses", label: "Burn", color: "#3a3a44" },
              ]}
              height={260}
              format="currencyK"
            />
          ) : (
            <EmptyState
              icon={<Wallet className="size-5" />}
              title="No transactions yet"
              description="Log your first income or expense to see your cash flow visualized here."
              action={<QuickLogButton label="Log first transaction" />}
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader label="▢ Savings · active goals" title="Progress" />
          {savingsGoals.length > 0 ? (
            <div className="space-y-5">
              {savingsGoals.map((g) => {
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
          ) : (
            <EmptyState
              title="No goals set"
              description="Set a target. Define a deadline. Compound."
              action={<Button variant="primary" size="sm" href="/app/finance"><Plus className="size-3.5" /> Add goal</Button>}
            />
          )}
        </Card>
      </div>

      {/* ── Habits + Gym ─────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader label="▢ Habits · this week" title="Consistency check" />
          {habits.length > 0 ? (
            <HabitStrip habits={habits} />
          ) : (
            <EmptyState
              title="No habits tracked"
              description="Your onboarding seeds these. Add them in Settings or re-run onboarding."
              action={<Button variant="ghost" size="sm" href="/onboarding">Open onboarding</Button>}
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Gym · last session"
            title={
              latestWorkout ? (
                <Link href="/app/gym" className="hover:text-ember-400 transition-colors inline-flex items-center gap-1">
                  {latestWorkout.name} <ArrowRight className="size-3.5 opacity-50" />
                </Link>
              ) : (
                "No sessions logged"
              )
            }
          />
          {latestWorkout ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <MiniKpi label="Duration" value={`${latestWorkout.duration_min}min`} />
                <MiniKpi label="Exercises" value={`${latestWorkout.exercises.length}`} />
                <MiniKpi label="Total sets" value={`${latestWorkout.exercises.reduce((s, e) => s + e.sets.length, 0)}`} />
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {latestWorkout.exercises.slice(0, 4).map((ex) => (
                  <div key={ex.name} className="flex items-center justify-between py-1.5 border-b border-edge-subtle last:border-0">
                    <span className="text-ink-primary">{ex.name}</span>
                    <span className="text-ink-secondary tabular-nums">
                      {ex.sets.map(s => `${s.reps}×${s.weight_kg}`).join("  ")}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Dumbbell className="size-5" />}
              title="Log your first workout"
              description="The body is the first asset. Track it."
              action={<Button variant="primary" size="sm" href="/app/gym"><Plus className="size-3.5" /> Log workout</Button>}
            />
          )}
        </Card>
      </div>

      {/* ── Body + Discipline timeline + Journal ─────────────── */}
      <div className="grid grid-cols-12 gap-4">

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader label="▢ Body · last 6 entries" title="Composition" />
          {bodyMetrics.length > 0 ? (
            <>
              <ChartArea
                data={bodyMetrics}
                xKey="date"
                yKeys={[{ key: "weight_kg", label: "Weight", color: "#ff5e1a" }]}
                height={140}
                format="weight"
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniKpi label="Current" value={`${bodyMetrics.at(-1)?.weight_kg}kg`} />
                <MiniKpi
                  label="Δ first → last"
                  value={`${((bodyMetrics.at(-1)?.weight_kg ?? 0) - (bodyMetrics[0]?.weight_kg ?? 0)).toFixed(1)}kg`}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No weigh-ins yet"
              description="Log on the Gym page."
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ Discipline · 90 days"
            title="The chain"
            action={
              <span className="font-mono text-[11px] text-ember-400">
                Avg · {summary.disciplineAvg}
              </span>
            }
          />
          {discipline.length > 0 ? (
            <StreakHeatmap data={discipline} />
          ) : (
            <EmptyState
              title="No discipline data yet"
              description="Log habits, missions, and workouts. The score builds itself."
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-3">
          <CardHeader
            label="▢ Journal · latest"
            title={latestJournal ? "Last entry" : "Empty"}
            action={<Link href="/app/mind" className="btn-link inline-flex items-center gap-1">View <ArrowRight className="size-3" /></Link>}
          />
          {latestJournal ? (
            <div className="space-y-3 text-sm text-ink-secondary leading-relaxed">
              {latestJournal.win && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400 mr-2">Win</span>
                  {latestJournal.win}
                </div>
              )}
              {latestJournal.loss && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-signal-red mr-2">Loss</span>
                  {latestJournal.loss}
                </div>
              )}
              {latestJournal.reflection && (
                <div className="text-ink-primary italic">
                  &ldquo;{latestJournal.reflection}&rdquo;
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No reflection yet"
              description="Five minutes a day."
              action={<Button variant="ghost" size="sm" href="/app/mind">Open journal</Button>}
            />
          )}
        </Card>
      </div>

      {/* ── Quick actions row ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: "/app/finance",    label: "Open Finance",   icon: Wallet },
          { href: "/app/missions",   label: "Open Missions",  icon: TargetIcon },
          { href: "/app/gym",        label: "Open Gym",       icon: Dumbbell },
          { href: "/app/mind",       label: "Open Journal",   icon: BookOpen },
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
              <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-muted">Module</span>
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
