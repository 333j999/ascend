import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/settings/profile-form";
import { EmailBriefToggle } from "@/components/settings/email-brief-toggle";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Settings"
        title={<>Operator <span className="italic font-light text-ember-300">configuration.</span></>}
        subtitle="Profile, targets, integrations, and data — the wiring of your ASCEND deployment."
      />

      {/* Profile — editable */}
      <Card>
        <CardHeader label="▢ Profile" title="Identity & targets" />
        <ProfileForm email={user.email} profile={user.profile} />
      </Card>

      {/* Email brief toggle */}
      <Card>
        <CardHeader
          label="▢ Daily brief"
          title="Morning email"
          action={<Badge tone="ember">Beta</Badge>}
        />
        <EmailBriefToggle
          initial={user.profile?.email_brief_enabled ?? false}
          email={user.email}
          timezone={user.profile?.timezone ?? "UTC"}
        />
      </Card>

      {/* Plan + integrations + danger zone */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader label="▢ Plan" title="Recon · Free" />
          <div className="text-sm text-ink-secondary">
            All 6 modules unlocked. Unlimited history.
          </div>
          <div className="mt-5 p-4 rounded-xs border border-ember-500/30 bg-ember-500/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ember-300">Status</span>
              <span className="font-mono text-[11px] text-ink-secondary">Active</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full" disabled>
            Billing coming soon
          </Button>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader
            label="▢ Integrations"
            title="Connected systems"
            action={<Badge tone="amber">Coming soon</Badge>}
          />
          <div className="space-y-2">
            {[
              { name: "Spotify",      desc: "Listening data → daily brief" },
              { name: "Apple Health", desc: "Workouts, sleep, heart rate" },
              { name: "Plaid",        desc: "Auto-pull bank transactions" },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between p-3 rounded-xs border border-edge-subtle bg-surface-3/30">
                <div>
                  <div className="font-medium text-ink-primary text-sm">{i.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{i.desc}</div>
                </div>
                <Badge tone="neutral">Soon</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-12">
          <CardHeader label="▢ Danger zone" title="Irreversible operations" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30">
              <div className="font-medium text-ink-primary">Export all data</div>
              <p className="mt-1 text-sm text-ink-secondary">Coming soon — for now, use Supabase Table Editor to download CSVs.</p>
              <Button variant="ghost" size="sm" className="mt-4" disabled>Export</Button>
            </div>
            <div className="p-5 rounded-xs border border-signal-red/30 bg-signal-red/5">
              <div className="font-medium text-signal-red">Delete account</div>
              <p className="mt-1 text-sm text-ink-secondary">Coming soon. For now, delete your row in Supabase Auth → Users.</p>
              <Button variant="ghost" size="sm" className="mt-4 border-signal-red/30 text-signal-red hover:border-signal-red/60" disabled>Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
