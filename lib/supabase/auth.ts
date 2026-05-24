import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  initials: string;
  profile: Profile | null;
};

export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  timezone: string | null;
  income_target_monthly: number | null;
  savings_target: number | null;
  fitness_focus: string | null;
  bodyweight_goal_kg: number | null;
  daily_habits: string[] | null;
  primary_focus: string | null;
};

/**
 * Returns the currently signed-in user with their profile.
 * Returns null if not signed in or Supabase is not configured.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Operator";

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return {
    id: user.id,
    email: user.email ?? "",
    name,
    avatarUrl: user.user_metadata?.avatar_url ?? profile?.avatar_url ?? null,
    initials: initialsFor(name),
    profile: profile ?? null,
  };
}

export function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
