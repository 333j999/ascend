import * as React from "react";
import { cn, clamp } from "@/lib/utils";

type ProgressProps = {
  value: number;            // 0-100
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  glow?: boolean;
  height?: "xs" | "sm" | "md";
};

const heightMap = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
};

export function Progress({
  value, className, trackClassName, barClassName, glow, height = "sm",
}: ProgressProps) {
  const v = clamp(value, 0, 100);
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-surface-3",
        heightMap[height],
        trackClassName,
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-400 transition-[width] duration-700 ease-spring",
          glow && "shadow-ember-glow-sm",
          barClassName,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function SegmentedProgress({
  total, completed, className,
}: { total: number; completed: number; className?: string }) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors duration-300",
            i < completed ? "bg-ember-500 shadow-ember-glow-sm" : "bg-surface-3",
          )}
        />
      ))}
    </div>
  );
}
