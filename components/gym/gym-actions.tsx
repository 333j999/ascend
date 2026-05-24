"use client";

import { useState } from "react";
import { Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddWorkoutModal } from "@/components/modals/add-workout";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logBodyMetric } from "@/lib/supabase/actions";

export function GymActions() {
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [metricOpen, setMetricOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setMetricOpen(true)}>
        <Scale className="size-3.5" /> Log Weight
      </Button>
      <Button variant="primary" size="sm" onClick={() => setWorkoutOpen(true)}>
        <Plus className="size-3.5" /> Log Workout
      </Button>
      <AddWorkoutModal open={workoutOpen} onClose={() => setWorkoutOpen(false)} />
      <LogBodyMetricModal open={metricOpen} onClose={() => setMetricOpen(false)} />
    </div>
  );
}

function LogBodyMetricModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const date = String(form.get("date") ?? new Date().toISOString().slice(0, 10));
    const weight_kg = Number(form.get("weight") ?? 0) || undefined;
    const body_fat_pct = Number(form.get("bf") ?? 0) || undefined;
    const sleep_hours = Number(form.get("sleep") ?? 0) || undefined;

    if (!weight_kg && !body_fat_pct && !sleep_hours) {
      setError("Log at least one metric.");
      return;
    }

    start(async () => {
      try {
        await logBodyMetric({ date, weight_kg, body_fat_pct, sleep_hours });
        router.refresh();
        onClose();
      } catch (err: any) {
        setError(err?.message ?? "Failed to save.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Body composition"
      title="Log a weigh-in"
      subtitle="One row per day. Yesterday's value is overwritten if you log again."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Input label="Date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
        <div className="grid grid-cols-3 gap-3">
          <Input label="Weight (kg)" name="weight" type="number" step="0.1" placeholder="87.6" />
          <Input label="Body fat %" name="bf" type="number" step="0.1" placeholder="12.8" />
          <Input label="Sleep (h)" name="sleep" type="number" step="0.1" placeholder="8.0" />
        </div>
        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save metric"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
