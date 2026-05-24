import { cn } from "@/lib/utils";
import type { JournalEntry, Mood } from "@/types";

const MOOD_SCORE: Record<Mood, number> = {
  elite: 5, focused: 4, neutral: 3, low: 2, broken: 1,
};
const MOOD_DOT: Record<Mood, string> = {
  elite: "bg-ember-300",
  focused: "bg-ember-500",
  neutral: "bg-edge-strong",
  low: "bg-signal-amber",
  broken: "bg-signal-red",
};

export function MoodChart({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <>
      <div
        className="mt-4 grid gap-1 h-32"
        style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` }}
      >
        {entries.map((e, i) => {
          const v = MOOD_SCORE[e.mood] ?? 3;
          const h = (v / 5) * 100;
          return (
            <div key={i} className="flex flex-col justify-end" title={`${e.date} · ${e.mood}`}>
              <div
                className={cn("rounded-2xs", MOOD_DOT[e.mood])}
                style={{ height: `${h}%`, opacity: 0.85 }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-muted">
        <span>Earlier</span>
        <span>Now</span>
      </div>
    </>
  );
}
