import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client.
// Uses cookie-based session storage via @supabase/ssr.
//
// To enable real auth/DB:
//   1. Create a Supabase project at https://supabase.com
//   2. Copy the URL and anon key into .env.local
//   3. Run the SQL in lib/supabase/schema.sql to create tables
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
  );
}
