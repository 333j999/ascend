"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTransaction } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "salary", "business", "investments", "freelance",
  "rent", "food", "transport", "subscriptions",
  "fitness", "education", "entertainment", "savings",
  "debt", "other",
] as const;

export function EditTransactionModal({
  open, onClose, transaction,
}: {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [type, setType] = useState<"income" | "expense">(transaction.type);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    const description = String(form.get("description") ?? "").trim();
    const category = String(form.get("category") ?? "other");
    const date = String(form.get("date") ?? transaction.date);

    if (!amount || amount <= 0) { setError("Amount must be greater than zero."); return; }
    if (!description) { setError("Add a description."); return; }

    start(async () => {
      try {
        await updateTransaction(transaction.id, { amount, type, category, description, date });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to update.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Edit ledger entry"
      title="Update transaction"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn(
              "h-11 rounded-xs border font-mono text-[11px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2",
              type === "expense"
                ? "border-signal-red/40 bg-signal-red/10 text-signal-red"
                : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
            )}
          >
            <ArrowDownRight className="size-3.5" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn(
              "h-11 rounded-xs border font-mono text-[11px] uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2",
              type === "income"
                ? "border-signal-green/40 bg-signal-green/10 text-signal-green"
                : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
            )}
          >
            <ArrowUpRight className="size-3.5" /> Income
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Amount ($)" name="amount" type="number" step="0.01" defaultValue={transaction.amount} required />
          <Input label="Date" name="date" type="date" defaultValue={transaction.date} required />
        </div>

        <Input label="Description" name="description" defaultValue={transaction.description} required />

        <div>
          <label className="label mb-2 block">Category</label>
          <select
            name="category"
            defaultValue={transaction.category}
            className="w-full h-11 px-3.5 rounded-xs bg-surface-2 border border-edge-subtle text-ink-primary font-sans text-sm focus:outline-none focus:border-ember-500 focus:bg-surface-3 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
