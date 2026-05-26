import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDisciplineDays } from "@/lib/supabase/queries";
import { computeDashboardSummary } from "@/lib/discipline";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let user = { name: "Operator", initials: "OP", avatarUrl: null as string | null };
  let streak = 0;

  if (isSupabaseConfigured()) {
    const current = await getCurrentUser();
    if (!current) redirect("/login");
    user = { name: current.name, initials: current.initials, avatarUrl: current.avatarUrl ?? null };

    const tz = current.profile?.timezone ?? "UTC";
    const discipline = await getDisciplineDays(current.id, 90, tz);
    const summary = computeDashboardSummary({
      transactions: [], missions: [], habits: [], workouts: [], bodyMetrics: [], discipline, tz,
    });
    streak = summary.currentStreak;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar streak={streak} />
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
