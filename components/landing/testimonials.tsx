const QUOTES = [
  {
    body: "I stopped feeling lost on Tuesdays. ASCEND turned my week into a flight plan. I can see my own trajectory now.",
    name: "Marcus V.",
    role: "Founder · 24",
  },
  {
    body: "The discipline score is the only number I check before I sleep. If it's red, I know exactly what I owe tomorrow.",
    name: "Devon K.",
    role: "Trader · 28",
  },
  {
    body: "I tried Notion templates, journals, finance apps. They all asked me to do the integration. ASCEND is the integration.",
    name: "Andre M.",
    role: "Engineer · 26",
  },
  {
    body: "Finally an app that doesn't look like it was designed for a yoga studio. It feels like running a fucking spaceship.",
    name: "Theo R.",
    role: "Operator · 22",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="text-center mb-14">
          <div className="label">▢ Operator Reports</div>
          <h2 className="mt-3 font-display font-medium tracking-tightest text-ink-primary mx-auto max-w-3xl"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.05 }}>
            Built by men. Used by men.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className="card p-7 bg-surface-1/60 hover:border-edge hover:bg-surface-2 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400">
                  Field Report · 0{i + 1}
                </span>
                <span className="h-px flex-1 bg-edge-subtle" />
              </div>
              <blockquote className="font-display text-lg leading-relaxed tracking-tight text-ink-primary">
                &ldquo;{q.body}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-surface-4 to-surface-3 border border-edge-subtle grid place-items-center font-mono text-xs text-ink-secondary">
                  {q.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <div className="text-sm text-ink-primary font-medium">{q.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
