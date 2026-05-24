"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddMissionModal } from "@/components/modals/add-mission";

export function MissionActions() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" /> Add Mission
      </Button>
      <AddMissionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
