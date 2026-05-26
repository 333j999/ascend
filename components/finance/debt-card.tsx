"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Trash2, CheckCircle2 } from "lucide-react";
import type { Debt } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { payDebt, deleteDebt } from "@/lib/supabase/actions";
import { formatCurrency } from "@/lib/utils";

export function DebtCard({ debt }: { debt: Debt }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [payOpen, setPayOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const pct = Math.min(100, Math.round((debt.paid / debt.total) * 100));
  const remaining = Math.max(0, debt.total - debt.paid);
  const paidOff = remaining === 0;

  function onDelete() {
    if (!confirmDel) { setConfirmDel(true); return; }
    start(async () => {
      await deleteDebt(debt.id);
      router.refresh();
    });
  }

  return (
    <>
      <div className="p-4 rounded-xs bg-surface-3/40 border border-edge-subtle group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xs border border-edge-subtle bg-surface-2 grid place-items-center shrink-0">
              <CreditCard className="size-4 text-signal-red" strokeWidth={1.6} />
            </div>
            <div>
              <div className="text-ink-primary font-medium">{debt.lender}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                {debt.interest_rate ? `${debt.interest_rate}% APR` : "—"}
                {debt.monthly_payment ? ` · $${debt.monthly_payment}/mo` : ""}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="stat text-lg text-ink-primary tracking-tight">{formatCurrency(remaining)}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              of {formatCurrency(debt.total)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Progress value={pct} className="flex-1" />
          <span className="font-mono text-[11px] text-signal-green tabular-nums w-12 text-right">{pct}%</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            {paidOff
              ? <span className="text-signal-green inline-flex items-center gap-1"><CheckCircle2 className="size-3" /> Paid off</span>
              : `${formatCurrency(remaining)} remaining`}
          </div>
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            {!paidOff && (
              <button
                onClick={() => setPayOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 h-7 rounded-2xs border border-signal-green/30 bg-signal-green/5 text-signal-green font-mono text-[10px] uppercase tracking-widest hover:bg-signal-green/15 transition-colors"
              >
                Pay
              </button>
            )}
            <button
              onClick={onDelete}
              disabled={pending}
              className={`size-7 grid place-items-center rounded-2xs transition-colors ${
                confirmDel ? "bg-signal-red/15 text-signal-red border border-signal-red/30" : "text-ink-muted hover:text-signal-red"
              }`}
              aria-label="Delete debt"
              title={confirmDel ? "Click again to confirm" : "Delete debt"}
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>
      </div>

      <PayDebtModal debt={debt} open={payOpen} onClose={() => setPayOpen(false)} />
    </>
  );
}

function PayDebtModal({ debt, open, onClose }: {
  debt: Debt;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const remaining = Math.max(0, debt.total - debt.paid);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount") ?? 0);
    if (amount <= 0) { setError("Amount must be greater than zero."); return; }

    start(async () => {
      try {
        await payDebt(debt.id, amount);
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to log payment.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Pay debt"
      title={`Pay ${debt.lender}`}
      subtitle="Logs a debt-category expense in the ledger and shrinks the bar."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Amount ($)"
          name="amount"
          type="number"
          step="0.01"
          placeholder={debt.monthly_payment ? String(debt.monthly_payment) : "100"}
          defaultValue={debt.monthly_payment ?? ""}
          required
          autoFocus
        />

        <div className="p-3 rounded-xs bg-surface-3/40 border border-edge-subtle text-xs font-mono uppercase tracking-widest text-ink-muted text-center">
          {formatCurrency(debt.paid)} paid · {formatCurrency(remaining)} remaining
        </div>

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Log payment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
