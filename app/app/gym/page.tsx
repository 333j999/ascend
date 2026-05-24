import { Plus, Dumbbell, Trophy, Moon, Camera, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { ChartArea } from "@/components/charts/area-chart";
import {
  MOCK_WORKOUTS, MOCK_PRS, MOCK_BODY_METRICS,
} from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

export default function GymPage() {
  const latest = MOCK_WORKOUTS[0];

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 04 · Gym / Physique"
        title={<>The body is the <span className="italic font-light text-ember-300">first asset.</span></>}
        subtitle="Lifts logged. PRs recorded. Bodyweight tracked. The graph of you becoming a different shape, over time."
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Camera className="size-3.5" /> Photo Log
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="size-3.5" /> Log Workout
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Workouts · MTD" value="18" delta={38.5} deltaLabel="vs Apr" /></Card>
        <Card><Stat label="Bodyweight" value="87.6" unit="kg" delta={-2.0} deltaLabel="since Jan" /></Card>
        <Card><Stat label="Body fat" value="12.8" unit="%" delta={-21.0} deltaLabel="since Jan" /></Card>
        <Card><Stat label="Sleep · 7d avg" value="8.2" unit="h" delta={6.5} deltaLabel="trending" /></Card>
      </div>

      {/* Latest workout + PRs */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label={`▢ Latest · ${formatDate(latest.date)}`}
            title={latest.name}
            action={<Badge tone="green"><Trophy className="size-3" /> New PR</Badge>}
          />
          <div className="grid grid-cols-3 gap-3 mb-5">
            <MiniKpi label="Duration"   value={`${latest.duration_min}min`} />
            <MiniKpi label="Exercises"  value={`${latest.exercises.length}`} />
            <MiniKpi label="Total sets" value={`${latest.exercises.reduce((s, e) => s + e.sets.length, 0)}`} />
          </div>

          <div className="space-y-1">
            {latest.exercises.map((ex) => (
              <div key={ex.name} className="rounded-xs border border-edge-subtle bg-surface-3/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-ink-primary font-medium">{ex.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    {ex.sets.length} sets
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {ex.sets.map((s, i) => (
                    <div key={i} className="bg-surface-2 border border-edge-subtle rounded-xs p-2.5 text-center">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Set {i+1}</div>
                      <div className="mt-1 stat text-sm text-ink-primary tabular-nums">{s.weight_kg}<span className="text-ink-muted text-xs ml-0.5">kg</span></div>
                      <div className="font-mono text-[10px] text-ember-400">{s.reps} reps</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ Personal records"
            title="The numbers that matter"
            action={<Badge tone="ember"><Trophy className="size-3" /> 5 lifetime</Badge>}
          />
          <div className="space-y-2">
            {MOCK_PRS.map((pr, i) => (
              <div key={pr.exercise} className="flex items-center justify-between p-3.5 rounded-xs border border-edge-subtle bg-surface-3/30">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xl text-ember-400/60 tabular-nums w-6">{String(i+1).padStart(2,'0')}</span>
                  <div>
                    <div className="text-ink-primary text-sm font-medium">{pr.exercise}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{pr.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="stat text-xl text-ink-primary tabular-nums">{pr.weight_kg}<span className="font-mono text-xs text-ink-muted ml-0.5">kg</span></div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ember-400">{pr.reps} rep{pr.reps > 1 ? "s" : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Body composition charts */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader
            label="▢ Bodyweight · 5 months"
            title="The slow burn"
            action={
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                <span className="inline-flex items-center gap-1.5 text-signal-green">
                  <TrendingUp className="size-3" /> -3.6 kg
                </span>
                <span>Target · 88 kg</span>
              </div>
            }
          />
          <ChartArea
            data={MOCK_BODY_METRICS}
            xKey="date"
            yKeys={[{ key: "weight_kg", label: "Weight", color: "#ff5e1a" }]}
            height={240}
            format="weight"
          />
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader
            label="▢ Sleep · 6 months"
            title="Recovery hours"
            action={<Badge tone="ember"><Moon className="size-3" /> Avg 7.9h</Badge>}
          />
          <ChartArea
            data={MOCK_BODY_METRICS}
            xKey="date"
            yKeys={[{ key: "sleep_hours", label: "Sleep", color: "#ff5e1a" }]}
            height={240}
            format="hours"
          />
        </Card>
      </div>

      {/* Recent sessions table */}
      <Card>
        <CardHeader
          label="▢ Training log"
          title="Recent sessions"
          action={<Button variant="ghost" size="sm">View all</Button>}
        />
        <div className="space-y-2">
          {MOCK_WORKOUTS.map((w, i) => (
            <div
              key={w.id}
              className={cn(
                "grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center p-4 rounded-xs",
                "border border-edge-subtle bg-surface-3/30 hover:border-edge hover:bg-surface-3 transition-colors",
              )}
            >
              <div className="size-10 rounded-xs bg-surface-2 border border-edge-subtle grid place-items-center">
                <Dumbbell className="size-4 text-ember-400" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-ink-primary font-medium">{w.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  {formatDate(w.date, "long")} · {w.exercises.map(e => e.name).join(" · ")}
                </div>
              </div>
              <div className="text-right">
                <div className="stat text-sm text-ink-primary">{w.duration_min}min</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">duration</div>
              </div>
              <div className="text-right">
                <div className="stat text-sm text-ember-400">{w.exercises.reduce((s, e) => s + e.sets.length, 0)}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">sets</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
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
