import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // If Supabase is configured, require a user. In preview mode (no env vars),
  // fall back to an "Operator" placeholder so the UI is browsable.
  let user = { name: "Operator", initials: "OP", avatarUrl: null as string | null };
  if (isSupabaseConfigured()) {
    const current = await getCurrentUser();
    if (!current) redirect("/login");
    user = { name: current.name, initials: current.initials, avatarUrl: current.avatarUrl ?? null };
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 relative">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black 30%, transparent 80%)",
            }}
          />
          <div className="relative p-5 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
