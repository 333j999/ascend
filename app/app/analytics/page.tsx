import { TrendingUp, Calendar } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { ChartArea } from "@/components/charts/area-chart";
import { ChartBars } from "@/components/charts/bar-chart";
import { StreakHeatmap } from "@/components/charts/streak-heatmap";
import {
  MOCK_NET_WORTH_SERIES, MOCK_BODY_METRICS, MOCK_DISCIPLINE,
  MOCK_MONTHLY_FLOW, MOCK_HABITS,
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  const productivity = [
    { month: "Nov", missions: 142, workouts: 12, journal: 22 },
    { month: "Dec", missions: 168, workouts: 14, journal: 26 },
    { month: "Jan", missions: 184, workouts: 16, journal: 28 },
    { month: "Feb", missions: 162, workouts: 15, journal: 25 },
    { month: "Mar", missions: 195, workouts: 18, journal: 30 },
    { month: "Apr", missions: 210, workouts: 19, journal: 30 },
    { month: "May", missions: 224, workouts: 18, journal: 24 },
  ];

  const habitSuccess = MOCK_HABITS.map(h => ({
    name: h.name,
    rate: Math.round((h.completions_this_week.filter(Boolean).length / 7) * 100),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 07 · Life Analytics"
        title={<>Convert chaos into <span className="italic font-light text-ember-300">signal.</span></>}
        subtitle="Every dollar, rep, mood, and rep — folded into clean, comparable lines. Read the weather. Adjust the sails."
        action={
          <div className="flex items-center gap-2">
            <button className="btn-ghost h-9 px-3">
              <Calendar className="size-3.5" /> Last 12 mo
            </button>
          </div>
        }
      />

      {/* Top KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Net worth growth · YoY" value="+54" unit="%" delta={11.2} /></Card>
        <Card><Stat label="Avg. discipline · 90d" value="78" unit="/100" delta={9.4} /></Card>
        <Card><Stat label="Workouts · YTD" value="84" delta={32.0} /></Card>
        <Card><Stat label="Habits success · 30d" value="84" unit="%" delta={6.2} /></Card>
      </div>

      {/* Wealth trajectory */}
      <Card>
        <CardHeader
          label="▢ Wealth · 7 months"
          title="The compound curve"
          action={
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              <Badge tone="ember"><TrendingUp className="size-3" /> +$50.4k</Badge>
            </div>
          }
        />
        <ChartArea
          data={MOCK_NET_WORTH_SERIES}
          xKey="month"
          yKeys={[{ key: "value", label: "Net worth", color: "#ff5e1a" }]}
          height={300}
          format="currencyK"
        />
      </Card>

      {/* Two-up: Body + Cash flow */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Body composition · 5 months"
            title="Physical signal"
            action={<Badge tone="green">-3.6 kg</Badge>}
          />
          <ChartArea
            data={MOCK_BODY_METRICS}
            xKey="date"
            yKeys={[{ key: "weight_kg", label: "Weight", color: "#ff5e1a" }]}
            height={240}
            format="weight"
          />
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Cash flow · 7 months"
            title="Income vs Burn"
            action={
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-500" /> Income</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-edge" /> Burn</span>
              </div>
            }
          />
          <ChartBars
            data={MOCK_MONTHLY_FLOW}
            xKey="month"
            bars={[
              { key: "income", label: "Income", color: "#ff5e1a" },
              { key: "expenses", label: "Burn", color: "#3a3a44" },
            ]}
            height={240}
            format="currencyK"
          />
        </Card>
      </div>

      {/* Productivity trend */}
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
      </Card>

      {/* Habit success rate + Discipline mosaic */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ Habit success · this week"
            title="Consistency map"
          />
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
        </Card>

        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label="▢ Discipline · 90 days"
            title="The whole picture"
            action={<Badge tone="ember">Avg · 78</Badge>}
          />
          <StreakHeatmap data={MOCK_DISCIPLINE} />
        </Card>
      </div>
    </div>
  );
}
