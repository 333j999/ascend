"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDebt } from "@/lib/supabase/actions";

export function AddDebtModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const lender = String(form.get("lender") ?? "").trim();
    const total = Number(form.get("total") ?? 0);
    const paid = Number(form.get("paid") ?? 0);
    const monthly_payment = Number(form.get("monthly_payment") ?? 0) || undefined;
    const interest_rate = Number(form.get("interest_rate") ?? 0) || undefined;

    if (!lender) { setError("Lender name required."); return; }
    if (total <= 0) { setError("Total must be greater than zero."); return; }

    start(async () => {
      try {
        await addDebt({ lender, total, paid, monthly_payment, interest_rate });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to save debt.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Debt"
      title="Track a debt"
      subtitle="Name it. Number it. Watch it shrink."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Lender"
          name="lender"
          placeholder="Student Loan — Federal, Capital One, Mom…"
          required
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Total owed ($)" name="total" type="number" step="0.01" placeholder="18000" required />
          <Input label="Already paid ($)" name="paid" type="number" step="0.01" defaultValue={0} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Monthly payment ($)" name="monthly_payment" type="number" step="0.01" placeholder="380" />
          <Input label="Interest rate (% APR)" name="interest_rate" type="number" step="0.1" placeholder="4.2" />
        </div>

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Track debt"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
