import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app-shell/page-header";
import { BriefingCard } from "@/components/briefing/briefing-card";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tz = user.profile?.timezone ?? "UTC";
  const briefing = await getBriefing(user.id, tz);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        code="▢ Daily Brief"
        title={<>Today, <span className="italic font-light text-ember-300">{firstName}.</span></>}
        subtitle="The same brief that hits your inbox at 6am — anytime you need it."
      />
      <BriefingCard briefing={briefing} firstName={firstName} />
    </div>
  );
}
