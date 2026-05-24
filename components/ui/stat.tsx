import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StatProps = {
  label: string;
  value: React.ReactNode;
  unit?: string;
  delta?: number;          // e.g. +12.4 → green up arrow, -3 → red down
  deltaLabel?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  className?: string;
};

const valueSize = {
  sm: "text-[22px]",
  md: "text-[28px]",
  lg: "text-[40px] leading-none",
};

export function Stat({
  label, value, unit, delta, deltaLabel,
  hint, size = "md", align = "left", className,
}: StatProps) {
  const positive = delta !== undefined && delta >= 0;
  return (
    <div className={cn(align === "right" ? "text-right" : "", className)}>
      <div className="label">{label}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={cn("stat tracking-tighter text-ink-primary", valueSize[size])}>
          {value}
        </span>
        {unit ? (
          <span className="font-mono text-xs text-ink-muted">{unit}</span>
        ) : null}
      </div>
      {delta !== undefined || hint ? (
        <div className="mt-2 flex items-center gap-2">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums",
                positive ? "text-signal-green" : "text-signal-red",
              )}
            >
              {positive ? (
                <ArrowUpRight className="size-3" strokeWidth={2.2} />
              ) : (
                <ArrowDownRight className="size-3" strokeWidth={2.2} />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {(deltaLabel || hint) && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {deltaLabel ?? hint}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
