"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Habit } from "@/types";
import { cn } from "@/lib/utils";
import { logHabit, deleteHabit } from "@/lib/supabase/actions";

const DAY_LABELS = ["M","T","W","T","F","S","S"];

export function HabitStrip({
  habits,
  editable = false,
}: {
  habits: Habit[];
  editable?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
        <span>Habit</span>
        <div className="grid grid-cols-7 gap-1.5 w-[140px] text-center">
          {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <span className={cn("text-right", editable ? "w-20" : "w-10")}>
          {editable ? "" : "Streak"}
        </span>
      </div>

      {habits.map((h) => (
        <HabitRow key={h.id} habit={h} editable={editable} />
      ))}
    </div>
  );
}

function HabitRow({ habit, editable }: { habit: Habit; editable: boolean }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [optimistic, setOptimistic] = useState(habit.completions_this_week);
  const [confirmDel, setConfirmDel] = useState(false);

  // Compute monday-anchored dates so clicks know which row to toggle
  const monday = mondayOfThisWeek();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  function toggle(dayIdx: number) {
    const d = new Date(monday); d.setDate(monday.getDate() + dayIdx);
    if (d > today) return; // can't log future
    const iso = d.toISOString().slice(0, 10);

    const next = !optimistic[dayIdx];
    setOptimistic((arr) => arr.map((v, i) => (i === dayIdx ? next : v)));
    start(async () => {
      try {
        await logHabit(habit.id, iso, next);
        router.refresh();
      } catch {
        // revert
        setOptimistic((arr) => arr.map((v, i) => (i === dayIdx ? !next : v)));
      }
    });
  }

  function onDelete() {
    if (!confirmDel) { setConfirmDel(true); return; }
    start(async () => {
      await deleteHabit(habit.id);
      router.refresh();
    });
  }

  const isBad = habit.kind === "bad";

  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-2 group">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "shrink-0 size-1.5 rounded-full",
            isBad ? "bg-signal-red" : "bg-signal-green",
          )}
          title={isBad ? "Bad habit — to avoid" : "Good habit"}
        />
        <span className="text-sm text-ink-primary truncate">{habit.name}</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 w-[140px]">
        {optimistic.map((done, i) => {
          const d = new Date(monday); d.setDate(monday.getDate() + i);
          const isFuture = d > today;
          const dotClass = done
            ? isBad
              ? "bg-signal-red/90 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
              : "bg-ember-500/90 shadow-ember-glow-sm"
            : "bg-surface-3 border border-edge-subtle hover:border-edge";

          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              disabled={isFuture}
              className={cn(
                "h-5 rounded-2xs transition-colors",
                dotClass,
                isFuture && "opacity-30 cursor-not-allowed",
              )}
              aria-label={`${habit.name} · day ${i + 1}`}
              title={d.toDateString()}
            />
          );
        })}
      </div>

      {editable ? (
        <button
          onClick={onDelete}
          className={cn(
            "size-7 grid place-items-center rounded-2xs transition-all opacity-0 group-hover:opacity-100",
            confirmDel
              ? "opacity-100 bg-signal-red/15 text-signal-red border border-signal-red/30"
              : "text-ink-muted hover:text-signal-red",
          )}
          aria-label="Delete habit"
          title={confirmDel ? "Click again to confirm" : "Delete habit"}
        >
          <Trash2 className="size-3" />
        </button>
      ) : (
        <span className="font-mono text-sm text-ember-400 w-10 text-right tabular-nums">
          {habit.streak}d
        </span>
      )}
    </div>
  );
}

function mondayOfThisWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
