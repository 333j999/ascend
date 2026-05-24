"use client";

import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";
import { QuickLogButton } from "@/components/app-shell/quick-log-button";

type Props = {
  onMenuOpen?: () => void;
  user: { name: string; initials: string; avatarUrl?: string | null };
};

export function Topbar({ onMenuOpen, user }: Props) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
      const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
      setNow(`${date} · ${time}`);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-edge-subtle glass">
      <div className="h-full px-4 lg:px-6 flex items-center gap-4">

        <button
          className="lg:hidden size-9 grid place-items-center rounded-xs border border-edge-subtle bg-surface-2 text-ink-secondary"
          onClick={onMenuOpen}
        >
          <Menu className="size-4" />
        </button>

        {/* Search — placeholder for now, focusable but no-op */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md h-10 px-3 rounded-xs bg-surface-2 border border-edge-subtle">
          <Search className="size-3.5 text-ink-muted" />
          <input
            className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-dim focus:outline-none"
            placeholder="Search coming soon…"
            disabled
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted border border-edge-subtle px-1.5 py-0.5 rounded-2xs">
            ⌘ K
          </span>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Status pills */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="signal-dot-green" /> Online
          </span>
          <span>{now}</span>
        </div>

        {/* Quick Log — fully wired */}
        <QuickLogButton />

        {/* User */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-edge-subtle h-10">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="size-8 rounded-full border border-edge-subtle"
            />
          ) : (
            <div className="size-8 rounded-full bg-gradient-to-br from-surface-4 to-surface-3 border border-edge-subtle grid place-items-center font-mono text-xs text-ember-300">
              {user.initials}
            </div>
          )}
          <div className="hidden md:block leading-tight">
            <div className="text-sm text-ink-primary font-medium">{user.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
