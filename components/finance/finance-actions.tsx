"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionModal } from "@/components/modals/add-transaction";
import { AddSavingsGoalModal } from "@/components/modals/add-savings-goal";

export function FinanceActions({
  compact = false,
  onlySavings = false,
}: {
  compact?: boolean;
  onlySavings?: boolean;
}) {
  const [txOpen, setTxOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);

  if (onlySavings) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setGoalOpen(true)}>
          <Plus className="size-3.5" /> New goal
        </Button>
        <AddSavingsGoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
      </>
    );
  }

  if (compact) {
    return (
      <>
        <Button variant="primary" size="sm" onClick={() => setTxOpen(true)}>
          <Plus className="size-3.5" /> Log Transaction
        </Button>
        <AddTransactionModal open={txOpen} onClose={() => setTxOpen(false)} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setGoalOpen(true)}>
        <Plus className="size-3.5" /> Goal
      </Button>
      <Button variant="primary" size="sm" onClick={() => setTxOpen(true)}>
        <Plus className="size-3.5" /> Log Transaction
      </Button>
      <AddTransactionModal open={txOpen} onClose={() => setTxOpen(false)} />
      <AddSavingsGoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
    </div>
  );
}
