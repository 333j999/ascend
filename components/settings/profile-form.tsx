"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { Profile } from "@/lib/supabase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/supabase/actions";
import { COMMON_TIMEZONES, detectBrowserTZ } from "@/lib/timezone";
import { cn } from "@/lib/utils";

type Props = {
  email: string;
  profile: Profile | null;
};

const FOCUS_OPTIONS = [
  { id: "money",      label: "Build Wealth" },
  { id: "fitness",    label: "Build the Body" },
  { id: "business",   label: "Build the Business" },
  { id: "skills",     label: "Build Mastery" },
  { id: "discipline", label: "Build the Will" },
] as const;

const FITNESS_OPTIONS = [
  { id: "strength",    label: "Strength" },
  { id: "hypertrophy", label: "Hypertrophy" },
  { id: "endurance",   label: "Endurance" },
  { id: "fat-loss",    label: "Fat Loss" },
] as const;

export function ProfileForm({ email, profile }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    const form = new FormData(e.currentTarget);

    const input = {
      name: String(form.get("name") ?? "").trim() || undefined,
      timezone: String(form.get("timezone") ?? "") || undefined,
      primary_focus: String(form.get("primary_focus") ?? "") || undefined,
      fitness_focus: String(form.get("fitness_focus") ?? "") || undefined,
      income_target_monthly: Number(form.get("income_target_monthly")) || undefined,
      savings_target: Number(form.get("savings_target")) || undefined,
      bodyweight_goal_kg: Number(form.get("bodyweight_goal_kg")) || undefined,
    };

    start(async () => {
      try {
        await updateProfile(input);
        setStatus({ ok: true, msg: "Profile saved." });
        router.refresh();
      } catch (err: any) {
        setStatus({ ok: false, msg: err?.message ?? "Failed to save." });
      }
    });
  }

  const currentTZ = profile?.timezone ?? "UTC";
  const browserTZ = typeof window !== "undefined" ? detectBrowserTZ() : currentTZ;
  const tzMismatch = browserTZ !== currentTZ && browserTZ !== "UTC";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name" name="name" defaultValue={profile?.name ?? ""} placeholder="Your name" />
        <Input label="Email" defaultValue={email} type="email" readOnly hint="Managed by Google sign-in" />
      </div>

      {/* Timezone */}
      <div>
        <label className="label mb-2 block">Timezone</label>
        <select
          name="timezone"
          defaultValue={currentTZ}
          className="w-full h-11 px-3.5 rounded-xs bg-surface-2 border border-edge-subtle text-ink-primary font-sans text-sm focus:outline-none focus:border-ember-500 focus:bg-surface-3 transition-colors"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        {tzMismatch && (
          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-signal-amber inline-flex items-center gap-1.5">
            <AlertCircle className="size-3" />
            Browser detected <span className="text-ember-300">{browserTZ}</span> — pick it from the list and save to fix day-boundary issues.
          </div>
        )}
      </div>

      {/* Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label mb-2 block">Primary focus</label>
          <select
            name="primary_focus"
            defaultValue={profile?.primary_focus ?? ""}
            className="w-full h-11 px-3.5 rounded-xs bg-surface-2 border border-edge-subtle text-ink-primary font-sans text-sm focus:outline-none focus:border-ember-500 focus:bg-surface-3 transition-colors"
          >
            <option value="">—</option>
            {FOCUS_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-2 block">Fitness focus</label>
          <select
            name="fitness_focus"
            defaultValue={profile?.fitness_focus ?? ""}
            className="w-full h-11 px-3.5 rounded-xs bg-surface-2 border border-edge-subtle text-ink-primary font-sans text-sm focus:outline-none focus:border-ember-500 focus:bg-surface-3 transition-colors"
          >
            <option value="">—</option>
            {FITNESS_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Monthly income target ($)"
          name="income_target_monthly"
          type="number"
          defaultValue={profile?.income_target_monthly ?? ""}
          placeholder="25000"
        />
        <Input
          label="Savings goal ($)"
          name="savings_target"
          type="number"
          defaultValue={profile?.savings_target ?? ""}
          placeholder="100000"
        />
        <Input
          label="Bodyweight target (kg)"
          name="bodyweight_goal_kg"
          type="number"
          step="0.1"
          defaultValue={profile?.bodyweight_goal_kg ?? ""}
          placeholder="88"
        />
      </div>

      {status && (
        <div className={cn(
          "flex items-center gap-2.5 p-2.5 rounded-xs border text-sm",
          status.ok
            ? "border-signal-green/30 bg-signal-green/5 text-signal-green"
            : "border-signal-red/30 bg-signal-red/5 text-signal-red",
        )}>
          {status.ok ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
          {status.msg}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-3 border-t border-edge-subtle">
        <Button variant="primary" size="sm" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
