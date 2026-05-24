import type {
  AnalyticsSnapshot, BodyMetric, Debt, DisciplineDay,
  Habit, JournalEntry, Mission, PersonalRecord, SavingsGoal,
  Transaction, User, Workout,
} from "@/types";

// ─── Current user ────────────────────────────────────────────

export const MOCK_USER: User = {
  id: "usr_8f3a92b1",
  email: "operator@ascend.io",
  name: "Marcus Vale",
  avatar: undefined,
  joined_at: "2025-01-04",
  timezone: "America/New_York",
  goals: {
    income_target_monthly: 25000,
    savings_target: 100000,
    fitness_focus: "strength",
    bodyweight_goal_kg: 88,
    daily_habits: ["Cold plunge", "Reading", "Gym", "Outreach", "No screens before 10am"],
    primary_focus: "money",
  },
};

// ─── Top-line analytics ──────────────────────────────────────

export const MOCK_ANALYTICS: AnalyticsSnapshot = {
  net_worth: 142_840,
  monthly_income: 18_420,
  monthly_expenses: 6_310,
  savings_rate: 0.658,
  workouts_this_month: 18,
  current_streak: 47,
  longest_streak: 92,
  discipline_score: 87,
};

// ─── Transactions ────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", date: "2026-05-24", amount: 4200, type: "income", category: "business", description: "Client retainer — Helix Labs" },
  { id: "t2", date: "2026-05-23", amount: 320, type: "expense", category: "subscriptions", description: "Tooling stack" },
  { id: "t3", date: "2026-05-22", amount: 89, type: "expense", category: "food", description: "Steakhouse — investor dinner" },
  { id: "t4", date: "2026-05-22", amount: 1200, type: "income", category: "freelance", description: "Brand strategy sprint" },
  { id: "t5", date: "2026-05-21", amount: 240, type: "expense", category: "fitness", description: "Gym + recovery" },
  { id: "t6", date: "2026-05-20", amount: 2400, type: "expense", category: "rent", description: "Apartment — May" },
  { id: "t7", date: "2026-05-19", amount: 65, type: "expense", category: "transport", description: "Fuel" },
  { id: "t8", date: "2026-05-18", amount: 6800, type: "income", category: "salary", description: "Base — payroll" },
  { id: "t9", date: "2026-05-17", amount: 420, type: "expense", category: "education", description: "Books + course renewals" },
  { id: "t10", date: "2026-05-16", amount: 180, type: "expense", category: "food", description: "Groceries — meal prep" },
  { id: "t11", date: "2026-05-15", amount: 3200, type: "expense", category: "savings", description: "Auto-transfer → emergency fund" },
  { id: "t12", date: "2026-05-14", amount: 2200, type: "income", category: "investments", description: "Dividend distribution" },
];

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: "s1", name: "Emergency Fund", target: 40000, saved: 32400, deadline: "2026-09-01" },
  { id: "s2", name: "Business Capital", target: 100000, saved: 38000, deadline: "2027-01-01" },
  { id: "s3", name: "House Down Payment", target: 80000, saved: 12500, deadline: "2027-06-01" },
];

export const MOCK_DEBTS: Debt[] = [
  { id: "d1", lender: "Student Loan — Federal", total: 18000, paid: 9400, monthly_payment: 380, interest_rate: 4.2 },
  { id: "d2", lender: "Auto — Capital One", total: 12500, paid: 6000, monthly_payment: 320, interest_rate: 5.8 },
];

// ─── Income / expense series for charts ──────────────────────

export const MOCK_MONTHLY_FLOW = [
  { month: "Nov", income: 12400, expenses: 5800 },
  { month: "Dec", income: 14200, expenses: 6100 },
  { month: "Jan", income: 15600, expenses: 5900 },
  { month: "Feb", income: 13800, expenses: 6400 },
  { month: "Mar", income: 16900, expenses: 5700 },
  { month: "Apr", income: 17600, expenses: 6200 },
  { month: "May", income: 18420, expenses: 6310 },
];

export const MOCK_NET_WORTH_SERIES = [
  { month: "Nov", value: 92400 },
  { month: "Dec", value: 101200 },
  { month: "Jan", value: 110600 },
  { month: "Feb", value: 116200 },
  { month: "Mar", value: 125400 },
  { month: "Apr", value: 134800 },
  { month: "May", value: 142840 },
];

export const MOCK_SPENDING_BREAKDOWN = [
  { category: "Rent", value: 2400 },
  { category: "Food", value: 980 },
  { category: "Subs", value: 540 },
  { category: "Fitness", value: 420 },
  { category: "Transport", value: 380 },
  { category: "Other", value: 1590 },
];

// ─── Missions (today) ────────────────────────────────────────

export const MOCK_MISSIONS: Mission[] = [
  { id: "m1", title: "Send 20 cold outreach messages", priority: "critical", completed: true, category: "money" },
  { id: "m2", title: "Heavy pull session — deadlifts", priority: "high", completed: true, category: "fitness" },
  { id: "m3", title: "Review yesterday's trades", priority: "high", completed: true, category: "money" },
  { id: "m4", title: "Read 30 pages — Meditations", priority: "medium", completed: true, category: "mind" },
  { id: "m5", title: "Cold plunge — 4 min", priority: "medium", completed: false, category: "fitness" },
  { id: "m6", title: "Plan tomorrow's first 3 hours", priority: "critical", completed: false, category: "work" },
  { id: "m7", title: "Call mom", priority: "low", completed: false, category: "relationships" },
];

// ─── Habits ──────────────────────────────────────────────────

export const MOCK_HABITS: Habit[] = [
  { id: "h1", name: "No screens before 10am", streak: 47, best_streak: 92, completions_this_week: [true,true,true,true,true,true,true], target_per_week: 7 },
  { id: "h2", name: "Cold plunge", streak: 12, best_streak: 41, completions_this_week: [true,true,true,false,true,true,false], target_per_week: 6 },
  { id: "h3", name: "Gym", streak: 8, best_streak: 22, completions_this_week: [true,true,false,true,true,true,false], target_per_week: 5 },
  { id: "h4", name: "Read 30 pages", streak: 23, best_streak: 60, completions_this_week: [true,true,true,true,true,true,true], target_per_week: 7 },
  { id: "h5", name: "20 cold outreaches", streak: 5, best_streak: 18, completions_this_week: [true,true,true,false,true,true,false], target_per_week: 5 },
  { id: "h6", name: "Journal entry", streak: 14, best_streak: 31, completions_this_week: [true,false,true,true,true,true,true], target_per_week: 7 },
];

// ─── Gym ─────────────────────────────────────────────────────

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w1", date: "2026-05-24", name: "Pull — heavy", duration_min: 72,
    exercises: [
      { name: "Deadlift", sets: [
        { reps: 5, weight_kg: 140 }, { reps: 5, weight_kg: 160 },
        { reps: 3, weight_kg: 180 }, { reps: 1, weight_kg: 200, rpe: 9 },
      ]},
      { name: "Weighted Pull-ups", sets: [
        { reps: 8, weight_kg: 20 }, { reps: 6, weight_kg: 25 }, { reps: 5, weight_kg: 30 },
      ]},
      { name: "Barbell Row", sets: [
        { reps: 10, weight_kg: 80 }, { reps: 8, weight_kg: 90 }, { reps: 6, weight_kg: 100 },
      ]},
    ],
  },
  {
    id: "w2", date: "2026-05-22", name: "Push — hypertrophy", duration_min: 65,
    exercises: [
      { name: "Bench Press", sets: [
        { reps: 10, weight_kg: 80 }, { reps: 8, weight_kg: 90 }, { reps: 6, weight_kg: 100 },
      ]},
      { name: "Overhead Press", sets: [
        { reps: 8, weight_kg: 50 }, { reps: 8, weight_kg: 55 }, { reps: 6, weight_kg: 60 },
      ]},
      { name: "Dips", sets: [
        { reps: 12, weight_kg: 0 }, { reps: 10, weight_kg: 15 }, { reps: 8, weight_kg: 25 },
      ]},
    ],
  },
  {
    id: "w3", date: "2026-05-20", name: "Legs — strength", duration_min: 80,
    exercises: [
      { name: "Back Squat", sets: [
        { reps: 5, weight_kg: 120 }, { reps: 5, weight_kg: 140 }, { reps: 3, weight_kg: 160 },
      ]},
      { name: "Romanian Deadlift", sets: [
        { reps: 8, weight_kg: 100 }, { reps: 8, weight_kg: 110 },
      ]},
    ],
  },
];

export const MOCK_PRS: PersonalRecord[] = [
  { exercise: "Deadlift", weight_kg: 200, reps: 1, date: "2026-05-24" },
  { exercise: "Back Squat", weight_kg: 165, reps: 1, date: "2026-04-18" },
  { exercise: "Bench Press", weight_kg: 120, reps: 1, date: "2026-03-22" },
  { exercise: "Overhead Press", weight_kg: 72, reps: 1, date: "2026-04-02" },
  { exercise: "Weighted Pull-up", weight_kg: 40, reps: 1, date: "2026-05-10" },
];

export const MOCK_BODY_METRICS: BodyMetric[] = [
  { date: "2026-01-01", weight_kg: 91.2, body_fat_pct: 16.2, sleep_hours: 7.4 },
  { date: "2026-02-01", weight_kg: 90.4, body_fat_pct: 15.6, sleep_hours: 7.6 },
  { date: "2026-03-01", weight_kg: 89.5, body_fat_pct: 14.8, sleep_hours: 7.8 },
  { date: "2026-04-01", weight_kg: 88.8, body_fat_pct: 14.1, sleep_hours: 7.9 },
  { date: "2026-05-01", weight_kg: 88.2, body_fat_pct: 13.4, sleep_hours: 8.1 },
  { date: "2026-05-24", weight_kg: 87.6, body_fat_pct: 12.8, sleep_hours: 8.2 },
];

// ─── Journal ─────────────────────────────────────────────────

export const MOCK_JOURNAL: JournalEntry[] = [
  {
    id: "j1", date: "2026-05-24", mood: "elite",
    win: "Hit 200kg deadlift PR. Cleanest pull in months.",
    loss: "Skipped cold plunge — felt lazy after gym.",
    reflection: "Strength is back. Need to stop bargaining with myself on the small reps. Either you do the thing or you don't.",
    tags: ["pr", "lift", "mindset"],
  },
  {
    id: "j2", date: "2026-05-23", mood: "focused",
    win: "Closed Helix retainer. 4.2k MRR locked in.",
    loss: "Got distracted on twitter for 90 minutes mid-afternoon.",
    reflection: "Money is starting to compound. Cut the social media noise from the morning routine.",
  },
  {
    id: "j3", date: "2026-05-22", mood: "neutral",
    win: "Investor dinner went well. Two follow-ups booked.",
    loss: "Ate way too late. Sleep took a hit.",
    reflection: "Trade your time for the right rooms. Eat earlier on outing days.",
  },
  {
    id: "j4", date: "2026-05-21", mood: "focused",
    win: "20 cold outreaches sent before 10am. 3 replies.",
    reflection: "The morning block is sacred. Defend it like a fortress.",
  },
];

// ─── Discipline timeline (last 60 days) ──────────────────────

export const MOCK_DISCIPLINE: DisciplineDay[] = Array.from({ length: 60 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (59 - i));
  // generate plausible scores trending upward
  const base = 60 + Math.sin(i / 6) * 12 + (i / 60) * 18;
  const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 4;
  const score = Math.max(28, Math.min(98, Math.round(base + noise)));
  return {
    date: d.toISOString().slice(0, 10),
    score,
    habits_pct: Math.min(100, score + Math.round(Math.sin(i) * 8)),
    missions_pct: Math.min(100, Math.max(20, score - 4 + Math.round(Math.cos(i / 3) * 10))),
    gym: i % 3 !== 1,
    finance_logged: i % 4 !== 2,
    sleep_hours: 6.8 + Math.sin(i / 4) * 0.9,
  };
});

// ─── Quotes ──────────────────────────────────────────────────

export const MOCK_QUOTES = [
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Hard choices, easy life. Easy choices, hard life.", author: "Jerzy Gregorek" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Jim Rohn" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
];

// helper — get today's quote (deterministic by date)
export function getTodayQuote() {
  const today = new Date();
  const idx = (today.getFullYear() + today.getMonth() + today.getDate()) % MOCK_QUOTES.length;
  return MOCK_QUOTES[idx];
}
