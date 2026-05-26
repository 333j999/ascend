import { createClient } from "@/lib/supabase/server";
import { todayInTZ, mondayInTZ, daysAgoInTZ } from "@/lib/timezone";
import type {
  Transaction, Mission, Habit, Workout, BodyMetric,
  JournalEntry, SavingsGoal, Debt, DisciplineDay,
} from "@/types";

// All queries are scoped by user_id (RLS also enforces this, but explicit
// filtering keeps us fast and intentional).

export async function getTransactions(userId: string, limit = 50): Promise<Transaction[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);
  return (data ?? []) as Transaction[];
}

export async function getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", userId)
    .order("deadline", { ascending: true, nullsFirst: false });
  return (data ?? []) as SavingsGoal[];
}

export async function getDebts(userId: string): Promise<Debt[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("debts")
    .select("*")
    .eq("user_id", userId);
  return (data ?? []) as Debt[];
}

export async function getMissions(userId: string, tz: string = "UTC"): Promise<Mission[]> {
  const supabase = createClient();
  const today = todayInTZ(tz);
  // ±12h window in UTC around the user's "today" — comfortably brackets
  // any timezone offset so we never miss a row at day-boundary.
  const start = new Date(today + "T00:00:00.000Z");
  start.setUTCHours(start.getUTCHours() - 14);
  const end = new Date(today + "T23:59:59.999Z");
  end.setUTCHours(end.getUTCHours() + 14);
  const { data } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString())
    .order("created_at", { ascending: true });
  return (data ?? []) as Mission[];
}

export async function getHabits(userId: string, tz: string = "UTC"): Promise<Habit[]> {
  const supabase = createClient();
  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!habits || habits.length === 0) return [];

  // Compute this week's 7 days using the user's TZ
  const mondayIso = mondayInTZ(tz);
  const weekDays: string[] = [];
  const mondayDate = new Date(mondayIso + "T00:00:00.000Z");
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayDate);
    d.setUTCDate(mondayDate.getUTCDate() + i);
    weekDays.push(d.toISOString().slice(0, 10));
  }

  const { data: logs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", weekDays[0]);

  return habits.map((h: any) => {
    const days = (logs ?? []).filter((l: any) => l.habit_id === h.id);
    const completions: boolean[] = weekDays.map((iso) =>
      days.some((l: any) => l.date === iso && l.completed),
    );
    return {
      id: h.id,
      name: h.name,
      icon: h.icon,
      kind: (h.kind ?? "good") as Habit["kind"],
      streak: h.streak ?? 0,
      best_streak: h.best_streak ?? 0,
      completions_this_week: completions,
      target_per_week: h.target_per_week ?? 7,
    } as Habit;
  });
}

export async function getWorkouts(userId: string, limit = 20): Promise<Workout[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);
  return (data ?? []).map((w: any) => ({
    id: w.id,
    date: w.date,
    name: w.name,
    duration_min: w.duration_min,
    exercises: w.exercises ?? [],
    notes: w.notes,
  })) as Workout[];
}

export async function getBodyMetrics(userId: string, limit = 90): Promise<BodyMetric[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })
    .limit(limit);
  return (data ?? []) as BodyMetric[];
}

export async function getJournalEntries(userId: string, limit = 30): Promise<JournalEntry[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);
  return (data ?? []) as JournalEntry[];
}

export async function getDisciplineDays(userId: string, days = 90, tz: string = "UTC"): Promise<DisciplineDay[]> {
  const supabase = createClient();
  const sinceIso = daysAgoInTZ(days, tz);
  const { data } = await supabase
    .from("discipline_days")
    .select("*")
    .eq("user_id", userId)
    .gte("date", sinceIso)
    .order("date", { ascending: true });
  return (data ?? []) as DisciplineDay[];
}

// ── aggregate helpers ───────────────────────────────────────

export type MonthlyFlow = { month: string; income: number; expenses: number };

export function aggregateMonthlyFlow(txns: Transaction[], months = 7): MonthlyFlow[] {
  const now = new Date();
  const buckets: MonthlyFlow[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      income: 0,
      expenses: 0,
    });
  }
  txns.forEach((t) => {
    const td = new Date(t.date);
    const diffMonths = (now.getFullYear() - td.getFullYear()) * 12 + (now.getMonth() - td.getMonth());
    if (diffMonths < 0 || diffMonths >= months) return;
    const bucket = buckets[months - 1 - diffMonths];
    if (t.type === "income") bucket.income += t.amount;
    else bucket.expenses += t.amount;
  });
  return buckets;
}

export function aggregateSpendingBreakdown(txns: Transaction[], month?: Date) {
  const targetMonth = month ?? new Date();
  const filtered = txns.filter(
    (t) =>
      t.type === "expense" &&
      new Date(t.date).getMonth() === targetMonth.getMonth() &&
      new Date(t.date).getFullYear() === targetMonth.getFullYear(),
  );
  const byCat = new Map<string, number>();
  filtered.forEach((t) => {
    byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.amount);
  });
  return Array.from(byCat.entries())
    .map(([category, value]) => ({ category: cap(category), value }))
    .sort((a, b) => b.value - a.value);
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function calculateMonthSummary(txns: Transaction[], month?: Date) {
  const targetMonth = month ?? new Date();
  const filtered = txns.filter(
    (t) =>
      new Date(t.date).getMonth() === targetMonth.getMonth() &&
      new Date(t.date).getFullYear() === targetMonth.getFullYear(),
  );
  const income = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, net: income - expenses };
}
