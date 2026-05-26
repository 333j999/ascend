"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Banknote, Dumbbell, Sparkles, ArrowRight, ArrowLeft, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { saveProfile } from "@/lib/supabase/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { detectBrowserTZ } from "@/lib/timezone";

type Focus = "money" | "fitness" | "business" | "skills" | "discipline";
type Fitness = "strength" | "hypertrophy" | "endurance" | "fat-loss";

const FOCUS_OPTIONS: { id: Focus; label: string; desc: string; icon: any }[] = [
  { id: "money",      label: "Build Wealth",        desc: "Capital, income, runway", icon: Banknote },
  { id: "fitness",    label: "Build the Body",      desc: "Strength, physique, recovery", icon: Dumbbell },
  { id: "business",   label: "Build the Business",  desc: "Outreach, growth, systems", icon: Target },
  { id: "skills",     label: "Build Mastery",       desc: "Reading, craft, deep work", icon: Sparkles },
  { id: "discipline", label: "Build the Will",      desc: "Habits, discipline, consistency", icon: Check },
];

const FITNESS_OPTIONS: { id: Fitness; label: string; short: string }[] = [
  { id: "strength",    label: "Strength",    short: "Strength" },
  { id: "hypertrophy", label: "Hypertrophy", short: "Mass" },
  { id: "endurance",   label: "Endurance",   short: "Endurance" },
  { id: "fat-loss",    label: "Fat Loss",    short: "Cut" },
];

const HABIT_OPTIONS = [
  "Cold plunge", "Read 30 pages", "Gym", "Journal",
  "No screens before 10am", "20 cold outreaches", "Meditate",
  "Walk 10k steps", "No sugar", "Sleep by 11pm",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    focus: undefined as Focus | undefined,
    income_target: 25000,
    savings_target: 100000,
    fitness: undefined as Fitness | undefined,
    bodyweight: 88,
    habits: [] as string[],
  });

  const TOTAL = 5;
  const pct = ((step + 1) / TOTAL) * 100;

  function next() {
    if (step < TOTAL - 1) {
      setStep(step + 1);
      return;
    }
    // Final step — persist profile then route.
    setError(null);
    if (!isSupabaseConfigured()) {
      router.push("/app/dashboard");
      return;
    }
    start(async () => {
      try {
        await saveProfile({
          primary_focus: data.focus,
          income_target_monthly: data.income_target,
          savings_target: data.savings_target,
          fitness_focus: data.fitness,
          bodyweight_goal_kg: data.bodyweight,
          daily_habits: data.habits,
          timezone: detectBrowserTZ(),
        });
        router.push("/app/dashboard");
      } catch (e: any) {
        setError(e?.message ?? "Could not save profile.");
      }
    });
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }
  function toggleHabit(h: string) {
    setData((d) => ({
      ...d,
      habits: d.habits.includes(h) ? d.habits.filter(x => x !== h) : [...d.habits, h],
    }));
  }

  return (
    <div className="relative min-h-screen px-6 lg:px-12 py-10 grid grid-rows-[auto_1fr_auto]">
      {/* Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            Step {String(step + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </div>
        </div>
        <Progress value={pct} className="max-w-xs flex-1" />
      </div>

      {/* Step content */}
      <div className="flex items-center justify-center py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            {step === 0 && (
              <StepCard
                label="▢ Mission 01"
                title="What are you building?"
                sub="Your primary focus shapes how ASCEND prioritizes your dashboard. You can change it anytime."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOCUS_OPTIONS.map(({ id, label, desc, icon: Icon }) => {
                    const active = data.focus === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setData(d => ({ ...d, focus: id }))}
                        className={cn(
                          "text-left p-5 rounded-xs border transition-all duration-200",
                          active
                            ? "border-ember-500/60 bg-ember-500/5 shadow-ember-glow-sm"
                            : "border-edge-subtle bg-surface-2 hover:border-edge hover:bg-surface-3",
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Icon className={cn("size-5", active ? "text-ember-400" : "text-ink-secondary")} strokeWidth={1.6} />
                          {active && (
                            <span className="size-4 rounded-full bg-ember-500 grid place-items-center">
                              <Check className="size-2.5 text-surface-0" strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div className={cn("font-display text-base font-medium tracking-tight", active ? "text-ink-primary" : "text-ink-primary")}>
                          {label}
                        </div>
                        <div className="mt-1 text-sm text-ink-secondary">{desc}</div>
                      </button>
                    );
                  })}
                </div>
              </StepCard>
            )}

            {step === 1 && (
              <StepCard
                label="▢ Mission 02"
                title="Set your money targets."
                sub="Monthly income and total savings. These show up on the financial command center as goal lines."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Monthly income target ($)"
                    type="number"
                    value={data.income_target}
                    onChange={(e) => setData(d => ({ ...d, income_target: Number(e.target.value) }))}
                  />
                  <Input
                    label="Total savings goal ($)"
                    type="number"
                    value={data.savings_target}
                    onChange={(e) => setData(d => ({ ...d, savings_target: Number(e.target.value) }))}
                  />
                </div>
                <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  ◇ Numbers are private. Used to plot benchmark lines only.
                </div>
              </StepCard>
            )}

            {step === 2 && (
              <StepCard
                label="▢ Mission 03"
                title="What does &lsquo;built&rsquo; look like?"
                sub="Pick your primary fitness focus. Add a bodyweight target if you have one."
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {FITNESS_OPTIONS.map(({ id, label, short }) => {
                    const active = data.fitness === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setData(d => ({ ...d, fitness: id }))}
                        className={cn(
                          "h-14 px-2 rounded-xs border font-mono text-[11px] uppercase tracking-wider transition-all",
                          active
                            ? "border-ember-500/60 bg-ember-500/10 text-ember-300 shadow-ember-glow-sm"
                            : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge",
                        )}
                      >
                        <span className="hidden xl:inline">{label}</span>
                        <span className="xl:hidden">{short}</span>
                      </button>
                    );
                  })}
                </div>
                <Input
                  label="Bodyweight target (kg)"
                  type="number"
                  value={data.bodyweight}
                  onChange={(e) => setData(d => ({ ...d, bodyweight: Number(e.target.value) }))}
                />
              </StepCard>
            )}

            {step === 3 && (
              <StepCard
                label="▢ Mission 04"
                title="Pick the habits you will own."
                sub="Choose 3–6. We&rsquo;ll seed your daily missions board with these. You can add more later."
              >
                <div className="flex flex-wrap gap-2">
                  {HABIT_OPTIONS.map((h) => {
                    const active = data.habits.includes(h);
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => toggleHabit(h)}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 h-10 rounded-xs border transition-all duration-200",
                          "text-sm",
                          active
                            ? "border-ember-500/60 bg-ember-500/10 text-ember-300 shadow-ember-glow-sm"
                            : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge hover:text-ink-primary",
                        )}
                      >
                        {active && <Check className="size-3" strokeWidth={2.4} />}
                        {h}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  ◇ Selected · {data.habits.length}
                </div>
              </StepCard>
            )}

            {step === 4 && (
              <StepCard
                label="▢ Final Brief"
                title="You&rsquo;re ready, operator."
                sub="Your dashboard is configured. The first metric you'll see today is zero. The next one is up to you."
              >
                <div className="rounded-xs border border-edge-subtle bg-surface-2 p-6 space-y-4">
                  <Row k="Primary focus" v={FOCUS_OPTIONS.find(f => f.id === data.focus)?.label ?? "—"} />
                  <Row k="Monthly income target" v={`$${data.income_target.toLocaleString()}`} />
                  <Row k="Savings goal" v={`$${data.savings_target.toLocaleString()}`} />
                  <Row k="Fitness focus" v={FITNESS_OPTIONS.find(f => f.id === data.fitness)?.label ?? "—"} />
                  <Row k="Bodyweight target" v={`${data.bodyweight} kg`} />
                  <Row k="Daily habits" v={`${data.habits.length} selected`} />
                </div>
                <div className="mt-6 font-mono text-[11px] uppercase tracking-widest text-ember-400 inline-flex items-center gap-2">
                  <span className="ember-dot" /> Configuration locked — ready to deploy
                </div>
              </StepCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="flex flex-col gap-3">
        {error && (
          <div className="text-sm text-signal-red border border-signal-red/30 bg-signal-red/5 p-2.5 rounded-xs text-center">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={back} disabled={step === 0 || pending}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hidden sm:block">
            {pending ? "Deploying configuration…" : "Press Enter to continue"}
          </div>
          <Button variant="primary" onClick={next} disabled={pending}>
            {pending ? "Deploying…" : step === TOTAL - 1 ? "Deploy" : "Continue"} <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  label, title, sub, children,
}: { label: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      <h2 className="mt-3 font-display text-3xl lg:text-4xl font-medium tracking-tightest text-ink-primary">
        {title}
      </h2>
      <p className="mt-3 text-ink-secondary max-w-lg">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{k}</span>
      <span className="text-ink-primary font-medium">{v}</span>
    </div>
  );
}
