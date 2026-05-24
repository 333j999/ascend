import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2">
      {/* Background atmosphere on full screen */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 30% 40%, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* Left — form */}
      <div className="relative flex flex-col px-6 lg:px-12 py-8">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          © {new Date().getFullYear()} ASCEND
        </div>
      </div>

      {/* Right — tactical poster (hidden on mobile) */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 border-l border-edge-subtle bg-surface-1/40 overflow-hidden">
        {/* Background ember */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 100% 0%, rgba(255,94,26,0.18), transparent 60%), radial-gradient(ellipse 50% 80% at 0% 100%, rgba(255,94,26,0.08), transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          <span className="ember-dot" /> Operator terminal · auth grid
        </div>

        <div className="relative max-w-md">
          <div className="label">▢ Mantra</div>
          <h2 className="mt-4 font-display font-medium tracking-tightest text-ink-primary"
              style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.02 }}>
            Discipline is the only freedom <span className="italic font-light text-ember-300">that compounds.</span>
          </h2>
          <p className="mt-6 text-ink-secondary leading-relaxed">
            ASCEND is where you stop performing for an audience and start
            building for an outcome. Every metric on this dashboard is a
            promise you make to your future self.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          <div>
            <div className="stat text-3xl text-ink-primary mb-1">2.4K</div>
            <div>Active operators</div>
          </div>
          <div>
            <div className="stat text-3xl text-ink-primary mb-1">87</div>
            <div>Avg. discipline</div>
          </div>
          <div>
            <div className="stat text-3xl text-ember-400 mb-1">+34%</div>
            <div>Net worth growth</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
