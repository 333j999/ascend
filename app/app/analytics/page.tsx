import { redirect } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartArea } from "@/components/charts/area-chart";
import { ChartBars } from "@/components/charts/bar-chart";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  getTransactions, getMissions, getHabits, getWorkouts,
  getBodyMetrics, getDisciplineDays, getJournalEntries, getSavingsGoals, getDebts,
  aggregateMonthlyFlow,
} from "@/lib/supabase/queries";
import { computeDashboardSummary } from "@/lib/discipline";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tz = user.profile?.timezone ?? "UTC";
  const [transactions, missions, habits, workouts, bodyMetrics, discipline, journal, savingsGoals, debts] = await Promise.all([
    getTransactions(user.id, 500),
    getMissions(user.id, tz),
    getHabits(user.id, tz),
    getWorkouts(user.id, 100),
    getBodyMetrics(user.id, 365),
    getDisciplineDays(user.id, 365, tz),
    getJournalEntries(user.id, 100),
    getSavingsGoals(user.id),
    getDebts(user.id),
  ]);

  const summary = computeDashboardSummary({ transactions, missions, habits, workouts, bodyMetrics, discipline, tz });
  const monthlyFlow = aggregateMonthlyFlow(transactions, 7);
  const productivity = computeMonthlyProductivity({ missions, workouts, journal });
  const habitSuccess = habits.map(h => ({
    name: h.name,
    rate: Math.round((h.completions_this_week.filter(Boolean).length / 7) * 100),
  }));

  // Naive net worth series: just current snapshot
  const totalSaved = savingsGoals.reduce((s, g) => s + g.saved, 0);
  const totalDebt = debts.reduce((s, d) => s + (d.total - d.paid), 0);
  const netWorth = totalSaved - totalDebt;
  const netWorthSeries = computeNetWorthSeries(savingsGoals, transactions);

  // Year-over-year net worth growth — naive since we don't have history
  const yoyGrowth = netWorthSeries.length > 1
    ? Math.round(((netWorthSeries.at(-1)!.value - netWorthSeries[0].value) / Math.max(netWorthSeries[0].value, 1)) * 100)
    : 0;

  const workoutsYTD = workouts.filter(w => new Date(w.date).getFullYear() === new Date().getFullYear()).length;
  const avgHabitSuccess = habits.length
    ? Math.round(habits.reduce((s, h) => s + h.completions_this_week.filter(Boolean).length, 0) / habits.length / 7 * 100)
    : 0;

  const hasAnyData = summary.hasAnyData;

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 07 · Life Analytics"
        title={<>Convert chaos into <span className="italic font-light text-ember-300">signal.</span></>}
        subtitle="Every dollar, rep, mood — folded into clean, comparable lines. Read the weather. Adjust the sails."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Net worth" value={`$${netWorth.toLocaleString()}`} hint={hasAnyData ? "saved − debt" : "no data"} /></Card>
        <Card><Stat label="Avg. discipline · 30d" value={String(summary.disciplineAvg)} unit={summary.disciplineAvg ? "/100" : ""} /></Card>
        <Card><Stat label="Workouts · YTD" value={String(workoutsYTD)} /></Card>
        <Card><Stat label="Habits success · 7d" value={String(avgHabitSuccess)} unit="%" /></Card>
      </div>

      <Card>
        <CardHeader
          label="▢ Wealth · trajectory"
          title="The compound curve"
          action={yoyGrowth !== 0 && <Badge tone="ember"><TrendingUp className="size-3" /> {yoyGrowth > 0 ? "+" : ""}{yoyGrowth}%</Badge>}
        />
        {netWorthSeries.length >= 2 ? (
          <ChartArea
            data={netWorthSeries}
            xKey="month"
            yKeys={[{ key: "value", label: "Net worth", color: "#ff5e1a" }]}
            height={300}
            format="currencyK"
          />
        ) : (
          <EmptyState
            title="Need more history"
            description="Log savings goals + a couple months of transactions to see the curve."
          />
        )}
      </Card>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Body composition"
            title="Physical signal"
            action={bodyMetrics.length >= 2 && <Badge tone="green">
              {((bodyMetrics.at(-1)?.weight_kg ?? 0) - (bodyMetrics[0]?.weight_kg ?? 0)).toFixed(1)} kg
            </Badge>}
          />
          {bodyMetrics.length >= 2 ? (
            <ChartArea
              data={bodyMetrics}
              xKey="date"
              yKeys={[{ key: "weight_kg", label: "Weight", color: "#ff5e1a" }]}
              height={240}
              format="weight"
            />
          ) : (
            <EmptyState title="No body data" description="Log weigh-ins on the Gym page." />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Cash flow"
            title="Income vs Burn"
            action={
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-500" /> Income</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-edge" /> Burn</span>
              </div>
            }
          />
          {transactions.length > 0 ? (
            <ChartBars
              data={monthlyFlow}
              xKey="month"
              bars={[
                { key: "income", label: "Income", color: "#ff5e1a" },
                { key: "expenses", label: "Burn", color: "#3a3a44" },
              ]}
              height={240}
              format="currencyK"
            />
          ) : (
            <EmptyState title="No transactions" description="Log to start the chart." />
          )}
        </Card>
      </div>

      <Card>
        <CardHeader
          label="▢ Productivity · 7 months"
          title="Output volume"
          action={
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-500" /> Missions</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-700" /> Workouts</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-edge-strong" /> Journal</span>
            </div>
          }
        />
        {hasAnyData ? (
          <ChartBars
            data={productivity}
            xKey="month"
            bars={[
              { key: "missions",  label: "Missions",  color: "#ff5e1a" },
              { key: "workouts",  label: "Workouts",  color: "#bf3406" },
              { key: "journal",   label: "Journal",   color: "#3a3a44" },
            ]}
            height={260}
          />
        ) : (
          <EmptyState title="No output data yet" description="Log missions, workouts, or journal entries." />
        )}
      </Card>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader label="▢ Habit success · this week" title="Consistency map" />
          {habitSuccess.length > 0 ? (
            <div className="space-y-3">
              {habitSuccess.map((h) => (
                <div key={h.name}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm text-ink-primary">{h.name}</span>
                    <span className="font-mono text-[11px] text-ember-400 tabular-nums">{h.rate}%</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-surface-3 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-ember-600 to-ember-400 rounded-full shadow-ember-glow-sm"
                      style={{ width: `${h.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No habits tracked" description="Re-run onboarding to seed habits." />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label="▢ Discipline · 90 days"
            title="The whole picture"
            action={discipline.length > 0 && <Badge tone="ember">Avg · {summary.disciplineAvg}</Badge>}
          />
          {discipline.length > 0 ? (
            <StreakHeatmap data={discipline} />
          ) : (
            <EmptyState title="No discipline data" description="Builds itself as you log activity." />
          )}
        </Card>
      </div>
    </div>
  );
}

function computeMonthlyProductivity({ missions, workouts, journal }: {
  missions: any[]; workouts: any[]; journal: any[];
}) {
  const now = new Date();
  const buckets: any[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      missions: 0, workouts: 0, journal: 0,
    });
  }
  const inBucket = (date: string) => {
    const td = new Date(date);
    const diff = (now.getFullYear() - td.getFullYear()) * 12 + (now.getMonth() - td.getMonth());
    if (diff < 0 || diff >= 7) return null;
    return buckets[6 - diff];
  };
  missions.forEach((m: any) => { const b = inBucket(m.created_at ?? m.date ?? new Date().toISOString()); if (b) b.missions += 1; });
  workouts.forEach((w: any) => { const b = inBucket(w.date); if (b) b.workouts += 1; });
  journal.forEach((j: any) => { const b = inBucket(j.date); if (b) b.journal += 1; });
  return buckets;
}

function computeNetWorthSeries(
  savingsGoals: { saved: number }[],
  _txns: any[],
) {
  // Without history, return single-point snapshot
  const total = savingsGoals.reduce((s, g) => s + g.saved, 0);
  return [{ month: "Now", value: total }];
}
