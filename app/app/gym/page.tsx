import { redirect } from "next/navigation";
import { Dumbbell, Trophy, Moon, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartArea } from "@/components/charts/area-chart";
import { GymActions } from "@/components/gym/gym-actions";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getWorkouts, getBodyMetrics } from "@/lib/supabase/queries";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GymPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [workouts, bodyMetrics] = await Promise.all([
    getWorkouts(user.id, 30),
    getBodyMetrics(user.id, 180),
  ]);

  const latest = workouts[0];

  // Compute month-to-date workout count
  const now = new Date();
  const workoutsMTD = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Compute PRs — heaviest single set per exercise
  const prs = computePRs(workouts);

  const latestBody = bodyMetrics.at(-1);
  const firstBody = bodyMetrics[0];
  const bodyDelta = latestBody && firstBody ? (latestBody.weight_kg - firstBody.weight_kg).toFixed(1) : null;

  const avgSleep = computeAvgSleep(bodyMetrics);

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 04 · Gym / Physique"
        title={<>The body is the <span className="italic font-light text-ember-300">first asset.</span></>}
        subtitle="Lifts logged. PRs recorded. Bodyweight tracked. The graph of you becoming a different shape, over time."
        action={<GymActions />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Workouts · MTD" value={String(workoutsMTD)} hint={workouts.length === 0 ? "log first" : ""} /></Card>
        <Card><Stat label="Bodyweight" value={latestBody?.weight_kg ? `${latestBody.weight_kg}` : "—"} unit={latestBody?.weight_kg ? "kg" : ""} hint={bodyDelta ? `Δ ${bodyDelta}kg total` : "log to begin"} /></Card>
        <Card><Stat label="Body fat" value={latestBody?.body_fat_pct ? `${latestBody.body_fat_pct}` : "—"} unit={latestBody?.body_fat_pct ? "%" : ""} /></Card>
        <Card><Stat label="Sleep · 7d avg" value={avgSleep ? avgSleep.toFixed(1) : "—"} unit={avgSleep ? "h" : ""} /></Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label={latest ? `▢ Latest · ${formatDate(latest.date)}` : "▢ Latest"}
            title={latest ? latest.name : "No workouts logged"}
          />
          {latest ? (
            <>
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
            </>
          ) : (
            <EmptyState
              icon={<Dumbbell className="size-5" />}
              title="No sessions yet"
              description="Log your first workout. Every set is a deposit."
              action={<GymActions />}
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ Personal records"
            title="The numbers that matter"
            action={prs.length > 0 && <Badge tone="ember"><Trophy className="size-3" /> {prs.length} lifetime</Badge>}
          />
          {prs.length > 0 ? (
            <div className="space-y-2">
              {prs.map((pr, i) => (
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
          ) : (
            <EmptyState title="No PRs yet" description="They appear automatically as you log heavier lifts." />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader
            label="▢ Bodyweight"
            title="The slow burn"
            action={
              bodyDelta && (
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  <span className="inline-flex items-center gap-1.5 text-signal-green">
                    <TrendingUp className="size-3" /> {bodyDelta} kg
                  </span>
                </div>
              )
            }
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
            <EmptyState title="Need 2+ weigh-ins" description="Log a couple weigh-ins to see your trajectory." />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader
            label="▢ Sleep"
            title="Recovery hours"
            action={avgSleep && <Badge tone="ember"><Moon className="size-3" /> Avg {avgSleep.toFixed(1)}h</Badge>}
          />
          {bodyMetrics.filter(b => b.sleep_hours).length >= 2 ? (
            <ChartArea
              data={bodyMetrics}
              xKey="date"
              yKeys={[{ key: "sleep_hours", label: "Sleep", color: "#ff5e1a" }]}
              height={240}
              format="hours"
            />
          ) : (
            <EmptyState title="No sleep data" description="Log it with your weigh-ins." />
          )}
        </Card>
      </div>

      <Card>
        <CardHeader label="▢ Training log" title="Recent sessions" />
        {workouts.length > 0 ? (
          <div className="space-y-2">
            {workouts.map((w) => (
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
        ) : (
          <EmptyState
            title="No training log yet"
            description="Sessions you log show up here."
            action={<GymActions />}
          />
        )}
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

function computePRs(workouts: { date: string; exercises: { name: string; sets: { reps: number; weight_kg: number }[] }[] }[]) {
  const map = new Map<string, { exercise: string; weight_kg: number; reps: number; date: string }>();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      for (const s of ex.sets) {
        const existing = map.get(ex.name);
        if (!existing || s.weight_kg > existing.weight_kg) {
          map.set(ex.name, { exercise: ex.name, weight_kg: s.weight_kg, reps: s.reps, date: w.date });
        }
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.weight_kg - a.weight_kg).slice(0, 5);
}

function computeAvgSleep(metrics: { sleep_hours?: number }[]) {
  const recent = metrics.slice(-7).filter(m => m.sleep_hours);
  if (recent.length === 0) return null;
  return recent.reduce((s, m) => s + (m.sleep_hours ?? 0), 0) / recent.length;
}
