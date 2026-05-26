import { createClient } from "@/lib/supabase/server";
import { todayInTZ, daysAgoInTZ } from "@/lib/timezone";
import {
  getTransactions, getMissions, getHabits, getWorkouts,
  getBodyMetrics, getDisciplineDays, getJournalEntries,
} from "@/lib/supabase/queries";
import { computeDashboardSummary } from "@/lib/discipline";
import type { Habit, Mission } from "@/types";

export type Briefing = {
  date: string;            // today's iso in user's TZ
  greeting: string;
  yesterdayScore: number | null;
  todaysMissions: Mission[];
  outstandingHabits: Habit[];    // good habits not yet done today
  badHabitsHit: Habit[];         // bad habits checked off today
  currentStreak: number;
  longestStreak: number;
  monthIncome: number;
  monthBurn: number;
  netToday: number;              // today's transactions delta
  quote: { text: string; author: string };
};

const QUOTES = [
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Hard choices, easy life. Easy choices, hard life.", author: "Jerzy Gregorek" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Jim Rohn" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Show me your calendar and I'll show you your priorities.", author: "Stephen Covey" },
  { text: "Don't watch the clock. Do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Action is the antidote to despair.", author: "Joan Baez" },
];

/**
 * Pull a user's daily brief — used by the in-app view AND the cron email.
 * All date logic is scoped to the user's IANA timezone.
 */
export async function getBriefing(userId: string, tz: string): Promise<Briefing> {
  const today = todayInTZ(tz);
  const yesterday = daysAgoInTZ(1, tz);

  const [transactions, missions, habits, workouts, bodyMetrics, discipline, journal] = await Promise.all([
    getTransactions(userId, 200),
    getMissions(userId, tz),
    getHabits(userId, tz),
    getWorkouts(userId, 30),
    getBodyMetrics(userId, 30),
    getDisciplineDays(userId, 90, tz),
    getJournalEntries(userId, 5),
  ]);

  const summary = computeDashboardSummary({
    transactions, missions, habits, workouts, bodyMetrics, discipline, tz,
  });

  // dayIndex in user's TZ to pick today's column from completions_this_week
  const dayIndex = mondayDayIndexLocal(tz);
  const goodHabits = habits.filter(h => h.kind === "good");
  const badHabits = habits.filter(h => h.kind === "bad");
  const outstandingHabits = goodHabits.filter(h => !h.completions_this_week[dayIndex]);
  const badHabitsHit = badHabits.filter(h => h.completions_this_week[dayIndex]);

  // Yesterday's score from discipline_days (cron writes this nightly later)
  const yesterdayRow = discipline.find(d => d.date === yesterday);
  const yesterdayScore = yesterdayRow?.score ?? null;

  // Month numbers
  const monthStart = today.slice(0, 7) + "-01";
  const monthTxns = transactions.filter(t => t.date >= monthStart);
  const monthIncome = monthTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const monthBurn = monthTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const todayTxns = transactions.filter(t => t.date === today);
  const netToday = todayTxns.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  // Time-of-day greeting in user's TZ
  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hour12: false }).format(new Date()),
    10,
  );
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Deterministic daily quote
  const quote = QUOTES[(parseDateSeed(today) % QUOTES.length + QUOTES.length) % QUOTES.length];

  return {
    date: today,
    greeting,
    yesterdayScore,
    todaysMissions: missions,
    outstandingHabits,
    badHabitsHit,
    currentStreak: summary.currentStreak,
    longestStreak: summary.longestStreak,
    monthIncome,
    monthBurn,
    netToday,
    quote,
  };
}

function parseDateSeed(iso: string): number {
  // Stable hash of YYYY-MM-DD → integer
  return iso.split("-").reduce((acc, part) => acc * 100 + parseInt(part, 10), 0);
}

function mondayDayIndexLocal(tz: string): number {
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(new Date());
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  return map[wd] ?? 0;
}

/**
 * Fetch all users opted in to receive the morning brief.
 * Used by the cron to figure out who to email this hour.
 */
export async function getEmailBriefRecipients() {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, timezone, email_brief_enabled, name")
    .eq("email_brief_enabled", true);
  return data ?? [];
}
