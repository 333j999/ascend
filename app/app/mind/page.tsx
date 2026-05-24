"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuoteCard } from "@/components/dashboard/quote-card";
import { MOCK_JOURNAL } from "@/lib/mock-data";
import type { Mood } from "@/types";
import { cn, formatDate } from "@/lib/utils";

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

const MOOD_DOT: Record<Mood, string> = {
  elite: "bg-ember-300",
  focused: "bg-ember-500",
  neutral: "bg-edge-strong",
  low: "bg-signal-amber",
  broken: "bg-signal-red",
};

export default function MindPage() {
  const [mood, setMood] = useState<Mood>("focused");
  const [win, setWin] = useState("");
  const [loss, setLoss] = useState("");
  const [reflection, setReflection] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 05 · Mind / Journal"
        title={<>What you don&rsquo;t reflect on, <span className="italic font-light text-ember-300">runs you.</span></>}
        subtitle="A simple ritual. Win. Loss. Reflection. Minimal friction, maximum signal. Five minutes a day to stay sovereign over your own mind."
      />

      {/* Top row: composer + quote + mood viz */}
      <div className="grid grid-cols-12 gap-4">

        {/* Composer */}
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label={`▢ Today · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
            title="Daily reflection"
            action={<Button variant="primary" size="sm"><Send className="size-3.5" /> Save Entry</Button>}
          />

          {/* Mood selector */}
          <div className="mb-5">
            <div className="label mb-3">Mood · Right now</div>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((m) => {
                const active = mood === m.id;
                return (
                  <button
                    key={m.id}
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
        </Card>

        {/* Sidebar — quote + mood trend */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <QuoteCard />

          <Card>
            <CardHeader label="▢ Mood · 14 days" title="Inner weather" />
            <div className="mt-4 grid grid-cols-14 gap-1 h-32" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
              {[3,4,4,3,2,4,5,5,4,5,4,3,4,5].map((v, i) => {
                const h = (v / 5) * 100;
                const moods: Mood[] = ["broken","low","neutral","focused","elite"];
                const m = moods[v - 1];
                return (
                  <div key={i} className="flex flex-col justify-end gap-1">
                    <div
                      className={cn("rounded-2xs", MOOD_DOT[m])}
                      style={{ height: `${h}%`, opacity: 0.85 }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              <span>2 weeks ago</span>
              <span>Today</span>
            </div>
          </Card>

          <Card>
            <CardHeader label="▢ Streak · journaling" title="Don't break it" />
            <div className="flex items-baseline gap-2">
              <span className="stat text-4xl text-ember-300 tracking-tightest">14</span>
              <span className="font-mono text-xs text-ink-muted">days consecutive</span>
            </div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Best · 31 days
            </div>
          </Card>
        </div>
      </div>

      {/* Past entries */}
      <Card>
        <CardHeader
          label="▢ Archive"
          title="Past entries"
          action={
            <div className="flex items-center gap-2">
              <button className="btn-link text-ember-400">All</button>
              <button className="btn-link">Wins</button>
              <button className="btn-link">Losses</button>
              <button className="btn-link">Reflections</button>
            </div>
          }
        />
        <div className="space-y-3">
          {MOCK_JOURNAL.map((j) => (
            <article
              key={j.id}
              className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30 hover:bg-surface-3/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  {formatDate(j.date, "long")}
                </div>
                <Badge tone={j.mood === "elite" || j.mood === "focused" ? "ember" : "neutral"}>
                  {j.mood}
                </Badge>
              </div>
              <div className="space-y-2 text-sm leading-relaxed">
                {j.win && (
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400 mr-2">Win</span>
                    <span className="text-ink-primary">{j.win}</span>
                  </div>
                )}
                {j.loss && (
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-signal-red mr-2">Loss</span>
                    <span className="text-ink-secondary">{j.loss}</span>
                  </div>
                )}
                {j.reflection && (
                  <div className="pt-2 border-t border-edge-subtle italic text-ink-secondary">
                    &ldquo;{j.reflection}&rdquo;
                  </div>
                )}
              </div>
              {j.tags && j.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {j.tags.map(t => (
                    <span key={t} className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
