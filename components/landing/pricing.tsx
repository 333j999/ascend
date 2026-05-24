import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Recon",
    price: "$0",
    cadence: "forever",
    description: "Free for the first 30 days of your transformation.",
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
    features: [
      "All 6 modules",
      "60-day data retention",
      "Daily discipline score",
      "Mobile responsive",
    ],
  },
  {
    name: "Operator",
    price: "$12",
    cadence: "per month",
    description: "Built for the man committed to the next 5 years of his life.",
    cta: "Become an Operator",
    href: "/signup?plan=operator",
    highlighted: true,
    features: [
      "Everything in Recon",
      "Unlimited history",
      "Weekly briefing reports",
      "Spotify integration",
      "AI insights (coming)",
      "Priority support",
    ],
  },
  {
    name: "Command",
    price: "$29",
    cadence: "per month",
    description: "For founders, athletes, and high performers who want it all.",
    cta: "Contact",
    href: "/signup?plan=command",
    highlighted: false,
    features: [
      "Everything in Operator",
      "1-on-1 onboarding call",
      "Custom modules",
      "API access",
      "Coach/mentor view",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="text-center mb-14">
          <div className="label">▢ Tactical Tiers</div>
          <h2 className="mt-3 font-display font-medium tracking-tightest text-ink-primary mx-auto max-w-3xl"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.05 }}>
            Pricing for men who track ROI on every dollar.
          </h2>
          <p className="mt-5 text-ink-secondary max-w-xl mx-auto">
            One coffee a month gets you a system. Forever, if you want.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative card p-8 flex flex-col",
                p.highlighted
                  ? "bg-surface-2 border-ember-500/40 shadow-ember-glow"
                  : "bg-surface-1/60 border-edge-subtle",
              )}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-2xs bg-ember-500 text-surface-0 font-mono text-[10px] uppercase tracking-widest font-medium">
                  Most chosen
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-medium tracking-tight text-ink-primary">
                  {p.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  Tier 0{PLANS.indexOf(p) + 1}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="stat text-5xl tracking-tightest text-ink-primary">{p.price}</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  / {p.cadence}
                </span>
              </div>

              <p className="mt-4 text-sm text-ink-secondary leading-relaxed">{p.description}</p>

              <div className="divider-x my-7" />

              <ul className="space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-ink-primary">
                    <span className="mt-0.5 size-4 rounded-2xs grid place-items-center bg-ember-500/10 text-ember-400 shrink-0">
                      <Check className="size-3" strokeWidth={2.4} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  variant={p.highlighted ? "primary" : "ghost"}
                  href={p.href}
                  className="w-full"
                >
                  {p.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
