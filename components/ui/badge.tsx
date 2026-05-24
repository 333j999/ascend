import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "ember" | "green" | "red" | "amber" | "outline";

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-3 text-ink-secondary border border-edge-subtle",
  ember:   "bg-ember-500/10 text-ember-300 border border-ember-500/30",
  green:   "bg-signal-green/10 text-signal-green border border-signal-green/30",
  red:     "bg-signal-red/10 text-signal-red border border-signal-red/30",
  amber:   "bg-signal-amber/10 text-signal-amber border border-signal-amber/30",
  outline: "bg-transparent text-ink-secondary border border-edge",
};

export function Badge({
  tone = "neutral", className, children,
}: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-2xs",
        "font-mono text-[10px] uppercase tracking-widest font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
