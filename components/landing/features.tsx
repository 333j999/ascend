import {
  Banknote, Target, Dumbbell, BrainCircuit,
  ShieldCheck, LineChart, Flame, Calendar,
} from "lucide-react";

const FEATURES = [
  {
    icon: Banknote,
    title: "Financial Command",
    desc: "Income, expenses, recurring bills, debt, and savings — engineered for clarity, not anxiety.",
    coords: "01 / 06",
  },
  {
    icon: Target,
    title: "Daily Missions",
    desc: "A morning execution dashboard. Priorities, habits, streaks — completed with intent.",
    coords: "02 / 06",
  },
  {
    icon: Dumbbell,
    title: "Physique Tracker",
    desc: "Log lifts, reps, weights, bodyweight, PRs, sleep. Watch your body become a graph.",
    coords: "03 / 06",
  },
  {
    icon: BrainCircuit,
    title: "Mind / Journal",
    desc: "Wins, losses, reflections. Minimal friction. Maximum signal.",
    coords: "04 / 06",
  },
  {
    icon: ShieldCheck,
    title: "Discipline Score",
    desc: "A single number that summarizes the man you were today. Trend it. Defend it.",
    coords: "05 / 06",
  },
  {
    icon: LineChart,
    title: "Life Analytics",
    desc: "Convert the chaos of your week into clean, measurable data. Adjust. Compound.",
    coords: "06 / 06",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="label">▢ The System</div>
            <h2 className="mt-3 font-display font-medium tracking-tightest text-ink-primary"
                style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.02 }}>
              Six modules. <span className="italic font-light text-ember-300">One operator.</span>
            </h2>
          </div>
          <p className="max-w-md text-ink-secondary leading-relaxed">
            ASCEND is not a productivity app. It&rsquo;s a personal command center
            — engineered for men who treat their life like a business.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-edge-subtle border border-edge-subtle">
          {FEATURES.map(({ icon: Icon, title, desc, coords }) => (
            <article
              key={title}
              className="group relative bg-surface-1 p-8 transition-colors duration-300 hover:bg-surface-2"
            >
              {/* coords corner */}
              <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                {coords}
              </div>

              {/* icon */}
              <div className="relative inline-flex">
                <div className="size-11 rounded-xs border border-edge bg-surface-2 grid place-items-center
                                group-hover:border-ember-500/40 group-hover:bg-ember-500/5
                                transition-colors duration-300">
                  <Icon className="size-5 text-ink-secondary group-hover:text-ember-400 transition-colors" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="mt-6 font-display text-lg font-medium tracking-tight text-ink-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
                {desc}
              </p>

              {/* underline tick on hover */}
              <div className="mt-6 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted group-hover:text-ember-400 transition-colors">
                <Flame className="size-3" /> Active module
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */

export function MetricsBand() {
  // Mid-page proof band — tactical numbers
  const stats = [
    { label: "Daily operators", value: "2,400+" },
    { label: "Days tracked",     value: "186K" },
    { label: "Avg. streak",      value: "31d" },
    { label: "Avg. discipline",  value: "+24%" },
  ];
  return (
    <section className="relative border-y border-edge-subtle bg-surface-1/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-1.5 lg:border-l lg:first:border-0 lg:border-edge-subtle lg:pl-6">
            <div className="stat text-3xl tracking-tightest text-ink-primary">{s.value}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */

export function ManifestoSection() {
  const tenets = [
    { n: "01", t: "Track what you cannot lie about.", d: "Numbers are honest. Feelings are not. Build your week from data — not from how Monday made you feel." },
    { n: "02", t: "Defend the morning. The morning defends the day.", d: "First three hours decide everything else. Protect them like a perimeter." },
    { n: "03", t: "Suffer voluntarily, every day.", d: "Cold. Iron. Reps. The men who pick their pain don't have to wait for it to find them." },
    { n: "04", t: "Compound, don't sprint.", d: "Six months of 70% is better than two weeks of 110% and a collapse. Show up. Mark the box. Repeat." },
  ];

  return (
    <section id="manifesto" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12">

          <div className="lg:col-span-5">
            <div className="label">▢ The Manifesto</div>
            <h2 className="mt-3 font-display font-medium tracking-tightest text-ink-primary"
                style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.02 }}>
              Discipline is the only freedom that compounds.
            </h2>
            <p className="mt-6 text-ink-secondary leading-relaxed max-w-lg">
              ASCEND is built on four operating principles. They&rsquo;re not motivational.
              They are the geometry of a built life.
            </p>
            <div className="mt-8 font-mono text-[10px] uppercase tracking-widest text-ember-400 inline-flex items-center gap-2">
              <span className="ember-dot" /> Engraved on the inside of the app
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {tenets.map(({ n, t, d }) => (
              <div key={n} className="relative card p-7 bg-surface-1/60 border-edge-subtle hover:border-edge transition-colors group">
                <div className="absolute -left-3 top-7 hidden lg:block font-mono text-[10px] uppercase tracking-widest text-ember-500/50 rotate-90 origin-left">
                  Tenet
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-2xl text-ember-400/80 tabular-nums">{n}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium tracking-tight text-ink-primary">{t}</h3>
                    <p className="mt-2 text-ink-secondary text-sm leading-relaxed">{d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
