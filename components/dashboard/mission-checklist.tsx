"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Target } from "lucide-react";
import type { Mission } from "@/types";
import { cn } from "@/lib/utils";
import { toggleMission } from "@/lib/supabase/actions";
import { AddMissionModal } from "@/components/modals/add-mission";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

const PRIORITY_TONE: Record<Mission["priority"], string> = {
  critical: "text-signal-red",
  high:     "text-ember-400",
  medium:   "text-ink-secondary",
  low:      "text-ink-muted",
};
const PRIORITY_LABEL: Record<Mission["priority"], string> = {
  critical: "CRIT", high: "HIGH", medium: "MED", low: "LOW",
};

export function MissionChecklist({ initial }: { initial: Mission[] }) {
  const router = useRouter();
  // Optimistic local state — server is source of truth on next refresh.
  const [items, setItems] = useState(initial);
  const [, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);

  const completed = items.filter(m => m.completed).length;
  const total = items.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  function toggle(id: string) {
    setItems((arr) => arr.map(m => (m.id === id ? { ...m, completed: !m.completed } : m)));
    const next = !items.find(m => m.id === id)?.completed;
    startTransition(async () => {
      try {
        await toggleMission(id, next);
        router.refresh();
      } catch {
        // revert on failure
        setItems((arr) => arr.map(m => (m.id === id ? { ...m, completed: !next } : m)));
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="label">Today&rsquo;s Missions</div>
          {total > 0 && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400">
              {completed} / {total} complete
            </span>
          )}
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-link inline-flex items-center gap-1">
          <Plus className="size-3" /> Add
        </button>
      </div>

      {total > 0 && (
        <div className="relative h-1 w-full rounded-full bg-surface-3 overflow-hidden mb-5">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-ember-600 to-ember-400 rounded-full shadow-ember-glow-sm"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      {total === 0 ? (
        <EmptyState
          icon={<Target className="size-5" />}
          label="▢ Clean board"
          title="No missions on the board"
          description="Add the first thing you'll execute today. Make it specific. Make it measurable."
          action={
            <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="size-3.5" /> Add mission
            </Button>
          }
        />
      ) : (
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {items.map((m) => (
              <motion.li
                key={m.id}
                layout
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => toggle(m.id)}
                  className={cn(
                    "group w-full flex items-center gap-3 px-3 py-3 rounded-xs",
                    "border border-transparent text-left transition-colors duration-200",
                    "hover:border-edge-subtle hover:bg-surface-3",
                  )}
                >
                  <motion.span
                    className={cn(
                      "shrink-0 size-5 rounded-full grid place-items-center transition-colors",
                      m.completed
                        ? "bg-ember-500 shadow-ember-glow-sm"
                        : "border border-edge group-hover:border-ember-500/60",
                    )}
                    animate={{ scale: m.completed ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {m.completed && (
                      <Check className="size-3 text-surface-0" strokeWidth={3} />
                    )}
                  </motion.span>

                  <span className={cn(
                    "flex-1 text-sm transition-colors",
                    m.completed ? "text-ink-muted line-through" : "text-ink-primary",
                  )}>
                    {m.title}
                  </span>

                  <span className={cn(
                    "font-mono text-[10px] uppercase tracking-widest",
                    PRIORITY_TONE[m.priority],
                  )}>
                    {PRIORITY_LABEL[m.priority]}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <AddMissionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
