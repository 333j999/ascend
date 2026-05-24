"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addHabit } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export function AddHabitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [kind, setKind] = useState<"good" | "bad">("good");
  const [target, setTarget] = useState(7);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) { setError("Habit needs a name."); return; }

    start(async () => {
      try {
        await addHabit({ name, kind, target_per_week: target });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to add habit.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ New habit"
      title="Track a behavior"
      subtitle="Good habits to do. Bad habits to avoid. Both go into the discipline score."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Habit name"
          name="name"
          placeholder={kind === "good" ? "Read 30 pages, cold plunge…" : "Doom scroll, ate sugar, skipped gym…"}
          required
          autoFocus
        />

        <div>
          <label className="label mb-2 block">Kind</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setKind("good")}
              className={cn(
                "h-12 rounded-xs border font-mono text-[11px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2",
                kind === "good"
                  ? "border-signal-green/40 bg-signal-green/10 text-signal-green"
                  : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
              )}
            >
              <Check className="size-3.5" /> Good — to do
            </button>
            <button
              type="button"
              onClick={() => setKind("bad")}
              className={cn(
                "h-12 rounded-xs border font-mono text-[11px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2",
                kind === "bad"
                  ? "border-signal-red/40 bg-signal-red/10 text-signal-red"
                  : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
              )}
            >
              <X className="size-3.5" /> Bad — to avoid
            </button>
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            {kind === "good"
              ? "Completing a good habit raises your discipline score."
              : "Marking a bad habit done means you slipped — lowers the score."}
          </div>
        </div>

        <div>
          <label className="label mb-2 block">Target · {kind === "good" ? "do" : "avoid"} per week</label>
          <div className="flex items-center gap-2">
            {[3, 5, 7].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTarget(t)}
                className={cn(
                  "flex-1 h-10 rounded-xs border font-mono text-[11px] uppercase tracking-widest transition-all",
                  target === t
                    ? "border-ember-500/40 bg-ember-500/10 text-ember-300"
                    : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
                )}
              >
                {t}x / wk
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Adding…" : "Add habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
