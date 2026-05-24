"use client";

import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { applyFormat, type ValueFormat } from "./format";

type Props = {
  data: any[];
  xKey: string;
  yKeys: { key: string; label: string; color?: string }[];
  height?: number;
  format?: ValueFormat;
};

export function ChartArea({
  data, xKey, yKeys, height = 240, format = "number",
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
        <defs>
          {yKeys.map((y) => (
            <linearGradient key={y.key} id={`grad-${y.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={y.color ?? "#ff5e1a"} stopOpacity={0.4} />
              <stop offset="100%" stopColor={y.color ?? "#ff5e1a"} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
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
          cursor={{ stroke: "#3a3a44", strokeWidth: 1, strokeDasharray: "3 3" }}
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
        {yKeys.map((y) => (
          <Area
            key={y.key}
            type="monotone"
            dataKey={y.key}
            stroke={y.color ?? "#ff5e1a"}
            strokeWidth={1.8}
            fill={`url(#grad-${y.key})`}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
