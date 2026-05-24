"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { Mission } from "@/types";
import { cn } from "@/lib/utils";

const PRIORITY_TONE: Record<Mission["priority"], string> = {
  critical: "text-signal-red",
  high:     "text-ember-400",
  medium:   "text-ink-secondary",
  low:      "text-ink-muted",
};

const PRIORITY_LABEL: Record<Mission["priority"], string> = {
  critical: "CRIT",
  high:     "HIGH",
  medium:   "MED",
  low:      "LOW",
};

export function MissionChecklist({ initial }: { initial: Mission[] }) {
  const [items, setItems] = useState(initial);

  const completed = items.filter(m => m.completed).length;
  const pct = Math.round((completed / items.length) * 100);

  function toggle(id: string) {
    setItems((arr) =>
      arr.map(m => (m.id === id ? { ...m, completed: !m.completed } : m)),
    );
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="label">Today&rsquo;s Missions</div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400">
            {completed} / {items.length} complete
          </span>
        </div>
        <button className="btn-link inline-flex items-center gap-1">
          <Plus className="size-3" /> Add
        </button>
      </div>

      {/* Progress strip */}
      <div className="relative h-1 w-full rounded-full bg-surface-3 overflow-hidden mb-5">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-ember-600 to-ember-400 rounded-full shadow-ember-glow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Items */}
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
                {/* Checkbox */}
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

                {/* Title */}
                <span className={cn(
                  "flex-1 text-sm transition-colors",
                  m.completed ? "text-ink-muted line-through" : "text-ink-primary",
                )}>
                  {m.title}
                </span>

                {/* Priority */}
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
    </div>
  );
}
