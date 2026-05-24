import { TrendingUp, Trophy, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/ui/stat";
import { Progress } from "@/components/ui/progress";
import { RadialScore } from "@/components/ui/radial-score";
import { ChartArea } from "@/components/charts/area-chart";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import { MOCK_DISCIPLINE, MOCK_ANALYTICS } from "@/lib/mock-data";
import { rangeLabel } from "@/lib/utils";

export default function DisciplinePage() {
  const a = MOCK_ANALYTICS;
  const week = MOCK_DISCIPLINE.slice(-7);
  const weekAvg = Math.round(week.reduce((s, d) => s + d.score, 0) / week.length);
  const month = MOCK_DISCIPLINE.slice(-30);
  const monthAvg = Math.round(month.reduce((s, d) => s + d.score, 0) / month.length);

  const components = [
    { name: "Habits completed", pct: 92, weight: 30 },
    { name: "Missions hit",     pct: 71, weight: 25 },
    { name: "Gym attendance",   pct: 86, weight: 15 },
    { name: "Sleep · 7h+",      pct: 88, weight: 15 },
    { name: "Finance logged",   pct: 95, weight: 10 },
    { name: "Journal entry",    pct: 100, weight: 5 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 06 · Discipline Score"
        title={<>The single number that <span className="italic font-light text-ember-300">tells the truth.</span></>}
        subtitle="Your discipline score is the daily, honest readout of who you are right now. Six inputs. One verdict. Defended daily."
      />

      {/* Hero radial + components */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-5 flex flex-col items-center justify-center p-8">
          <div className="label mb-2">▢ Today · {new Date().toLocaleDateString("en-US", { weekday: "long" })}</div>
          <RadialScore value={a.discipline_score} size={260} stroke={12} sublabel={rangeLabel(a.discipline_score)} />
          <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-signal-green">
            <TrendingUp className="size-3.5" /> +8.4% vs 30-day average
          </div>
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
              <div className="mt-1 stat text-2xl text-ink-primary">{weekAvg}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">30d Avg</div>
              <div className="mt-1 stat text-2xl text-ink-primary">{monthAvg}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">All-time Best</div>
              <div className="mt-1 stat text-2xl text-ember-300">98</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Streak summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Current streak"   value={a.current_streak.toString()} unit="days" delta={12.0} /></Card>
        <Card><Stat label="Longest streak"   value={a.longest_streak.toString()} unit="days" hint="all time" /></Card>
        <Card><Stat label="Elite days · 30d" value="14" unit="/30" delta={28.0} /></Card>
        <Card><Stat label="Below 60 · 30d"   value="3" unit="days" delta={-40.0} deltaLabel="lower is better" /></Card>
      </div>

      {/* Trend + heatmap */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label="▢ Discipline trend · 30 days"
            title="The slope of the man"
            action={<Badge tone="ember">Trending up</Badge>}
          />
          <ChartArea
            data={MOCK_DISCIPLINE.slice(-30)}
            xKey="date"
            yKeys={[{ key: "score", label: "Score", color: "#ff5e1a" }]}
            height={260}
            format="score"
          />
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ 90-day mosaic"
            title="The chain"
            action={<Badge tone="neutral">Avg · {monthAvg}</Badge>}
          />
          <StreakHeatmap data={MOCK_DISCIPLINE} />
        </Card>
      </div>

      {/* Weekly report */}
      <Card>
        <CardHeader
          label="▢ Weekly briefing · auto-generated"
          title="What this week meant"
          action={<Badge tone="ember"><Trophy className="size-3" /> Solid week</Badge>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <BriefingCard
            tone="green"
            title="Strengths"
            items={[
              "Reading streak unbroken — 23 days.",
              "Sleep average up to 8.2h.",
              "Income trending +14% vs last month.",
            ]}
          />
          <BriefingCard
            tone="amber"
            title="Watch"
            items={[
              "Cold plunge skipped 2 of last 4 days.",
              "Wednesday's score dropped to 64.",
              "Late dinners on social days.",
            ]}
          />
          <BriefingCard
            tone="ember"
            title="Mission for next week"
            items={[
              "Hit 5 cold outreaches before 10am, 5 days running.",
              "No food after 8pm — even on outings.",
              "Friday legs · attempt 170 kg squat single.",
            ]}
          />
        </div>
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
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-ink-primary leading-relaxed flex gap-2.5">
            <span className={`mt-1.5 size-1.5 rounded-full shrink-0 ${toneClass.split(" ")[1].replace("text", "bg")}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
