"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { applyFormat, type ValueFormat } from "./format";

const RAMP = ["#ff5e1a", "#e74508", "#bf3406", "#982a08", "#7a240a", "#3a3a44"];

export function ChartDonut({
  data, height = 220, format = "currency",
}: {
  data: { category: string; value: number }[];
  height?: number;
  format?: ValueFormat;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="relative w-full" style={{ height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
            isAnimationActive
            animationDuration={900}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={RAMP[i % RAMP.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#131316",
              border: "1px solid #2a2a31",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "var(--font-jetbrains-mono)",
              color: "#f5f5f4",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#a3a3a8", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}
            formatter={(v: any, _n: any, p: any) => [applyFormat(Number(v), format), p.payload.category]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
        <div>
          <div className="label">Total · Burn</div>
          <div className="mt-1 stat text-2xl text-ink-primary tracking-tightest">
            {applyFormat(total, format)}
          </div>
        </div>
      </div>
    </div>
  );
}
