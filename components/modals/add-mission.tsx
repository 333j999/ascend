"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { addMission } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

type Priority = "critical" | "high" | "medium" | "low";
type Category = "work" | "fitness" | "money" | "mind" | "relationships";

const PRIORITIES: { id: Priority; label: string; tone: string }[] = [
  { id: "critical", label: "CRIT", tone: "border-signal-red/40 bg-signal-red/10 text-signal-red" },
  { id: "high",     label: "HIGH", tone: "border-ember-500/40 bg-ember-500/10 text-ember-300" },
  { id: "medium",   label: "MED",  tone: "border-edge bg-surface-3 text-ink-secondary" },
  { id: "low",      label: "LOW",  tone: "border-edge-subtle bg-surface-2 text-ink-muted" },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "work",          label: "Work" },
  { id: "fitness",       label: "Fitness" },
  { id: "money",         label: "Money" },
  { id: "mind",          label: "Mind" },
  { id: "relationships", label: "Relations" },
];

export function AddMissionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    if (!title) { setError("Mission needs a title."); return; }

    start(async () => {
      try {
        await addMission({ title, description: description || undefined, priority, category });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to save mission.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ New mission"
      title="Add to today's board"
      subtitle="One task. One outcome. Make it specific."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input label="Mission" name="title" placeholder="Send 20 cold outreaches before 10am" required autoFocus />

        <Textarea label="Notes (optional)" name="description" placeholder="Context, links, success criteria…" className="min-h-[80px]" />

        <div>
          <label className="label mb-2 block">Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const active = priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={cn(
                    "h-10 rounded-xs border font-mono text-[11px] uppercase tracking-widest transition-all",
                    active ? p.tone : "border-edge-subtle bg-surface-2 text-ink-muted hover:border-edge",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label mb-2 block">Category</label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "h-9 rounded-xs border font-mono text-[10px] uppercase tracking-widest transition-all",
                    active
                      ? "border-ember-500/40 bg-ember-500/10 text-ember-300"
                      : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
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
            {pending ? "Saving…" : "Add mission"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
