/**
 * True if Supabase env vars are present.
 * When false, auth pages fall back to mock behavior (route straight to dashboard)
 * so the app stays usable for preview / design work.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
