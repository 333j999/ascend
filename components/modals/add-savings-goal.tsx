"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSavingsGoal } from "@/lib/supabase/actions";

export function AddSavingsGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const target = Number(form.get("target") ?? 0);
    const saved = Number(form.get("saved") ?? 0);
    const deadlineRaw = String(form.get("deadline") ?? "");
    const deadline = deadlineRaw || undefined;

    if (!name) { setError("Name the goal."); return; }
    if (target <= 0) { setError("Target must be greater than zero."); return; }

    start(async () => {
      try {
        await addSavingsGoal({ name, target, saved, deadline });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to save goal.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Savings"
      title="New savings goal"
      subtitle="A target you can measure. A deadline you defend."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input label="Goal name" name="name" placeholder="Emergency fund, business capital, house deposit…" required autoFocus />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Target ($)" name="target" type="number" placeholder="50000" required />
          <Input label="Already saved ($)" name="saved" type="number" defaultValue={0} />
        </div>

        <Input label="Deadline (optional)" name="deadline" type="date" />

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Create goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
