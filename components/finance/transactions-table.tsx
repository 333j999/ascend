"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { deleteTransaction } from "@/lib/supabase/actions";
import { EditTransactionModal } from "@/components/modals/edit-transaction";
import { EmptyState } from "@/components/ui/empty-state";
import { FinanceActions } from "@/components/finance/finance-actions";

const CATEGORY_TONE: Record<string, string> = {
  salary: "text-signal-green",
  business: "text-ember-300",
  freelance: "text-ember-300",
  investments: "text-signal-green",
  rent: "text-ink-secondary",
  food: "text-ink-secondary",
  subscriptions: "text-ink-secondary",
  fitness: "text-ink-secondary",
  transport: "text-ink-secondary",
  savings: "text-signal-amber",
  education: "text-ink-secondary",
  debt: "text-signal-red",
  other: "text-ink-muted",
};

type Filter = "all" | "income" | "expense";

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filtered = filter === "all"
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <div className="label">▢ Transactions · recent</div>
          <div className="font-display text-[15px] font-medium tracking-tight text-ink-primary">
            The ledger
          </div>
        </div>
        <FilterPills value={filter} onChange={setFilter} counts={countByType(transactions)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "The ledger is empty" : `No ${filter} transactions`}
          description={filter === "all" ? "Log your first transaction to start building the picture." : `Switch the filter or log a ${filter}.`}
          action={filter === "all" ? <FinanceActions compact /> : null}
        />
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-edge-subtle">
                {["Date","Description","Category","Type","Amount",""].map((h, i) => (
                  <th key={i} className={cn(
                    "py-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted text-left",
                    i === 4 && "text-right",
                    i === 5 && "w-10",
                  )}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 60).map((t) => (
                <tr key={t.id} className="border-b border-edge-subtle/50 last:border-0 hover:bg-surface-3/30 transition-colors">
                  <td className="py-3 font-mono text-xs text-ink-muted tabular-nums">{t.date.slice(5)}</td>
                  <td className="py-3 text-sm text-ink-primary">{t.description}</td>
                  <td className="py-3">
                    <span className={cn(
                      "inline-block px-2 py-0.5 rounded-2xs font-mono text-[10px] uppercase tracking-widest",
                      "bg-surface-3 border border-edge-subtle",
                      CATEGORY_TONE[t.category] ?? "text-ink-secondary",
                    )}>
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest",
                      t.type === "income" ? "text-signal-green" : "text-signal-red",
                    )}>
                      {t.type === "income"
                        ? <ArrowUpRight className="size-3" strokeWidth={2.4} />
                        : <ArrowDownRight className="size-3" strokeWidth={2.4} />}
                      {t.type}
                    </span>
                  </td>
                  <td className={cn(
                    "py-3 text-right stat text-sm tabular-nums",
                    t.type === "income" ? "text-signal-green" : "text-ink-primary",
                  )}>
                    {t.type === "income" ? "+" : "−"}${t.amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <RowMenu
                      open={menuOpenId === t.id}
                      onToggle={() => setMenuOpenId(menuOpenId === t.id ? null : t.id)}
                      onEdit={() => { setEditing(t); setMenuOpenId(null); }}
                      txn={t}
                      onAfterDelete={() => setMenuOpenId(null)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditTransactionModal
          open={!!editing}
          onClose={() => setEditing(null)}
          transaction={editing}
        />
      )}
    </>
  );
}

function FilterPills({
  value, onChange, counts,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
  counts: Record<Filter, number>;
}) {
  const options: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "income", label: "Income" },
    { id: "expense", label: "Expense" },
  ];
  return (
    <div className="flex items-center gap-1 p-1 rounded-xs bg-surface-3 border border-edge-subtle">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "px-3 h-7 rounded-2xs font-mono text-[10px] uppercase tracking-widest transition-all",
            value === o.id
              ? "bg-ember-500/15 text-ember-300 shadow-[inset_0_0_0_1px_rgba(255,94,26,0.3)]"
              : "text-ink-muted hover:text-ink-primary",
          )}
        >
          {o.label}
          <span className="ml-1.5 text-ink-dim">{counts[o.id]}</span>
        </button>
      ))}
    </div>
  );
}

function countByType(txns: Transaction[]): Record<Filter, number> {
  return {
    all: txns.length,
    income: txns.filter(t => t.type === "income").length,
    expense: txns.filter(t => t.type === "expense").length,
  };
}

function RowMenu({
  open, onToggle, onEdit, txn, onAfterDelete,
}: {
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  txn: Transaction;
  onAfterDelete: () => void;
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    if (!confirming) { setConfirming(true); return; }
    start(async () => {
      await deleteTransaction(txn.id);
      onAfterDelete();
      router.refresh();
    });
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="size-7 grid place-items-center rounded-2xs text-ink-muted hover:text-ink-primary hover:bg-surface-3 transition-colors"
        aria-label="Transaction actions"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 mt-1 z-20 w-44 rounded-xs border border-edge bg-surface-2 shadow-elevated overflow-hidden">
            <button
              onClick={onEdit}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-primary hover:bg-surface-3 transition-colors"
            >
              <Pencil className="size-3.5 text-ink-muted" /> Edit
            </button>
            <button
              onClick={onDelete}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                confirming
                  ? "text-signal-red bg-signal-red/10"
                  : "text-ink-primary hover:bg-surface-3",
              )}
            >
              <Trash2 className="size-3.5 text-signal-red" />
              {confirming ? "Confirm delete?" : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
