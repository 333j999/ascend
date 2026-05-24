"use client";

import { cn } from "@/lib/utils";

type Props = {
  data: { date: string; score: number }[];
  className?: string;
};

/**
 * GitHub-style daily heatmap. Each cell intensity = score / 100.
 * Renders most recent N days. Hover shows tooltip via title attr.
 */
export function StreakHeatmap({ data, className }: Props) {
  // ensure exactly the right number of cells; pad with zeros if short
  const cells = data.slice(-91); // 13 weeks
  // pad start so first column is Monday
  const start = new Date(cells[0]?.date ?? new Date());
  const firstDay = (start.getDay() + 6) % 7; // 0 = Monday
  const padStart = Array.from({ length: firstDay }).map(() => null);
  const grid = [...padStart, ...cells];

  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-flow-col grid-rows-7 gap-1 auto-cols-min">
        {grid.map((cell, i) => {
          if (!cell) return <div key={i} className="size-2.5" />;
          const intensity = Math.max(0.08, cell.score / 100);
          return (
            <div
              key={i}
              title={`${cell.date} · ${cell.score}`}
              className="size-2.5 rounded-2xs transition-transform duration-100 hover:scale-125 cursor-help"
              style={{
                backgroundColor: `rgba(255, 94, 26, ${intensity})`,
                boxShadow: intensity > 0.7 ? "0 0 4px rgba(255,94,26,0.4)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
        Less
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((o) => (
          <div key={o} className="size-2.5 rounded-2xs" style={{ backgroundColor: `rgba(255,94,26,${o})` }} />
        ))}
        More
      </div>
    </div>
  );
}
