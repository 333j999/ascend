"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Activity, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
      {/* Background — grid + ember orbs + scan line */}
      <div className="pointer-events-none absolute inset-0">
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)",
          }}
        />
        {/* ember orb top */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-3xl opacity-[0.25]"
             style={{ background: "radial-gradient(ellipse at center, rgba(255,94,26,0.55), transparent 60%)" }}
        />
        {/* horizon line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember-500/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-edge bg-surface-2/80 backdrop-blur-sm">
            <span className="ember-dot" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-secondary">
              v1.0 · Built for ambitious men
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-center font-display font-medium tracking-tightest text-ink-primary"
          style={{ fontSize: "clamp(44px, 8vw, 96px)", lineHeight: 0.98 }}
        >
          Track the man{" "}
          <span className="relative inline-block">
            <span className="relative z-10 italic font-light text-ember-300">
              you&rsquo;re becoming.
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember-400 to-transparent" />
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-7 max-w-2xl text-center text-ink-secondary text-[17px] lg:text-[19px] leading-relaxed"
        >
          One operating system for your money, missions, body, mind, and discipline.
          Built for the men who measure what matters.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button variant="primary" size="lg" href="/signup">
            Start Free <ArrowRight className="size-4" />
          </Button>
          <Button variant="ghost" size="lg" href="#preview">
            See the dashboard
          </Button>
        </motion.div>

        {/* Inline status row — tactical */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted"
        >
          <span className="inline-flex items-center gap-1.5"><span className="signal-dot-green" /> All systems operational</span>
          <span className="inline-flex items-center gap-1.5"><Activity className="size-3" /> No credit card required</span>
          <span className="inline-flex items-center gap-1.5"><Flame className="size-3 text-ember-400" /> 2,400+ operators tracking daily</span>
        </motion.div>

        {/* Hero preview — tactical dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative"
        >
          <HeroDashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */

function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Ambient glow under dashboard */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -bottom-10 h-40 blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,94,26,0.30), transparent 70%)" }}
      />

      <div className="relative card p-0 overflow-hidden bg-surface-1 border-edge">
        {/* Top window-chrome bar */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-edge-subtle bg-surface-2/60">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-surface-4" />
            <span className="size-2 rounded-full bg-surface-4" />
            <span className="size-2 rounded-full bg-surface-4" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            ascend.app / operator / dashboard
          </div>
          <div className="font-mono text-[10px] text-ink-muted tabular-nums">
            24·05 · 06:42 EST
          </div>
        </div>

        {/* Dashboard grid (compressed preview) */}
        <div className="grid grid-cols-12 gap-3 p-4 lg:p-5">
          {/* Discipline score */}
          <div className="col-span-12 lg:col-span-4 card bg-surface-2 p-5">
            <div className="flex items-start justify-between">
              <div className="label">Discipline · 30D</div>
              <span className="font-mono text-[10px] text-signal-green tabular-nums">+8.4%</span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <div className="stat text-6xl tracking-tightest text-ink-primary">87</div>
              <div className="font-mono text-xs text-ink-muted">/100</div>
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ember-400">
              Disciplined
            </div>
            <SparkBars />
          </div>

          {/* Money */}
          <div className="col-span-12 lg:col-span-4 card bg-surface-2 p-5">
            <div className="label">Monthly Net</div>
            <div className="mt-4 stat text-4xl tracking-tightest text-ink-primary">
              $12,110
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-mono">
              <span className="text-signal-green inline-flex items-center gap-0.5">
                <ArrowUpRight className="size-3" strokeWidth={2.2} /> +14.2%
              </span>
              <span className="text-ink-muted uppercase tracking-wider">vs last month</span>
            </div>
            <MoneySparkLine />
          </div>

          {/* Streak */}
          <div className="col-span-12 lg:col-span-4 card bg-surface-2 p-5">
            <div className="label">Current Streak</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="stat text-5xl tracking-tightest text-ember-400">47</span>
              <span className="font-mono text-xs text-ink-muted">days</span>
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Best · 92 days
            </div>
            <StreakDots />
          </div>

          {/* Missions list */}
          <div className="col-span-12 lg:col-span-7 card bg-surface-2 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="label">Today&rsquo;s Missions</div>
              <div className="font-mono text-[10px] text-ink-muted">5 / 7 complete</div>
            </div>
            <ul className="space-y-2.5">
              {[
                { txt: "20 cold outreach messages", done: true },
                { txt: "Heavy pull · deadlifts", done: true },
                { txt: "Review yesterday's trades", done: true },
                { txt: "Read 30 pages · Meditations", done: true },
                { txt: "Cold plunge · 4 min", done: false },
              ].map((m, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className={
                      m.done
                        ? "size-4 rounded-full bg-ember-500 shadow-ember-glow-sm grid place-items-center"
                        : "size-4 rounded-full border border-edge"
                    }
                  >
                    {m.done && (
                      <svg viewBox="0 0 12 12" className="size-2.5 text-surface-0">
                        <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={m.done ? "text-ink-muted line-through" : "text-ink-primary"}>
                    {m.txt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gym + body */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="card bg-surface-2 p-5">
              <div className="label">Last PR</div>
              <div className="mt-3 stat text-2xl text-ink-primary">200 kg</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted">Deadlift</div>
            </div>
            <div className="card bg-surface-2 p-5">
              <div className="label">Bodyweight</div>
              <div className="mt-3 stat text-2xl text-ink-primary">87.6</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-signal-green">-3.6 kg</div>
            </div>
            <div className="col-span-2 card bg-surface-2 p-5">
              <div className="label">Habits · This week</div>
              <HabitGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkBars() {
  // simple inline ascending bar viz
  const heights = [22, 30, 26, 38, 34, 48, 44, 56, 60, 54, 64, 72];
  return (
    <div className="mt-5 flex items-end gap-1 h-16">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-ember-700/60 to-ember-400 rounded-2xs"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function MoneySparkLine() {
  return (
    <svg viewBox="0 0 200 60" className="mt-5 w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hm-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff5e1a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff5e1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,42 L20,38 L40,40 L60,30 L80,32 L100,24 L120,26 L140,18 L160,20 L180,12 L200,8"
        stroke="#ff5e1a" strokeWidth="1.5" fill="none"
      />
      <path
        d="M0,42 L20,38 L40,40 L60,30 L80,32 L100,24 L120,26 L140,18 L160,20 L180,12 L200,8 L200,60 L0,60 Z"
        fill="url(#hm-grad)"
      />
    </svg>
  );
}

function StreakDots() {
  return (
    <div className="mt-5 grid grid-cols-12 gap-1">
      {Array.from({ length: 36 }).map((_, i) => {
        const intensity = Math.min(1, 0.2 + Math.random() * 0.9);
        return (
          <div
            key={i}
            className="aspect-square rounded-2xs"
            style={{
              backgroundColor: `rgba(255, 94, 26, ${intensity})`,
              boxShadow: intensity > 0.7 ? "0 0 6px rgba(255,94,26,0.5)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function HabitGrid() {
  const habits = ["Read", "Plunge", "Gym", "Outreach", "Journal", "No phone"];
  return (
    <div className="mt-3 space-y-2">
      {habits.map((h, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-16 font-mono text-[10px] uppercase tracking-wider text-ink-muted">{h}</div>
          <div className="flex gap-1 flex-1">
            {Array.from({ length: 7 }).map((_, d) => {
              const done = Math.random() > 0.25;
              return (
                <div
                  key={d}
                  className={
                    done
                      ? "h-2 flex-1 rounded-2xs bg-ember-500/80"
                      : "h-2 flex-1 rounded-2xs bg-surface-3"
                  }
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
