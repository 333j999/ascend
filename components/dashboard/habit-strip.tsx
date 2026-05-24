import type { Habit } from "@/types";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["M","T","W","T","F","S","S"];

export function HabitStrip({ habits }: { habits: Habit[] }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
        <span>Habit</span>
        <div className="grid grid-cols-7 gap-1.5 w-[140px] text-center">
          {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <span className="w-10 text-right">Streak</span>
      </div>

      {habits.map((h) => (
        <div key={h.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-2">
          <span className="text-sm text-ink-primary truncate">{h.name}</span>

          <div className="grid grid-cols-7 gap-1.5 w-[140px]">
            {h.completions_this_week.map((done, i) => (
              <div
                key={i}
                className={cn(
                  "h-5 rounded-2xs transition-colors",
                  done
                    ? "bg-ember-500/90 shadow-ember-glow-sm"
                    : "bg-surface-3 border border-edge-subtle",
                )}
              />
            ))}
          </div>

          <span className="font-mono text-sm text-ember-400 w-10 text-right tabular-nums">
            {h.streak}d
          </span>
        </div>
      ))}
    </div>
  );
}
