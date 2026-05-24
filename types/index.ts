// ─── Core domain types ────────────────────────────────────────

export type UUID = string;

export interface User {
  id: UUID;
  email: string;
  name: string;
  avatar?: string;
  joined_at: string;
  timezone: string;
  goals?: OnboardingGoals;
}

export interface OnboardingGoals {
  income_target_monthly: number;
  savings_target: number;
  fitness_focus: "strength" | "hypertrophy" | "endurance" | "fat-loss";
  bodyweight_goal_kg?: number;
  daily_habits: string[];
  primary_focus: "money" | "fitness" | "business" | "skills" | "discipline";
}

// ─── Finance ─────────────────────────────────────────────────

export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "salary" | "business" | "investments" | "freelance"
  | "rent" | "food" | "transport" | "subscriptions"
  | "fitness" | "education" | "entertainment" | "savings"
  | "debt" | "other";

export interface Transaction {
  id: UUID;
  date: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  recurring?: boolean;
}

export interface SavingsGoal {
  id: UUID;
  name: string;
  target: number;
  saved: number;
  deadline?: string;
}

export interface Debt {
  id: UUID;
  lender: string;
  total: number;
  paid: number;
  monthly_payment: number;
  interest_rate?: number;
}

// ─── Missions / habits / tasks ───────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low";

export interface Mission {
  id: UUID;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  due_at?: string;
  category?: "work" | "fitness" | "money" | "mind" | "relationships";
}

export type HabitKind = "good" | "bad";

export interface Habit {
  id: UUID;
  name: string;
  icon?: string;
  kind: HabitKind;
  streak: number;
  best_streak: number;
  completions_this_week: boolean[]; // length 7, monday-sunday
  target_per_week: number;
}

// ─── Gym ─────────────────────────────────────────────────────

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  reps: number;
  weight_kg: number;
  rpe?: number;
}

export interface Workout {
  id: UUID;
  date: string;
  name: string;
  duration_min: number;
  exercises: Exercise[];
  notes?: string;
}

export interface PersonalRecord {
  exercise: string;
  weight_kg: number;
  reps: number;
  date: string;
}

export interface BodyMetric {
  date: string;
  weight_kg: number;
  body_fat_pct?: number;
  sleep_hours?: number;
}

// ─── Mind / journal ──────────────────────────────────────────

export type Mood = "elite" | "focused" | "neutral" | "low" | "broken";

export interface JournalEntry {
  id: UUID;
  date: string;
  mood: Mood;
  win?: string;
  loss?: string;
  reflection?: string;
  tags?: string[];
}

// ─── Discipline / analytics ──────────────────────────────────

export interface DisciplineDay {
  date: string;
  score: number;            // 0-100
  habits_pct: number;
  missions_pct: number;
  gym: boolean;
  finance_logged: boolean;
  sleep_hours: number;
}

export interface AnalyticsSnapshot {
  net_worth: number;
  monthly_income: number;
  monthly_expenses: number;
  savings_rate: number;
  workouts_this_month: number;
  current_streak: number;
  longest_streak: number;
  discipline_score: number;
}
