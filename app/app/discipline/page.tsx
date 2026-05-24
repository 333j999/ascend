import { redirect } from "next/navigation";
import { TrendingUp, Trophy, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/ui/stat";
import { Progress } from "@/components/ui/progress";
import { RadialScore } from "@/components/ui/radial-score";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartArea } from "@/components/charts/area-chart";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  getTransactions, getMissions, getHabits, getWorkouts,
  getBodyMetrics, getDisciplineDays, getJournalEntries,
} from "@/lib/supabase/queries";
import { computeDashboardSummary } from "@/lib/discipline";
import { rangeLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DisciplinePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [transactions, missions, habits, workouts, bodyMetrics, discipline, journal] = await Promise.all([
    getTransactions(user.id, 200),
    getMissions(user.id),
    getHabits(user.id),
    getWorkouts(user.id, 30),
    getBodyMetrics(user.id, 30),
    getDisciplineDays(user.id, 90),
    getJournalEntries(user.id, 5),
  ]);

  const summary = computeDashboardSummary({
    transactions, missions, habits, workouts, bodyMetrics, discipline,
  });

  const week = discipline.slice(-7);
  const weekAvg = week.length ? Math.round(week.reduce((s, d) => s + d.score, 0) / week.length) : 0;
  const month = discipline.slice(-30);
  const monthAvg = summary.disciplineAvg;
  const allTimeBest = discipline.length ? Math.max(...discipline.map(d => d.score)) : 0;
  const eliteDays = month.filter(d => d.score >= 90).length;
  const brokenDays = month.filter(d => d.score < 60).length;

  // Today's component breakdown — derived from real activity
  const gymToday = workouts.some(w => isToday(new Date(w.date)));
  const financeToday = transactions.some(t => isToday(new Date(t.date)));
  const journalToday = journal.some(j => isToday(new Date(j.date)));
  const sleepOk = (summary.sleepHours ?? 0) >= 7;

  const components = [
    { name: "Habits completed", pct: summary.habitsPct, weight: 30 },
    { name: "Missions hit",     pct: summary.missionsPct, weight: 25 },
    { name: "Gym attendance",   pct: gymToday ? 100 : 0, weight: 15 },
    { name: "Sleep · 7h+",      pct: sleepOk ? 100 : 0,  weight: 15 },
    { name: "Finance logged",   pct: financeToday ? 100 : 0, weight: 10 },
    { name: "Journal entry",    pct: journalToday ? 100 : 0, weight: 5 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 06 · Discipline Score"
        title={<>The single number that <span className="italic font-light text-ember-300">tells the truth.</span></>}
        subtitle="Your discipline score is the daily, honest readout of who you are right now. Six inputs. One verdict. Defended daily."
      />

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-5 flex flex-col items-center justify-center p-8">
          <div className="label mb-2">▢ Today · {new Date().toLocaleDateString("en-US", { weekday: "long" })}</div>
          <RadialScore value={summary.disciplineScore} size={260} stroke={12} sublabel={rangeLabel(summary.disciplineScore)} />
          {discipline.length > 0 && summary.disciplineScore - monthAvg !== 0 && (
            <div className={`mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${summary.disciplineScore >= monthAvg ? "text-signal-green" : "text-signal-red"}`}>
              <TrendingUp className="size-3.5" /> {summary.disciplineScore >= monthAvg ? "+" : ""}{summary.disciplineScore - monthAvg} vs 30-day average
            </div>
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label="▢ Score components · today"
            title="How the number is built"
            action={<Badge tone="ember"><ShieldCheck className="size-3" /> Weighted</Badge>}
          />
          <div className="space-y-4">
            {components.map((c) => (
              <div key={c.name}>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-primary">{c.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                      weight · {c.weight}%
                    </span>
                  </div>
                  <span className="stat text-sm text-ember-400 tabular-nums">{c.pct}%</span>
                </div>
                <Progress value={c.pct} />
              </div>
            ))}
          </div>
          <div className="divider-x my-6" />
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">7d Avg</div>
              <div className="mt-1 stat text-2xl text-ink-primary">{weekAvg || "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">30d Avg</div>
              <div className="mt-1 stat text-2xl text-ink-primary">{monthAvg || "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">All-time Best</div>
              <div className="mt-1 stat text-2xl text-ember-300">{allTimeBest || "—"}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Current streak"   value={summary.currentStreak.toString()} unit="days" /></Card>
        <Card><Stat label="Longest streak"   value={summary.longestStreak.toString()} unit="days" hint="all time" /></Card>
        <Card><Stat label="Elite days · 30d" value={String(eliteDays)} hint={month.length ? `of ${month.length}` : "no data"} /></Card>
        <Card><Stat label="Below 60 · 30d"   value={String(brokenDays)} hint="lower is better" /></Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label="▢ Discipline trend · 30 days"
            title="The slope of the man"
            action={discipline.length > 0 && <Badge tone="ember">Avg · {monthAvg}</Badge>}
          />
          {month.length > 1 ? (
            <ChartArea
              data={month}
              xKey="date"
              yKeys={[{ key: "score", label: "Score", color: "#ff5e1a" }]}
              height={260}
              format="score"
            />
          ) : (
            <EmptyState title="No trend yet" description="Log activity for a couple of days to see the slope." />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ 90-day mosaic"
            title="The chain"
            action={discipline.length > 0 && <Badge tone="neutral">Avg · {monthAvg}</Badge>}
          />
          {discipline.length > 0 ? (
            <StreakHeatmap data={discipline} />
          ) : (
            <EmptyState title="No chain yet" description="Tomorrow's square is up to you." />
          )}
        </Card>
      </div>

      <Card>
        <CardHeader
          label="▢ Weekly briefing · auto-generated"
          title="What this week meant"
          action={discipline.length > 0 && <Badge tone="ember"><Trophy className="size-3" /> {labelForWeek(weekAvg)}</Badge>}
        />
        {discipline.length === 0 ? (
          <EmptyState
            title="No briefing yet"
            description="The auto-briefing populates once you have a week of activity logged."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BriefingCard
              tone="green"
              title="Strengths"
              items={buildStrengths({ summary, gymToday, financeToday, journalToday, sleepOk })}
            />
            <BriefingCard
              tone="amber"
              title="Watch"
              items={buildWatch({ summary, gymToday, financeToday, journalToday, sleepOk, brokenDays })}
            />
            <BriefingCard
              tone="ember"
              title="Mission for next week"
              items={buildMissions({ summary })}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

function BriefingCard({
  tone, title, items,
}: { tone: "green" | "amber" | "ember"; title: string; items: string[] }) {
  const toneClass = {
    green: "border-signal-green/30 text-signal-green",
    amber: "border-signal-amber/30 text-signal-amber",
    ember: "border-ember-500/40 text-ember-300",
  }[tone];
  return (
    <div className={`p-5 rounded-xs border bg-surface-3/30 ${toneClass.split(" ")[0]}`}>
      <div className={`label ${toneClass.split(" ")[1]}`}>▢ {title}</div>
      {items.length === 0 ? (
        <div className="mt-3 text-sm text-ink-muted">Nothing notable yet.</div>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((it, i) => (
            <li key={i} className="text-sm text-ink-primary leading-relaxed flex gap-2.5">
              <span className={`mt-1.5 size-1.5 rounded-full shrink-0 ${toneClass.split(" ")[1].replace("text", "bg")}`} />
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function isToday(d: Date) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  return x.getTime() === t.getTime();
}

function labelForWeek(avg: number) {
  if (avg >= 85) return "Elite week";
  if (avg >= 70) return "Solid week";
  if (avg >= 50) return "Steady week";
  return "Recovery week";
}

function buildStrengths({ summary, gymToday, financeToday, journalToday, sleepOk }: any) {
  const out: string[] = [];
  if (summary.currentStreak >= 7) out.push(`${summary.currentStreak}-day streak active. Don't break it.`);
  if (summary.habitsPct >= 80) out.push(`Habits at ${summary.habitsPct}% today — high consistency.`);
  if (gymToday) out.push("Gym session logged today.");
  if (journalToday) out.push("Journaled today — five minutes well spent.");
  if (sleepOk) out.push(`Sleep on target at ${summary.sleepHours?.toFixed(1)}h.`);
  if (financeToday) out.push("Finance touched today — staying on top of it.");
  return out;
}

function buildWatch({ summary, gymToday, financeToday, journalToday, sleepOk, brokenDays }: any) {
  const out: string[] = [];
  if (summary.habitsPct < 50) out.push(`Habits at ${summary.habitsPct}%. Pick the one easiest to defend.`);
  if (!gymToday) out.push("No gym session today.");
  if (!sleepOk) out.push(`Sleep below 7h${summary.sleepHours ? ` (${summary.sleepHours.toFixed(1)}h)` : ""}.`);
  if (!financeToday) out.push("Finance not touched today.");
  if (!journalToday) out.push("No journal entry today.");
  if (brokenDays >= 5) out.push(`${brokenDays} days below 60 this month — pattern, not noise.`);
  return out;
}

function buildMissions({ summary }: any) {
  const out: string[] = [];
  if (summary.habitsPct < 100) out.push("Hit every habit checkbox tomorrow morning.");
  if (summary.missionsPct < 80) out.push("Set 3 missions tonight. Execute the first one before 10am.");
  out.push("Log every meal and movement on the most challenging day — the data will surprise you.");
  return out;
}
