"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Trash2 } from "lucide-react";
import type { SavingsGoal } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { contributeToGoal, deleteSavingsGoal } from "@/lib/supabase/actions";
import { formatCurrency } from "@/lib/utils";

export function SavingsGoalCard({ goal }: { goal: SavingsGoal }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [contribOpen, setContribOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.saved);

  function onDelete() {
    if (!confirmDel) { setConfirmDel(true); return; }
    start(async () => {
      await deleteSavingsGoal(goal.id);
      router.refresh();
    });
  }

  return (
    <>
      <div className="p-4 rounded-xs bg-surface-3/40 border border-edge-subtle group">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-ink-primary font-medium">{goal.name}</div>
            {goal.deadline && (
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted inline-flex items-center gap-1">
                <Calendar className="size-3" /> Target · {goal.deadline}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="stat text-lg text-ink-primary tracking-tight">{formatCurrency(goal.saved)}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">of {formatCurrency(goal.target)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Progress value={pct} className="flex-1" glow />
          <span className="font-mono text-[11px] text-ember-400 tabular-nums w-12 text-right">{pct}%</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            {pct >= 100 ? "✓ Funded" : `${formatCurrency(remaining)} remaining`}
          </div>
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setContribOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 h-7 rounded-2xs border border-ember-500/30 bg-ember-500/5 text-ember-300 font-mono text-[10px] uppercase tracking-widest hover:bg-ember-500/15 transition-colors"
            >
              <Plus className="size-3" /> Contribute
            </button>
            <button
              onClick={onDelete}
              disabled={pending}
              className={`size-7 grid place-items-center rounded-2xs transition-colors ${
                confirmDel ? "bg-signal-red/15 text-signal-red border border-signal-red/30" : "text-ink-muted hover:text-signal-red"
              }`}
              aria-label="Delete goal"
              title={confirmDel ? "Click again to confirm" : "Delete goal"}
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>
      </div>

      <ContributeModal
        goal={goal}
        open={contribOpen}
        onClose={() => setContribOpen(false)}
      />
    </>
  );
}

function ContributeModal({ goal, open, onClose }: {
  goal: SavingsGoal;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount") ?? 0);
    if (amount <= 0) { setError("Amount must be greater than zero."); return; }

    start(async () => {
      try {
        await contributeToGoal(goal.id, amount);
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to contribute.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Contribute"
      title={`Add to ${goal.name}`}
      subtitle="Logs a savings transaction and bumps your goal in one step."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input label="Amount ($)" name="amount" type="number" step="0.01" placeholder="100" required autoFocus />

        <div className="p-3 rounded-xs bg-surface-3/40 border border-edge-subtle text-xs font-mono uppercase tracking-widest text-ink-muted text-center">
          {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
        </div>

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Add contribution"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
