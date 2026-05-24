import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

export function formatDate(date: Date | string, format: "short" | "long" | "time" = "short") {
  const d = typeof date === "string" ? new Date(date) : date;
  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  if (format === "time") {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Convert a Date to a YYYY-MM-DD string using the LOCAL timezone
 * (instead of UTC like .toISOString().slice(0,10) does).
 *
 * Why this exists: when a user clicks "Sunday" at 11pm local in NL (UTC+1),
 * `.toISOString()` returns the UTC date which is Sunday 22:00 → "Sunday" still.
 * But if it's 1am local Monday, UTC is still Sunday → off by one. Storing
 * habit logs / discipline days with UTC dates breaks the user's mental model.
 *
 * This helper uses the local Y/M/D components so the stored date matches
 * what the user sees on their calendar.
 */
export function toLocalISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function rangeLabel(value: number) {
  if (value >= 90) return "ELITE";
  if (value >= 75) return "DISCIPLINED";
  if (value >= 60) return "STEADY";
  if (value >= 40) return "DRIFTING";
  return "BROKEN";
}
