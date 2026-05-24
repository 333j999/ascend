"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote, Target, Dumbbell, BrainCircuit, ShieldCheck, LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "money",     icon: Banknote,     label: "Financial",  desc: "Income · Expenses · Debt · Savings" },
  { id: "missions",  icon: Target,       label: "Missions",   desc: "Daily execution · Habits · Streaks" },
  { id: "gym",       icon: Dumbbell,     label: "Gym",        desc: "Workouts · PRs · Body composition" },
  { id: "mind",      icon: BrainCircuit, label: "Mind",       desc: "Journal · Mood · Reflections" },
  { id: "discipline", icon: ShieldCheck, label: "Discipline", desc: "Score · Trend · Weekly report" },
  { id: "analytics", icon: LineChart,    label: "Analytics",  desc: "Life · quantified" },
] as const;

export function PreviewSection() {
  const [active, setActive] = useState<typeof VIEWS[number]["id"]>("missions");
  const current = VIEWS.find((v) => v.id === active)!;

  return (
    <section id="preview" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="text-center mb-14">
          <div className="label">▢ Inside the Cockpit</div>
          <h2 className="mt-3 font-display font-medium tracking-tightest text-ink-primary mx-auto max-w-3xl"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.02 }}>
            Every module. <span className="italic font-light text-ember-300">One language.</span>
          </h2>
        </div>

        {/* tab row */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {VIEWS.map(({ id, icon: Icon, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  "inline-flex items-center gap-2 h-10 px-4 rounded-xs font-mono text-[11px] uppercase tracking-widest font-medium",
                  "border transition-all duration-200",
                  isActive
                    ? "border-ember-500/50 bg-ember-500/10 text-ember-300 shadow-ember-glow-sm"
                    : "border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge hover:text-ink-primary",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.8} />
                {label}
              </button>
            );
          })}
        </div>

        {/* description */}
        <div className="text-center font-mono text-[11px] uppercase tracking-widest text-ink-muted mb-6">
          {current.desc}
        </div>

        {/* preview frame */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-x-8 -bottom-10 h-32 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,94,26,0.25), transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-5xl card p-0 overflow-hidden bg-surface-1">
            <div className="flex items-center justify-between px-4 h-10 border-b border-edge-subtle bg-surface-2/50">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-surface-4" />
                <span className="size-2 rounded-full bg-surface-4" />
                <span className="size-2 rounded-full bg-surface-4" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                ascend.app / {current.id}
              </div>
              <div className="size-2 rounded-full bg-signal-green/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 lg:p-8"
              >
                {active === "money"      && <MoneyPreview />}
                {active === "missions"   && <MissionsPreview />}
                {active === "gym"        && <GymPreview />}
                {active === "mind"       && <MindPreview />}
                {active === "discipline" && <DisciplinePreview />}
                {active === "analytics"  && <AnalyticsPreview />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Per-module compact previews ────────────────────────────── */

function MoneyPreview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-4 card bg-surface-2 p-5">
        <div className="label">Net Worth</div>
        <div className="mt-3 stat text-3xl text-ink-primary">$142,840</div>
        <div className="mt-1 text-[11px] font-mono text-signal-green">+6.0% MTD</div>
      </div>
      <div className="col-span-12 md:col-span-4 card bg-surface-2 p-5">
        <div className="label">Income · May</div>
        <div className="mt-3 stat text-3xl text-ink-primary">$18,420</div>
        <div className="mt-1 text-[11px] font-mono text-signal-green">+4.6%</div>
      </div>
      <div className="col-span-12 md:col-span-4 card bg-surface-2 p-5">
        <div className="label">Burn · May</div>
        <div className="mt-3 stat text-3xl text-ink-primary">$6,310</div>
        <div className="mt-1 text-[11px] font-mono text-signal-red">+1.7%</div>
      </div>
      <div className="col-span-12 card bg-surface-2 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="label">Income vs Burn — 7 months</div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-500" /> Income</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-edge" /> Burn</span>
          </div>
        </div>
        <BarsDouble />
      </div>
    </div>
  );
}

function MissionsPreview() {
  const items = [
    { txt: "Send 20 cold outreach messages", done: true },
    { txt: "Heavy pull · deadlifts", done: true },
    { txt: "Review yesterday's trades", done: true },
    { txt: "Read 30 pages · Meditations", done: true },
    { txt: "Cold plunge · 4 min", done: false },
    { txt: "Plan tomorrow's first 3 hours", done: false },
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-7 card bg-surface-2 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="label">Today · {new Date().toLocaleDateString("en-US", { weekday: "long" })}</div>
          <div className="font-mono text-[11px] text-ink-muted">4 / 6</div>
        </div>
        <ul className="space-y-2.5">
          {items.map((m, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className={m.done ? "size-4 rounded-full bg-ember-500 shadow-ember-glow-sm grid place-items-center" : "size-4 rounded-full border border-edge"}>
                {m.done && (
                  <svg viewBox="0 0 12 12" className="size-2.5 text-surface-0">
                    <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={m.done ? "text-ink-muted line-through" : "text-ink-primary"}>{m.txt}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-12 md:col-span-5 card bg-surface-2 p-5">
        <div className="label">Streaks · Active</div>
        <div className="mt-4 space-y-3">
          {[
            { name: "No screens before 10am", d: 47 },
            { name: "Cold plunge", d: 12 },
            { name: "Gym", d: 8 },
            { name: "Read 30 pages", d: 23 },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-ink-primary">{s.name}</span>
              <span className="stat text-ember-400 text-sm tracking-tight">{s.d}d</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GymPreview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-5 card bg-surface-2 p-5">
        <div className="label">Latest · Pull</div>
        <div className="mt-3 font-display text-lg text-ink-primary">Deadlift · 200 kg × 1</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-signal-green mt-1">NEW PR</div>
        <div className="mt-5 space-y-1.5 font-mono text-xs text-ink-secondary tabular-nums">
          {[
            "Deadlift     5×140   5×160   3×180   1×200",
            "Pull-up      8×20    6×25    5×30",
            "Row          10×80   8×90    6×100",
          ].map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
      <div className="col-span-12 md:col-span-7 card bg-surface-2 p-5">
        <div className="label">Bodyweight · 5 months</div>
        <BodyChart />
      </div>
    </div>
  );
}

function MindPreview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-7 card bg-surface-2 p-5">
        <div className="flex items-center justify-between">
          <div className="label">Journal · Today</div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400">Mood · Elite</span>
        </div>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-secondary">
          <p><span className="text-ember-400 font-mono text-[10px] uppercase tracking-widest mr-2">Win</span> Hit 200kg deadlift PR. Cleanest pull in months.</p>
          <p><span className="text-signal-red font-mono text-[10px] uppercase tracking-widest mr-2">Loss</span> Skipped cold plunge after gym.</p>
          <p><span className="text-ink-muted font-mono text-[10px] uppercase tracking-widest mr-2">Reflection</span> Strength is back. Stop bargaining with yourself on the small reps.</p>
        </div>
      </div>
      <div className="col-span-12 md:col-span-5 card bg-surface-2 p-5">
        <div className="label">Mood · 14 days</div>
        <div className="mt-4 flex items-end gap-1.5 h-32">
          {[3,4,4,3,2,4,5,5,4,5,4,3,4,5].map((v, i) => {
            const h = (v / 5) * 100;
            return (
              <div key={i} className="flex-1 rounded-2xs bg-gradient-to-t from-ember-700/40 to-ember-400" style={{ height: `${h}%` }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DisciplinePreview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-5 card bg-surface-2 p-5 flex flex-col items-center justify-center">
        <div className="label">Today&rsquo;s Score</div>
        <div className="relative mt-3">
          <svg width={180} height={180} className="-rotate-90">
            <circle cx="90" cy="90" r="80" stroke="#1f1f24" strokeWidth="10" fill="none" />
            <circle cx="90" cy="90" r="80" stroke="#ff5e1a" strokeWidth="10" fill="none"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - 0.87)}
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 12px rgba(255,94,26,0.5))" }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="stat text-5xl text-ink-primary">87</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ember-400 mt-1">Disciplined</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-7 card bg-surface-2 p-5">
        <div className="label">30-day trend</div>
        <DisciplineLine />
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {[
        { k: "Net Worth Growth", v: "+54%", h: "12mo" },
        { k: "Streak Days",      v: "47",   h: "current" },
        { k: "Workouts MTD",     v: "18",   h: "+5 vs Apr" },
        { k: "Avg. Discipline",  v: "81",   h: "30d mean" },
      ].map((s, i) => (
        <div key={i} className="col-span-6 md:col-span-3 card bg-surface-2 p-5">
          <div className="label">{s.k}</div>
          <div className="mt-3 stat text-2xl text-ink-primary">{s.v}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted">{s.h}</div>
        </div>
      ))}
      <div className="col-span-12 card bg-surface-2 p-5">
        <div className="label">Net worth · 12-month trajectory</div>
        <NetWorthChart />
      </div>
    </div>
  );
}

/* ─── Tiny SVG charts ────────────────────────────────────────── */

function BarsDouble() {
  const data = [
    { i: 12400, e: 5800 }, { i: 14200, e: 6100 }, { i: 15600, e: 5900 },
    { i: 13800, e: 6400 }, { i: 16900, e: 5700 }, { i: 17600, e: 6200 }, { i: 18420, e: 6310 },
  ];
  const max = Math.max(...data.map(d => d.i));
  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex items-end gap-1">
          <div className="flex-1 bg-gradient-to-t from-ember-700/60 to-ember-400 rounded-2xs"
               style={{ height: `${(d.i / max) * 100}%` }} />
          <div className="flex-1 bg-edge rounded-2xs"
               style={{ height: `${(d.e / max) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

function BodyChart() {
  const pts = [91.2, 90.4, 89.5, 88.8, 88.2, 87.6];
  const min = 86, max = 92;
  const norm = (v: number) => 1 - (v - min) / (max - min);
  const w = 480, h = 130;
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${norm(p) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bw-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff5e1a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff5e1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#bw-grad)" />
      <path d={d} stroke="#ff5e1a" strokeWidth="1.8" fill="none" />
      {pts.map((p, i) => (
        <circle key={i} cx={(i / (pts.length - 1)) * w} cy={norm(p) * h} r="3" fill="#ff5e1a" />
      ))}
    </svg>
  );
}

function DisciplineLine() {
  const pts = Array.from({ length: 30 }).map((_, i) => 55 + Math.sin(i / 3) * 15 + (i / 30) * 20);
  const w = 480, h = 130;
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${(1 - p / 100) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="d-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff5e1a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff5e1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#d-grad)" />
      <path d={d} stroke="#ff5e1a" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function NetWorthChart() {
  const pts = [92400, 101200, 110600, 116200, 125400, 134800, 142840];
  const min = 90000, max = 145000;
  const norm = (v: number) => 1 - (v - min) / (max - min);
  const w = 800, h = 160;
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${norm(p) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="nw-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff5e1a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff5e1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#nw-grad)" />
      <path d={d} stroke="#ff5e1a" strokeWidth="2" fill="none" />
    </svg>
  );
}
