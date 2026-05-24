"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Banknote, Target, Dumbbell,
  BrainCircuit, ShieldCheck, LineChart, Settings,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/app-shell/sign-out-button";
import { cn } from "@/lib/utils";

const NAV = [
  { section: "Overview", items: [
    { href: "/app/dashboard", label: "Dashboard",  icon: LayoutDashboard, code: "01" },
  ]},
  { section: "Modules", items: [
    { href: "/app/finance",    label: "Financial",  icon: Banknote,      code: "02" },
    { href: "/app/missions",   label: "Missions",   icon: Target,        code: "03" },
    { href: "/app/gym",        label: "Gym",        icon: Dumbbell,      code: "04" },
    { href: "/app/mind",       label: "Mind",       icon: BrainCircuit,  code: "05" },
    { href: "/app/discipline", label: "Discipline", icon: ShieldCheck,   code: "06" },
    { href: "/app/analytics",  label: "Analytics",  icon: LineChart,     code: "07" },
  ]},
];

export function Sidebar({ streak = 0 }: { streak?: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-edge-subtle bg-surface-1/80 backdrop-blur-sm">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center border-b border-edge-subtle">
        <Link href="/app/dashboard">
          <Logo />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-7">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="label px-3 mb-2">{group.section}</div>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, code }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "group relative flex items-center gap-3 h-10 pl-3 pr-2 rounded-xs text-sm transition-colors duration-150",
                        active
                          ? "bg-ember-500/10 text-ember-100"
                          : "text-ink-secondary hover:bg-surface-3 hover:text-ink-primary",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-ember-500 rounded-full shadow-ember-glow-sm" />
                      )}
                      <Icon className={cn("size-4 shrink-0", active ? "text-ember-400" : "")} strokeWidth={1.6} />
                      <span className="flex-1">{label}</span>
                      <span className={cn(
                        "font-mono text-[10px] uppercase tracking-widest",
                        active ? "text-ember-400/70" : "text-ink-dim group-hover:text-ink-muted",
                      )}>
                        {code}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer card — real streak */}
      <div className="m-3 p-4 rounded-xs border border-edge-subtle bg-surface-2">
        <div className="flex items-center gap-2 mb-2">
          {streak > 0 ? (
            <>
              <span className="ember-dot" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400">Streak active</span>
            </>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">No streak</span>
          )}
        </div>
        <div className="stat text-2xl text-ink-primary tracking-tightest">{streak} {streak === 1 ? "day" : "days"}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mt-1">
          {streak > 0 ? "Don't break the chain." : "Start today."}
        </div>
      </div>

      <div className="border-t border-edge-subtle p-3 flex items-center justify-between">
        <Link href="/app/settings" className="btn-link inline-flex items-center gap-2">
          <Settings className="size-3.5" /> Settings
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
