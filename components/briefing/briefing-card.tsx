import Link from "next/link";
import { Sunrise, Flame, Target as TargetIcon, ArrowRight, ShieldCheck } from "lucide-react";
import type { Briefing } from "@/lib/briefing";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function BriefingCard({
  briefing,
  firstName,
  compact = false,
}: {
  briefing: Briefing;
  firstName: string;
  compact?: boolean;
}) {
  const { greeting, yesterdayScore, todaysMissions, outstandingHabits, currentStreak, monthIncome, monthBurn, quote } = briefing;

  const missionsRemaining = todaysMissions.filter(m => !m.completed).length;

  return (
    <div className="relative card overflow-hidden p-0">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-x-12 -top-20 h-48 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,94,26,0.18), transparent 70%)" }}
      />

      <div className="relative p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xs border border-ember-500/30 bg-ember-500/10 grid place-items-center">
              <Sunrise className="size-4 text-ember-300" strokeWidth={1.8} />
            </div>
            <div>
              <div className="label">▢ Morning brief</div>
              <div className="font-display text-lg font-medium tracking-tight text-ink-primary">
                {greeting}, {firstName}.
              </div>
            </div>
          </div>
          {yesterdayScore !== null && (
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Yesterday</div>
              <div className="mt-1 stat text-2xl text-ember-300 tracking-tightest tabular-nums">{yesterdayScore}</div>
            </div>
          )}
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <Stat icon={<Flame className="size-4 text-ember-400" />} label="Streak"  value={`${currentStreak}d`} />
          <Stat icon={<TargetIcon className="size-4 text-ember-400" />} label="Missions" value={`${missionsRemaining} left`} />
          <Stat icon={<ShieldCheck className="size-4 text-ember-400" />} label="Habits left" value={`${outstandingHabits.length}`} />
          <Stat icon={null} label="Net · MTD" value={formatCurrency(monthIncome - monthBurn)} />
        </div>

        {!compact && outstandingHabits.length > 0 && (
          <div className="mb-5">
            <div className="label mb-2">Habits to claim today</div>
            <ul className="flex flex-wrap gap-1.5">
              {outstandingHabits.slice(0, 6).map((h) => (
                <li
                  key={h.id}
                  className="px-2.5 py-1 rounded-2xs border border-edge-subtle bg-surface-3 font-mono text-[10px] uppercase tracking-widest text-ink-secondary"
                >
                  {h.name}
                </li>
              ))}
              {outstandingHabits.length > 6 && (
                <li className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  +{outstandingHabits.length - 6} more
                </li>
              )}
            </ul>
          </div>
        )}

        {!compact && todaysMissions.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="label">Today&rsquo;s mission board</div>
              <Link href="/app/missions" className="btn-link inline-flex items-center gap-1">
                Plan <ArrowRight className="size-3" />
              </Link>
            </div>
            <ul className="space-y-1.5">
              {todaysMissions.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-center gap-2.5 text-sm">
                  <span className={
                    m.completed
                      ? "size-3.5 rounded-full bg-ember-500 shadow-ember-glow-sm"
                      : "size-3.5 rounded-full border border-edge"
                  } />
                  <span className={m.completed ? "text-ink-muted line-through" : "text-ink-primary"}>
                    {m.title}
                  </span>
                </li>
              ))}
              {todaysMissions.length > 4 && (
                <li className="pl-6 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  +{todaysMissions.length - 4} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Quote */}
        <blockquote className="pt-4 mt-2 border-t border-edge-subtle">
          <p className="font-display text-sm italic text-ink-secondary leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </p>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-ember-400">— {quote.author}</div>
        </blockquote>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xs border border-edge-subtle bg-surface-3/50">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
        {icon} {label}
      </div>
      <div className="mt-1.5 stat text-lg text-ink-primary tracking-tight">{value}</div>
    </div>
  );
}
