import { Plus, Calendar, Flame, ArrowRight, Target as TargetIcon } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress, SegmentedProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MissionChecklist } from "@/components/dashboard/mission-checklist";
import { HabitStrip } from "@/components/dashboard/habit-strip";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import { MOCK_MISSIONS, MOCK_HABITS, MOCK_DISCIPLINE } from "@/lib/mock-data";

export default function MissionsPage() {
  const completedToday = MOCK_MISSIONS.filter(m => m.completed).length;
  const completionPct = Math.round((completedToday / MOCK_MISSIONS.length) * 100);
  const today = new Date();

  // weekly schedule mock — 7 days
  const weekStatus = [
    { day: "Mon", missions: 8, completed: 8 },
    { day: "Tue", missions: 7, completed: 7 },
    { day: "Wed", missions: 6, completed: 5 },
    { day: "Thu", missions: 8, completed: 7 },
    { day: "Fri", missions: 7, completed: completedToday, today: true },
    { day: "Sat", missions: 5, completed: 0, future: true },
    { day: "Sun", missions: 4, completed: 0, future: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 03 · Daily Mission System"
        title={<>Execute the <span className="italic font-light text-ember-300">plan.</span></>}
        subtitle="The man who controls his calendar controls his life. Plan the day. Mark the boxes. Compound."
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Calendar className="size-3.5" /> Week View
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="size-3.5" /> Add Mission
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="label">Today · {today.toLocaleDateString("en-US", { weekday: "long" })}</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="stat text-3xl text-ink-primary tracking-tightest">{completedToday}</span>
            <span className="font-mono text-sm text-ink-muted">/ {MOCK_MISSIONS.length}</span>
          </div>
          <Progress value={completionPct} className="mt-3" glow />
        </Card>
        <Card>
          <div className="label">Streak · Active</div>
          <div className="mt-3 flex items-baseline gap-2">
            <Flame className="size-5 text-ember-400" strokeWidth={1.6} />
            <span className="stat text-3xl text-ember-300 tracking-tightest">47</span>
            <span className="font-mono text-sm text-ink-muted">days</span>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            Best · 92 days
          </div>
        </Card>
        <Card>
          <div className="label">This Week</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="stat text-3xl text-ink-primary tracking-tightest">28</span>
            <span className="font-mono text-sm text-ink-muted">/ 35</span>
          </div>
          <SegmentedProgress total={7} completed={5} className="mt-3" />
        </Card>
        <Card>
          <div className="label">Avg · Daily Completion</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="stat text-3xl text-ink-primary tracking-tightest">84</span>
            <span className="font-mono text-sm text-ink-muted">%</span>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-signal-green">
            +6% vs last week
          </div>
        </Card>
      </div>

      {/* Today + Week */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <MissionChecklist initial={MOCK_MISSIONS} />
        </Card>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card>
            <CardHeader
              label="▢ Week · at a glance"
              title="Mission tempo"
              action={<Badge tone="ember">28 / 35</Badge>}
            />
            <div className="space-y-2.5">
              {weekStatus.map((d, i) => {
                const pct = d.missions > 0 ? (d.completed / d.missions) * 100 : 0;
                const isFuture = d.future;
                return (
                  <div key={i} className="grid grid-cols-[40px_1fr_auto] gap-3 items-center">
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${d.today ? "text-ember-400" : isFuture ? "text-ink-dim" : "text-ink-muted"}`}>
                      {d.day}{d.today ? " ●" : ""}
                    </span>
                    <Progress value={pct} className={isFuture ? "opacity-30" : ""} />
                    <span className="font-mono text-[11px] tabular-nums text-ink-secondary w-10 text-right">
                      {d.completed}/{d.missions}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader
              label="▢ Habits · this week"
              title="Don't break the chain"
            />
            <HabitStrip habits={MOCK_HABITS.slice(0, 4)} />
          </Card>
        </div>
      </div>

      {/* Discipline heatmap + Calendar preview */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader
            label="▢ Mission completion · 90 days"
            title="The chain"
            action={<span className="font-mono text-[11px] text-ember-400">Avg · 78%</span>}
          />
          <StreakHeatmap data={MOCK_DISCIPLINE} />
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader
            label="▢ Mission templates"
            title="Daily protocols"
            action={<Button variant="ghost" size="sm"><Plus className="size-3.5" /></Button>}
          />
          <div className="space-y-2">
            {[
              { name: "Founder · Build Day",   missions: 9, color: "ember" },
              { name: "Trader · Market Open",  missions: 6, color: "neutral" },
              { name: "Lift · Recovery Day",   missions: 5, color: "neutral" },
              { name: "Reset · Sunday",        missions: 4, color: "neutral" },
            ].map((t) => (
              <button
                key={t.name}
                className="w-full flex items-center justify-between p-3 rounded-xs border border-edge-subtle bg-surface-3/40 hover:border-edge hover:bg-surface-3 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-xs bg-surface-2 border border-edge-subtle grid place-items-center">
                    <TargetIcon className="size-3.5 text-ink-secondary group-hover:text-ember-400 transition-colors" strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="text-sm text-ink-primary">{t.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{t.missions} missions</div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-ink-muted group-hover:text-ember-400 transition-colors" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
