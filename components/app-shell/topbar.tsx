"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-data";

export function Topbar({ onMenuOpen }: { onMenuOpen?: () => void }) {
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

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md h-10 px-3 rounded-xs bg-surface-2 border border-edge-subtle">
          <Search className="size-3.5 text-ink-muted" />
          <input
            className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-dim focus:outline-none"
            placeholder="Jump to anything…"
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

        {/* Actions */}
        <button className="btn-ghost h-9 px-3">
          <Plus className="size-3.5" /> Log
        </button>

        <button className="relative size-9 grid place-items-center rounded-xs border border-edge-subtle bg-surface-2 text-ink-secondary hover:border-edge hover:text-ink-primary transition-colors">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-ember-500 shadow-ember-glow-sm" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-edge-subtle h-10">
          <div className="size-8 rounded-full bg-gradient-to-br from-surface-4 to-surface-3 border border-edge-subtle grid place-items-center font-mono text-xs text-ember-300">
            {MOCK_USER.name.split(" ").map(w => w[0]).join("")}
          </div>
          <div className="hidden md:block leading-tight">
            <div className="text-sm text-ink-primary font-medium">{MOCK_USER.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
