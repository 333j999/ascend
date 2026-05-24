"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import type { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { HabitStrip } from "@/components/dashboard/habit-strip";
import { AddHabitModal } from "@/components/modals/add-habit";

export function HabitsManager({ habits }: { habits: Habit[] }) {
  const [open, setOpen] = useState(false);
  const good = habits.filter(h => h.kind === "good");
  const bad = habits.filter(h => h.kind === "bad");

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-1">
          <div className="label">▢ Habits · this week</div>
          <div className="font-display text-[15px] font-medium tracking-tight text-ink-primary">
            What you control daily
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="green"><Check className="size-3" /> {good.length} good</Badge>
          <Badge tone="red"><X className="size-3" /> {bad.length} bad</Badge>
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-3.5" /> Add habit
          </Button>
        </div>
      </div>

      {habits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Add habits you want to track — good ones to do, bad ones to avoid. Click any cell in the strip to log a day."
          action={
            <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-3.5" /> Add your first habit
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {good.length > 0 && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-signal-green mb-3">
                ↑ Good — to do
              </div>
              <HabitStrip habits={good} editable />
            </div>
          )}
          {bad.length > 0 && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-signal-red mb-3">
                ↓ Bad — to avoid
              </div>
              <HabitStrip habits={bad} editable />
            </div>
          )}
        </div>
      )}

      <AddHabitModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
