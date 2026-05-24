import type {
  Transaction, Mission, Habit, Workout, BodyMetric, DisciplineDay,
} from "@/types";
import { toLocalISODate } from "@/lib/utils";

export type DashboardSummary = {
  hasAnyData: boolean;
  disciplineScore: number;        // 0-100, today's snapshot
  disciplineAvg: number;          // avg over the last 30 days of available data
  habitsPct: number;
  missionsPct: number;
  sleepHours: number | null;
  currentStreak: number;
  longestStreak: number;
};

/**
 * Compute a single discipline score from raw activity.
 * Weights:
 *   habits     30
 *   missions   25
 *   gym        15  (any workout in the last 24h)
 *   sleep      15  (≥ 7h yesterday)
 *   finance    10  (transaction logged today)
 *   journal     5  (mood logged today — derived from discipline_days)
 */
export function computeDashboardSummary({
  transactions, missions, habits, workouts, bodyMetrics, discipline,
}: {
  transactions: Transaction[];
  missions: Mission[];
  habits: Habit[];
  workouts: Workout[];
  bodyMetrics: BodyMetric[];
  discipline: DisciplineDay[];
}): DashboardSummary {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Missions
  const missionsPct = missions.length
    ? Math.round((missions.filter(m => m.completed).length / missions.length) * 100)
    : 0;

  // Habits — split good vs bad
  // Good habits: % completed today (positive contribution)
  // Bad habits: each one marked today = penalty
  const dayIndex = (today.getDay() + 6) % 7; // 0 = Monday
  const goodHabits = habits.filter(h => h.kind === "good");
  const badHabits = habits.filter(h => h.kind === "bad");
  const goodToday = goodHabits.filter(h => h.completions_this_week[dayIndex]).length;
  const badToday  = badHabits.filter(h => h.completions_this_week[dayIndex]).length;

  // Combined habits "score": good completion ratio, minus a flat 10-point hit per
  // bad habit triggered today.
  const goodPct = goodHabits.length ? (goodToday / goodHabits.length) * 100 : 0;
  const badPenalty = badToday * 10;
  const habitsPct = Math.max(0, Math.round(goodPct - badPenalty));

  // Gym — any workout in last 24h
  const gymToday = workouts.some(w => {
    const d = new Date(w.date); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  // Finance — any transaction logged today
  const financeToday = transactions.some(t => {
    const d = new Date(t.date); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  // Sleep — most recent body metric
  const latestBody = bodyMetrics.at(-1);
  const sleepHours = latestBody?.sleep_hours ?? null;
  const sleepOk = sleepHours !== null && sleepHours >= 7;

  // Compose today's score
  let score = 0;
  score += (habitsPct / 100) * 30;
  score += (missionsPct / 100) * 25;
  if (gymToday) score += 15;
  if (sleepOk) score += 15;
  if (financeToday) score += 10;
  // 5 pts journal — proxy: any non-zero discipline_days entry today
  const todayIso = toLocalISODate(today);
  const todayRow = discipline.find(d => d.date === todayIso);
  if (todayRow) score += 5;

  const disciplineScore = Math.round(Math.max(0, Math.min(100, score)));

  // 30d average from stored discipline_days (falls back to today's score)
  const last30 = discipline.slice(-30);
  const disciplineAvg = last30.length
    ? Math.round(last30.reduce((s, d) => s + d.score, 0) / last30.length)
    : disciplineScore;

  // Streaks — count consecutive days with score >= 60
  const streaks = computeStreaks(discipline);

  const hasAnyData =
    transactions.length > 0 ||
    missions.length > 0 ||
    habits.length > 0 ||
    workouts.length > 0 ||
    bodyMetrics.length > 0 ||
    discipline.length > 0;

  return {
    hasAnyData,
    disciplineScore,
    disciplineAvg,
    habitsPct,
    missionsPct,
    sleepHours,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
  };
}

function computeStreaks(days: DisciplineDay[]): { current: number; longest: number } {
  if (days.length === 0) return { current: 0, longest: 0 };

  // sort ascending by date
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0;
  let run = 0;
  sorted.forEach((d) => {
    if (d.score >= 60) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  });

  // current streak = trailing run ending today (or last known day)
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].score >= 60) current += 1;
    else break;
  }

  return { current, longest };
}
