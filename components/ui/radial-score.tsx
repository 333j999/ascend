"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, clamp, rangeLabel } from "@/lib/utils";

type Props = {
  value: number;            // 0-100
  size?: number;            // px diameter
  stroke?: number;
  label?: string;
  sublabel?: string;
  className?: string;
};

/**
 * Radial ring for the discipline / completion score.
 * Renders with framer-motion stroke-dashoffset animation on mount.
 */
export function RadialScore({
  value, size = 220, stroke = 10, label = "Discipline",
  sublabel, className,
}: Props) {
  const v = clamp(value, 0, 100);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (v / 100) * circ;

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size} height={size}
        className="-rotate-90"
        style={{ filter: "drop-shadow(0 0 24px rgba(255, 94, 26, 0.25))" }}
      >
        <defs>
          <linearGradient id="ember-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7434" />
            <stop offset="100%" stopColor="#e74508" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#1f1f24" strokeWidth={stroke} fill="none"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="url(#ember-grad)" strokeWidth={stroke}
          strokeLinecap="round" fill="none"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Tick marks every 10% */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * 360;
          const isMajor = i % 2 === 0;
          const inner = radius - stroke / 2 - 8;
          const outer = radius - stroke / 2 - (isMajor ? 14 : 11);
          const rad = (angle * Math.PI) / 180;
          const x1 = size / 2 + Math.cos(rad) * inner;
          const y1 = size / 2 + Math.sin(rad) * inner;
          const x2 = size / 2 + Math.cos(rad) * outer;
          const y2 = size / 2 + Math.sin(rad) * outer;
          return (
            <line
              key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isMajor ? "#2a2a31" : "#1f1f24"}
              strokeWidth={isMajor ? 1.2 : 0.8}
            />
          );
        })}
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="label">{label}</div>
          <div className="mt-2 stat text-6xl text-ink-primary tracking-tighter tabular-nums">
            {v}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ember-400">
            {sublabel ?? rangeLabel(v)}
          </div>
        </div>
      </div>
    </div>
  );
}
