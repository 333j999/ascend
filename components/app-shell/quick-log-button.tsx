"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionModal } from "@/components/modals/add-transaction";

/**
 * Top-bar / dashboard "Quick Log" trigger.
 * Opens the AddTransactionModal — the most-frequent operator action.
 */
export function QuickLogButton({ label = "Quick Log" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" /> {label}
      </Button>
      <AddTransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
