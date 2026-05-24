"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { addJournalEntry } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

type Mood = "elite" | "focused" | "neutral" | "low" | "broken";

const MOODS: { id: Mood; label: string; emoji: string; tone: string }[] = [
  { id: "elite",   label: "Elite",   emoji: "▲", tone: "border-ember-500/40 bg-ember-500/10 text-ember-300" },
  { id: "focused", label: "Focused", emoji: "◆", tone: "border-ember-500/30 bg-ember-500/5 text-ember-400" },
  { id: "neutral", label: "Neutral", emoji: "●", tone: "border-edge bg-surface-3 text-ink-secondary" },
  { id: "low",     label: "Low",     emoji: "◇", tone: "border-signal-amber/30 bg-signal-amber/5 text-signal-amber" },
  { id: "broken",  label: "Broken",  emoji: "▽", tone: "border-signal-red/30 bg-signal-red/5 text-signal-red" },
];

export function AddJournalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [mood, setMood] = useState<Mood>("focused");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const win = String(form.get("win") ?? "").trim();
    const loss = String(form.get("loss") ?? "").trim();
    const reflection = String(form.get("reflection") ?? "").trim();

    if (!win && !loss && !reflection) {
      setError("Write at least one field — win, loss, or reflection.");
      return;
    }

    start(async () => {
      try {
        await addJournalEntry({
          date: new Date().toISOString().slice(0, 10),
          mood,
          win: win || undefined,
          loss: loss || undefined,
          reflection: reflection || undefined,
        });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to save entry.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Reflection"
      title="New journal entry"
      subtitle={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="label mb-2 block">Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={cn(
                    "inline-flex items-center gap-2 h-9 px-3.5 rounded-xs border transition-all",
                    "font-mono text-[11px] uppercase tracking-widest",
                    active ? m.tone : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
                  )}
                >
                  <span>{m.emoji}</span> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea label="Win — what worked" name="win" placeholder="What you executed on today" className="min-h-[80px]" />
        <Textarea label="Loss — what slipped" name="loss" placeholder="What you let drift" className="min-h-[80px]" />
        <Textarea label="Reflection — the lesson" name="reflection" placeholder="One sentence for tomorrow-you" className="min-h-[80px]" />

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
