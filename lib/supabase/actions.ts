"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";

async function requireUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user.id;
}

// ── Profile / onboarding ─────────────────────────────────────

export async function saveProfile(input: {
  income_target_monthly?: number;
  savings_target?: number;
  fitness_focus?: string;
  bodyweight_goal_kg?: number;
  daily_habits?: string[];
  primary_focus?: string;
}) {
  const userId = await requireUserId();
  const supabase = createClient();

  await supabase
    .from("profiles")
    .update({
      income_target_monthly: input.income_target_monthly,
      savings_target: input.savings_target,
      fitness_focus: input.fitness_focus,
      bodyweight_goal_kg: input.bodyweight_goal_kg,
      daily_habits: input.daily_habits,
      primary_focus: input.primary_focus,
    })
    .eq("id", userId);

  // Seed habits from daily_habits if user has none yet
  if (input.daily_habits && input.daily_habits.length > 0) {
    const { count } = await supabase
      .from("habits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (!count) {
      await supabase.from("habits").insert(
        input.daily_habits.map((name) => ({
          user_id: userId,
          name,
          target_per_week: 7,
        })),
      );
    }
  }

  revalidatePath("/app", "layout");
}

// ── Transactions ─────────────────────────────────────────────

export async function addTransaction(input: {
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  recurring?: boolean;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("transactions").insert({
    user_id: userId,
    ...input,
  });
  revalidatePath("/app", "layout");
}

export async function deleteTransaction(id: string) {
  await requireUserId();
  const supabase = createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/app", "layout");
}

export async function updateTransaction(id: string, input: {
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
}) {
  await requireUserId();
  const supabase = createClient();
  await supabase.from("transactions").update(input).eq("id", id);
  revalidatePath("/app", "layout");
}

// ── Savings goals ────────────────────────────────────────────

export async function addSavingsGoal(input: {
  name: string;
  target: number;
  saved: number;
  deadline?: string;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("savings_goals").insert({
    user_id: userId,
    ...input,
  });
  revalidatePath("/app", "layout");
}

export async function contributeToGoal(goalId: string, amount: number) {
  const userId = await requireUserId();
  if (amount <= 0) throw new Error("Amount must be positive.");
  const supabase = createClient();

  // Fetch goal so we can increment correctly
  const { data: goal } = await supabase
    .from("savings_goals").select("*").eq("id", goalId).eq("user_id", userId).single();
  if (!goal) throw new Error("Goal not found.");

  await supabase
    .from("savings_goals")
    .update({ saved: Number(goal.saved) + amount })
    .eq("id", goalId);

  // Also log it as a savings transaction so the ledger reflects the move
  await supabase.from("transactions").insert({
    user_id: userId,
    date: new Date().toISOString().slice(0, 10),
    amount,
    type: "expense",
    category: "savings",
    description: `Contribution → ${goal.name}`,
  });

  revalidatePath("/app", "layout");
}

export async function deleteSavingsGoal(id: string) {
  await requireUserId();
  const supabase = createClient();
  await supabase.from("savings_goals").delete().eq("id", id);
  revalidatePath("/app", "layout");
}

// ── Missions ─────────────────────────────────────────────────

export async function addMission(input: {
  title: string;
  description?: string;
  priority: "critical" | "high" | "medium" | "low";
  category?: string;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("missions").insert({
    user_id: userId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    category: input.category,
    completed: false,
  });
  revalidatePath("/app", "layout");
}

export async function toggleMission(id: string, completed: boolean) {
  await requireUserId();
  const supabase = createClient();
  await supabase.from("missions").update({ completed }).eq("id", id);
  revalidatePath("/app", "layout");
}

export async function deleteMission(id: string) {
  await requireUserId();
  const supabase = createClient();
  await supabase.from("missions").delete().eq("id", id);
  revalidatePath("/app", "layout");
}

// ── Habits ───────────────────────────────────────────────────

export async function addHabit(input: {
  name: string;
  kind: "good" | "bad";
  target_per_week?: number;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("habits").insert({
    user_id: userId,
    name: input.name,
    kind: input.kind,
    target_per_week: input.target_per_week ?? 7,
  });
  revalidatePath("/app", "layout");
}

export async function deleteHabit(id: string) {
  await requireUserId();
  const supabase = createClient();
  await supabase.from("habits").delete().eq("id", id);
  revalidatePath("/app", "layout");
}

export async function logHabit(habitId: string, date: string, completed: boolean) {
  const userId = await requireUserId();
  const supabase = createClient();
  if (completed) {
    await supabase
      .from("habit_logs")
      .upsert(
        { habit_id: habitId, user_id: userId, date, completed: true },
        { onConflict: "habit_id,date" },
      );
  } else {
    // un-checking deletes the row so the dot disappears
    await supabase
      .from("habit_logs")
      .delete()
      .eq("habit_id", habitId)
      .eq("date", date);
  }
  revalidatePath("/app", "layout");
}

// ── Workouts ─────────────────────────────────────────────────

export async function addWorkout(input: {
  date: string;
  name: string;
  duration_min: number;
  exercises: Array<{ name: string; sets: Array<{ reps: number; weight_kg: number; rpe?: number }> }>;
  notes?: string;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("workouts").insert({
    user_id: userId,
    date: input.date,
    name: input.name,
    duration_min: input.duration_min,
    exercises: input.exercises,
    notes: input.notes,
  });
  revalidatePath("/app", "layout");
}

// ── Body metrics ─────────────────────────────────────────────

export async function logBodyMetric(input: {
  date: string;
  weight_kg?: number;
  body_fat_pct?: number;
  sleep_hours?: number;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("body_metrics").upsert({
    user_id: userId,
    ...input,
  });
  revalidatePath("/app", "layout");
}

// ── Journal ──────────────────────────────────────────────────

export async function addJournalEntry(input: {
  date: string;
  mood: "elite" | "focused" | "neutral" | "low" | "broken";
  win?: string;
  loss?: string;
  reflection?: string;
}) {
  const userId = await requireUserId();
  const supabase = createClient();
  await supabase.from("journal_entries").insert({
    user_id: userId,
    ...input,
  });
  revalidatePath("/app", "layout");
}
