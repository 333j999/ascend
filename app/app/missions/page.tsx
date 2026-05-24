import { redirect } from "next/navigation";
import { Flame, Target as TargetIcon } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress, SegmentedProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { MissionChecklist } from "@/components/dashboard/mission-checklist";
import { HabitStrip } from "@/components/dashboard/habit-strip";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import { MissionActions } from "@/components/missions/mission-actions";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getMissions, getHabits, getDisciplineDays } from "@/lib/supabase/queries";
import { computeDashboardSummary } from "@/lib/discipline";
import { toLocalISODate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MissionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [missions, habits, discipline] = await Promise.all([
    getMissions(user.id),
    getHabits(user.id),
    getDisciplineDays(user.id, 90),
  ]);

  const completedToday = missions.filter(m => m.completed).length;
  const completionPct = missions.length ? Math.round((completedToday / missions.length) * 100) : 0;
  const today = new Date();
  const week = computeWeekTempo(discipline);
  const summary = computeDashboardSummary({
    transactions: [], missions, habits, workouts: [], bodyMetrics: [], discipline,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 03 · Daily Mission System"
        title={<>Execute the <span className="italic font-light text-ember-300">plan.</span></>}
        subtitle="The man who controls his calendar controls his life. Plan the day. Mark the boxes. Compound."
        action={<MissionActions />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="label">Today · {today.toLocaleDateString("en-US", { weekday: "long" })}</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="stat text-3xl text-ink-primary tracking-tightest">{completedToday}</span>
            <span className="font-mono text-sm text-ink-muted">/ {missions.length || 0}</span>
          </div>
          {missions.length > 0 && <Progress value={completionPct} className="mt-3" glow />}
        </Card>
        <Card>
          <div className="label">Streak · Active</div>
          <div className="mt-3 flex items-baseline gap-2">
            <Flame className="size-5 text-ember-400" strokeWidth={1.6} />
            <span className="stat text-3xl text-ember-300 tracking-tightest">{summary.currentStreak}</span>
            <span className="font-mono text-sm text-ink-muted">days</span>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            Best · {summary.longestStreak} days
          </div>
        </Card>
        <Card>
          <div className="label">This Week</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="stat text-3xl text-ink-primary tracking-tightest">{week.completed}</span>
            <span className="font-mono text-sm text-ink-muted">days hit</span>
          </div>
          <SegmentedProgress total={7} completed={week.completed} className="mt-3" />
        </Card>
        <Card>
          <div className="label">Avg · Daily Completion</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="stat text-3xl text-ink-primary tracking-tightest">{week.avgPct}</span>
            <span className="font-mono text-sm text-ink-muted">%</span>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">7-day average</div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <MissionChecklist initial={missions} />
        </Card>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card>
            <CardHeader
              label="▢ Week · at a glance"
              title="Mission tempo"
              action={discipline.length > 0 && <Badge tone="ember">7d avg · {week.avgPct}%</Badge>}
            />
            {discipline.length === 0 ? (
              <EmptyState title="No history yet" description="Complete a day to start the chart." />
            ) : (
              <div className="space-y-2.5">
                {week.days.map((d, i) => (
                  <div key={i} className="grid grid-cols-[40px_1fr_auto] gap-3 items-center">
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${d.today ? "text-ember-400" : d.future ? "text-ink-dim" : "text-ink-muted"}`}>
                      {d.day}{d.today ? " ●" : ""}
                    </span>
                    <Progress value={d.pct} className={d.future ? "opacity-30" : ""} />
                    <span className="font-mono text-[11px] tabular-nums text-ink-secondary w-12 text-right">{d.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader label="▢ Habits · this week" title="Don't break the chain" />
            {habits.length > 0 ? (
              <HabitStrip habits={habits.slice(0, 4)} />
            ) : (
              <EmptyState
                title="No habits configured"
                action={<Button variant="ghost" size="sm" href="/onboarding">Re-run onboarding</Button>}
              />
            )}
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          label="▢ Mission completion · 90 days"
          title="The chain"
          action={discipline.length > 0 && <span className="font-mono text-[11px] text-ember-400">Avg · {summary.disciplineAvg}</span>}
        />
        {discipline.length > 0 ? (
          <StreakHeatmap data={discipline} />
        ) : (
          <EmptyState
            icon={<TargetIcon className="size-5" />}
            title="No history yet"
            description="The heatmap grows as you log days. Complete today's missions to put the first square down."
          />
        )}
      </Card>
    </div>
  );
}

function computeWeekTempo(discipline: { date: string; missions_pct: number; }[]) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  const dow = (today.getDay() + 6) % 7;
  monday.setDate(today.getDate() - dow);
  const days: { day: string; pct: number; today?: boolean; future?: boolean }[] = [];
  const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  let completed = 0;
  let pctSum = 0;
  let pctCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = toLocalISODate(d);
    const row = discipline.find(x => x.date === iso);
    const isFuture = d > today;
    const isToday = d.getTime() === today.getTime();
    const pct = row?.missions_pct ?? 0;
    if (pct >= 80 && !isFuture) completed += 1;
    if (!isFuture && row) { pctSum += pct; pctCount += 1; }
    days.push({ day: labels[i], pct, today: isToday, future: isFuture });
  }
  const avgPct = pctCount ? Math.round(pctSum / pctCount) : 0;
  return { days, completed, avgPct };
}
