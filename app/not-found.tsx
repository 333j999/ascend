import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>
        <div className="label mt-12">▢ Off-grid</div>
        <h1 className="mt-3 font-display text-7xl font-medium tracking-tightest text-ink-primary">
          404
        </h1>
        <p className="mt-4 text-ink-secondary leading-relaxed">
          This terminal does not exist. Maybe it was deprecated.
          Maybe it never was. Either way — back to base.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="primary" href="/">Return home</Button>
          <Button variant="ghost"   href="/app/dashboard">Open dashboard</Button>
        </div>
        <div className="mt-12 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          Error code · 404 · Path unmapped
        </div>
      </div>
    </div>
  );
}
