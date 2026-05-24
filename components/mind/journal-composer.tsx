"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { addJournalEntry } from "@/lib/supabase/actions";
import { cn, toLocalISODate } from "@/lib/utils";
import type { JournalEntry, Mood } from "@/types";

const MOOD_OPTIONS: { id: Mood; label: string; emoji: string }[] = [
  { id: "elite",   label: "Elite",   emoji: "▲" },
  { id: "focused", label: "Focused", emoji: "◆" },
  { id: "neutral", label: "Neutral", emoji: "●" },
  { id: "low",     label: "Low",     emoji: "◇" },
  { id: "broken",  label: "Broken",  emoji: "▽" },
];

const MOOD_COLOR: Record<Mood, string> = {
  elite:   "text-ember-300 border-ember-500/40 bg-ember-500/10",
  focused: "text-ember-400 border-ember-500/30 bg-ember-500/5",
  neutral: "text-ink-secondary border-edge bg-surface-3",
  low:     "text-signal-amber border-signal-amber/30 bg-signal-amber/5",
  broken:  "text-signal-red border-signal-red/30 bg-signal-red/5",
};

export function JournalComposer({ existing }: { existing?: JournalEntry }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>(existing?.mood ?? "focused");
  const [win, setWin] = useState(existing?.win ?? "");
  const [loss, setLoss] = useState(existing?.loss ?? "");
  const [reflection, setReflection] = useState(existing?.reflection ?? "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setSavedMsg(null);

    if (!win.trim() && !loss.trim() && !reflection.trim()) {
      setError("Write at least one field — win, loss, or reflection.");
      return;
    }

    start(async () => {
      try {
        await addJournalEntry({
          date: toLocalISODate(new Date()),
          mood,
          win: win.trim() || undefined,
          loss: loss.trim() || undefined,
          reflection: reflection.trim() || undefined,
        });
        setSavedMsg("Saved.");
        router.refresh();
      } catch (err: any) {
        setError(err?.message ?? "Failed to save.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Mood selector */}
      <div className="mb-5">
        <div className="label mb-3">Mood · Right now</div>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((m) => {
            const active = mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                className={cn(
                  "inline-flex items-center gap-2 h-9 px-3.5 rounded-xs border transition-all",
                  "font-mono text-[11px] uppercase tracking-widest",
                  active ? MOOD_COLOR[m.id] : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
                )}
              >
                <span>{m.emoji}</span> {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="label mb-2"><span className="text-ember-400">Win</span> · what worked</div>
          <Textarea
            placeholder="What did you execute on? Don't be modest. The journal is the only honest room you have."
            value={win}
            onChange={(e) => setWin(e.target.value)}
            className="min-h-[90px]"
          />
        </div>
        <div>
          <div className="label mb-2"><span className="text-signal-red">Loss</span> · what slipped</div>
          <Textarea
            placeholder="What did you let drift? Name it. You can't fix what you can't say out loud."
            value={loss}
            onChange={(e) => setLoss(e.target.value)}
            className="min-h-[90px]"
          />
        </div>
        <div>
          <div className="label mb-2"><span className="text-ink-secondary">Reflection</span> · the insight</div>
          <Textarea
            placeholder="One sentence. The lesson from today that you'll bring into tomorrow."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[90px]"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs">
          {error}
        </div>
      )}
      {savedMsg && (
        <div className="mt-4 text-sm text-signal-green border border-signal-green/30 bg-signal-green/5 p-2.5 rounded-xs">
          {savedMsg}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <Button variant="primary" size="sm" type="submit" disabled={pending}>
          {pending ? "Saving…" : <><Send className="size-3.5" /> {existing ? "Update entry" : "Save entry"}</>}
        </Button>
      </div>
    </form>
  );
}
