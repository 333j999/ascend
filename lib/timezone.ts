/**
 * Timezone helpers — all date math that asks "what day is it for the user?"
 * goes through here. Uses Intl.DateTimeFormat so no external library needed.
 *
 * The user's IANA timezone is stored on profile.timezone (e.g. "America/New_York",
 * "Europe/Amsterdam"). On the client we detect it via Intl. On the server we read it
 * from the profile and use it for any "today / this week" determinations.
 */

const ISO_FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>();
function isoFormatter(tz: string) {
  let f = ISO_FORMATTER_CACHE.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    ISO_FORMATTER_CACHE.set(tz, f);
  }
  return f;
}

/** Returns "YYYY-MM-DD" for the given date interpreted in the given IANA TZ. */
export function dateInTZ(date: Date, tz: string = detectBrowserTZ()): string {
  // en-CA gives YYYY-MM-DD natively
  try {
    return isoFormatter(tz).format(date);
  } catch {
    // bad TZ — fall back to local-machine date components
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

/** Today's date (YYYY-MM-DD) in the user's TZ. */
export function todayInTZ(tz: string = detectBrowserTZ()): string {
  return dateInTZ(new Date(), tz);
}

/**
 * Returns the local day-of-week index (0 = Monday, 6 = Sunday)
 * for the given date in the user's TZ.
 */
export function mondayDayIndexInTZ(date: Date, tz: string): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(date);
  // Map English weekday short names → Monday-based index
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  return map[wd] ?? 0;
}

/** Returns "YYYY-MM-DD" for the Monday of this week in the user's TZ. */
export function mondayInTZ(tz: string = detectBrowserTZ()): string {
  const now = new Date();
  const dayIdx = mondayDayIndexInTZ(now, tz);
  // Subtract dayIdx days; we walk back by 24h chunks which is good enough since
  // we always normalize back to a TZ-aware date string at the end.
  const monday = new Date(now.getTime() - dayIdx * 24 * 60 * 60 * 1000);
  return dateInTZ(monday, tz);
}

/** Returns the date that is `daysAgo` days before today, in the user's TZ. */
export function daysAgoInTZ(daysAgo: number, tz: string = detectBrowserTZ()): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return dateInTZ(d, tz);
}

/**
 * Detect the browser's IANA timezone.
 * Returns "UTC" if we're server-side or can't detect.
 */
export function detectBrowserTZ(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Returns the current hour (0-23) in the given TZ.
 * Used by the cron to figure out who should receive a 6am brief right now.
 */
export function hourInTZ(tz: string, at: Date = new Date()): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    }).formatToParts(at);
    const h = parts.find((p) => p.type === "hour")?.value ?? "0";
    return parseInt(h, 10);
  } catch {
    return at.getUTCHours();
  }
}

// Common timezones for the settings picker (curated, IANA names)
export const COMMON_TIMEZONES = [
  "UTC",
  // Americas
  "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Toronto", "America/Mexico_City", "America/Sao_Paulo",
  // Europe
  "Europe/London", "Europe/Lisbon", "Europe/Madrid", "Europe/Paris",
  "Europe/Amsterdam", "Europe/Berlin", "Europe/Rome", "Europe/Athens",
  "Europe/Istanbul", "Europe/Moscow",
  // Africa / Middle East
  "Africa/Cairo", "Africa/Johannesburg", "Asia/Dubai", "Asia/Riyadh",
  // Asia / Oceania
  "Asia/Kolkata", "Asia/Singapore", "Asia/Hong_Kong", "Asia/Shanghai",
  "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney", "Pacific/Auckland",
] as const;
