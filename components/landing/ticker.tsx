const TICKER_ITEMS = [
  "DISCIPLINE", "CONSISTENCY", "MOMENTUM", "OWNERSHIP",
  "STRENGTH",   "FOCUS",       "CAPITAL",  "CLARITY",
  "STAMINA",    "STILLNESS",   "MASTERY",  "PATIENCE",
];

/**
 * Tactical bottom-of-hero ticker — auto-scrolls horizontally.
 * Pure CSS animation. Pauses on hover for accessibility.
 */
export function Ticker() {
  // duplicate the array so the loop is seamless
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-edge-subtle bg-surface-1/50">
      <div className="flex animate-ticker hover:[animation-play-state:paused] py-4">
        {items.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-6 shrink-0 font-mono text-[11px] uppercase tracking-widest text-ink-muted"
          >
            <span>{label}</span>
            <span className="text-ember-500/50">◆</span>
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-0 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-0 to-transparent pointer-events-none" />
    </div>
  );
}
