"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Placeholder filter — clicks switch the highlight, real filtering can be
 * wired up once the table re-renders client-side. For now this gives users
 * tactile feedback so the buttons don't feel dead.
 */
export function TransactionTypeFilter() {
  const [active, setActive] = useState<"all" | "income" | "expense">("all");
  const options = [
    { id: "all" as const, label: "All" },
    { id: "income" as const, label: "Income" },
    { id: "expense" as const, label: "Expense" },
  ];
  return (
    <div className="flex items-center gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => setActive(o.id)}
          className={cn(
            "btn-link",
            active === o.id ? "text-ember-400" : "",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
