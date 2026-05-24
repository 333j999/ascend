"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addWorkout } from "@/lib/supabase/actions";
import { toLocalISODate } from "@/lib/utils";

type SetRow = { reps: number; weight_kg: number };
type ExerciseRow = { name: string; sets: SetRow[] };

export function AddWorkoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    { name: "", sets: [{ reps: 5, weight_kg: 0 }] },
  ]);
  const [error, setError] = useState<string | null>(null);

  function updateExercise(i: number, patch: Partial<ExerciseRow>) {
    setExercises((arr) => arr.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }
  function updateSet(exI: number, setI: number, patch: Partial<SetRow>) {
    setExercises((arr) =>
      arr.map((e, idx) =>
        idx !== exI ? e : { ...e, sets: e.sets.map((s, si) => (si === setI ? { ...s, ...patch } : s)) },
      ),
    );
  }
  function addExercise() {
    setExercises((arr) => [...arr, { name: "", sets: [{ reps: 5, weight_kg: 0 }] }]);
  }
  function removeExercise(i: number) {
    setExercises((arr) => arr.filter((_, idx) => idx !== i));
  }
  function addSet(exI: number) {
    setExercises((arr) =>
      arr.map((e, idx) =>
        idx !== exI ? e : { ...e, sets: [...e.sets, { reps: 5, weight_kg: e.sets.at(-1)?.weight_kg ?? 0 }] },
      ),
    );
  }
  function removeSet(exI: number, setI: number) {
    setExercises((arr) =>
      arr.map((e, idx) =>
        idx !== exI ? e : { ...e, sets: e.sets.filter((_, si) => si !== setI) },
      ),
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const duration_min = Number(form.get("duration") ?? 0);

    if (!name) { setError("Workout needs a name."); return; }
    const validExercises = exercises.filter((ex) => ex.name.trim() && ex.sets.length > 0);
    if (validExercises.length === 0) { setError("Add at least one exercise."); return; }

    start(async () => {
      try {
        await addWorkout({ name, date, duration_min, exercises: validExercises });
        router.refresh();
        onClose();
        setExercises([{ name: "", sets: [{ reps: 5, weight_kg: 0 }] }]);
      } catch (err: any) {
        setError(err?.message ?? "Failed to save workout.");
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="▢ Training log"
      title="Log a workout"
      subtitle="Every set is a deposit. Track what you lifted."
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Session name" name="name" placeholder="Pull · heavy" required className="sm:col-span-1" />
          <Input label="Date" name="date" type="date" defaultValue={toLocalISODate(new Date())} required />
          <Input label="Duration (min)" name="duration" type="number" defaultValue={60} required />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="label">Exercises</span>
            <button type="button" onClick={addExercise} className="btn-link inline-flex items-center gap-1">
              <Plus className="size-3" /> Add exercise
            </button>
          </div>

          {exercises.map((ex, exI) => (
            <div key={exI} className="rounded-xs border border-edge-subtle bg-surface-3/30 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Deadlift, Bench press, Squat…"
                  value={ex.name}
                  onChange={(e) => updateExercise(exI, { name: e.target.value })}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeExercise(exI)}
                  className="size-9 grid place-items-center rounded-xs border border-edge-subtle text-ink-muted hover:text-signal-red hover:border-signal-red/40 transition-colors"
                  aria-label="Remove exercise"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {ex.sets.map((s, setI) => (
                  <div key={setI} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted w-10">Set {setI + 1}</span>
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => updateSet(exI, setI, { reps: Number(e.target.value) })}
                      className="w-20 h-9 px-2 rounded-xs bg-surface-2 border border-edge-subtle text-ink-primary text-sm focus:outline-none focus:border-ember-500"
                      placeholder="reps"
                    />
                    <span className="font-mono text-[10px] text-ink-muted">×</span>
                    <input
                      type="number"
                      step="0.5"
                      value={s.weight_kg}
                      onChange={(e) => updateSet(exI, setI, { weight_kg: Number(e.target.value) })}
                      className="w-24 h-9 px-2 rounded-xs bg-surface-2 border border-edge-subtle text-ink-primary text-sm focus:outline-none focus:border-ember-500"
                      placeholder="kg"
                    />
                    <span className="font-mono text-[10px] text-ink-muted">kg</span>
                    <button
                      type="button"
                      onClick={() => removeSet(exI, setI)}
                      className="ml-auto size-7 grid place-items-center text-ink-muted hover:text-signal-red transition-colors"
                      aria-label="Remove set"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSet(exI)}
                  className="btn-link inline-flex items-center gap-1 mt-1"
                >
                  <Plus className="size-3" /> Add set
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-edge-subtle">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Log workout"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
