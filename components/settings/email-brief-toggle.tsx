"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfile } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export function EmailBriefToggle({
  initial, email, timezone,
}: { initial: boolean; email: string; timezone: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [enabled, setEnabled] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = !enabled;
    setEnabled(next); // optimistic
    setError(null);
    start(async () => {
      try {
        await updateProfile({ email_brief_enabled: next });
        router.refresh();
      } catch (err: any) {
        setEnabled(!next); // revert
        setError(err?.message ?? "Failed to update.");
      }
    });
  }

  return (
    <div className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xs border border-edge bg-surface-2 grid place-items-center shrink-0">
            <Mail className="size-4 text-ember-400" strokeWidth={1.6} />
          </div>
          <div>
            <div className="font-medium text-ink-primary">Daily morning brief</div>
            <p className="mt-1 text-sm text-ink-secondary leading-relaxed">
              Get yesterday&rsquo;s score, today&rsquo;s missions, and the habits you owe today —
              delivered to <span className="text-ember-300">{email}</span> at 6am your local time
              ({timezone}).
            </p>
          </div>
        </div>

        <button
          onClick={toggle}
          disabled={pending}
          aria-pressed={enabled}
          className={cn(
            "relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors",
            enabled ? "bg-ember-500 shadow-ember-glow-sm" : "bg-surface-4 border border-edge",
            pending && "opacity-60 cursor-wait",
          )}
        >
          <span
            className={cn(
              "inline-block size-5 rounded-full bg-surface-0 transition-transform",
              enabled ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-signal-green inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3" /> Enabled · next send at 6am {timezone}
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs inline-flex items-center gap-2">
          <AlertCircle className="size-4" /> {error}
        </div>
      )}
    </div>
  );
}
