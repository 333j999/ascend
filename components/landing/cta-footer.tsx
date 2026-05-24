import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export function FinalCTA() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* ember glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-20 h-[480px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,94,26,0.25), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 text-center">
        <div className="label">▢ Final Brief</div>
        <h2 className="mt-4 mx-auto max-w-3xl font-display font-medium tracking-tightest text-ink-primary"
            style={{ fontSize: "clamp(40px, 6.5vw, 78px)", lineHeight: 1.0 }}>
          The man you want to be{" "}
          <span className="italic font-light text-ember-300">is built daily.</span>
        </h2>
        <p className="mt-7 mx-auto max-w-xl text-ink-secondary text-lg leading-relaxed">
          Open ASCEND. Mark today&rsquo;s box. Repeat for the next thousand days.
          The trajectory does the rest.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="lg" href="/signup">
            Begin <ArrowRight className="size-4" />
          </Button>
          <Button variant="ghost" size="lg" href="/login">Sign in</Button>
        </div>
        <div className="mt-8 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          No credit card. No fluff. Just signal.
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-edge-subtle bg-surface-1/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-secondary leading-relaxed">
            ASCEND is a personal operating system for ambitious men.
            Built in NYC. Engineered for the long game.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            <span className="ember-dot" /> v1.0.0 · operational
          </div>
        </div>

        <FooterCol label="Product" links={["Features","Preview","Pricing","Changelog"]} />
        <FooterCol label="Operators" links={["Manifesto","Field Reports","Community","Brief"]} />
        <FooterCol label="Company" links={["About","Contact","Privacy","Terms"]} />
      </div>
      <div className="border-t border-edge-subtle">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          <div>© {new Date().getFullYear()} ASCEND Systems · All rights reserved</div>
          <div className="inline-flex items-center gap-1.5"><span className="signal-dot-green" /> All systems operational</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ label, links }: { label: string; links: string[] }) {
  return (
    <div>
      <div className="label mb-4">{label}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-ink-secondary hover:text-ember-400 transition-colors">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
