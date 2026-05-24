"use client";

import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { applyFormat, type ValueFormat } from "./format";

type BarKey = { key: string; label: string; color?: string };

export function ChartBars({
  data, xKey, bars, height = 240, format = "number",
}: {
  data: any[];
  xKey: string;
  bars: BarKey[];
  height?: number;
  format?: ValueFormat;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid stroke="#1f1f24" strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#6b6b73", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)", letterSpacing: 1.2 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={50}
          tick={{ fill: "#6b6b73", fontSize: 10, fontFamily: "var(--font-jetbrains-mono)" }}
          tickFormatter={(v) => applyFormat(v, format)}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
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
          formatter={(v: any) => applyFormat(Number(v), format)}
        />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} fill={b.color ?? "#ff5e1a"} radius={[2, 2, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
