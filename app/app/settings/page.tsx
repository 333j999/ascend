import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader label="▢ Profile" title="Identity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Name"  defaultValue={user.name} readOnly />
            <Input label="Email" defaultValue={user.email} type="email" readOnly />
            <Input label="Timezone" defaultValue={user.profile?.timezone ?? "UTC"} readOnly />
            <Input label="Primary focus" defaultValue={user.profile?.primary_focus ?? "—"} readOnly />
          </div>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            ◇ Editable profile coming next push — for now, re-run onboarding to update.
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" href="/onboarding">Re-run onboarding</Button>
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
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

        <Card className="col-span-12">
          <CardHeader
            label="▢ Integrations"
            title="Connected systems"
            action={<Badge tone="amber">Coming soon</Badge>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "Spotify",      desc: "Pull listening data into your daily briefing." },
              { name: "Apple Health", desc: "Sync workouts, sleep, and resting heart rate." },
              { name: "Plaid",        desc: "Auto-pull transactions from your bank." },
            ].map((i) => (
              <div key={i.name} className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-ink-primary">{i.name}</div>
                  <Badge tone="neutral">Soon</Badge>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed">{i.desc}</p>
                <Button variant="ghost" size="sm" className="mt-4" disabled>Connect</Button>
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
