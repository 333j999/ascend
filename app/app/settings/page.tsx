import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_USER } from "@/lib/mock-data";

export default function SettingsPage() {
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
            <Input label="Name"  defaultValue={MOCK_USER.name} />
            <Input label="Email" defaultValue={MOCK_USER.email} type="email" />
            <Input label="Timezone"  defaultValue={MOCK_USER.timezone} />
            <Input label="Primary focus" defaultValue={MOCK_USER.goals?.primary_focus} />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save</Button>
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader label="▢ Plan" title="Operator · Annual" />
          <div className="text-sm text-ink-secondary">
            Your current plan unlocks all 6 modules with unlimited history.
          </div>
          <div className="mt-5 p-4 rounded-xs border border-ember-500/30 bg-ember-500/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ember-300">Renews</span>
              <span className="font-mono text-[11px] text-ink-secondary">2027-01-04</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full">Manage billing</Button>
        </Card>

        <Card className="col-span-12">
          <CardHeader
            label="▢ Integrations"
            title="Connected systems"
            action={<Badge tone="amber">Coming soon</Badge>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "Spotify",      desc: "Pull listening data into your daily briefing.", status: "Available" },
              { name: "Apple Health", desc: "Sync workouts, sleep, and resting heart rate.", status: "Beta" },
              { name: "Plaid",        desc: "Auto-pull transactions from your bank.",        status: "Coming" },
            ].map((i) => (
              <div key={i.name} className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-ink-primary">{i.name}</div>
                  <Badge tone={i.status === "Available" ? "ember" : "neutral"}>{i.status}</Badge>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed">{i.desc}</p>
                <Button variant="ghost" size="sm" className="mt-4">Connect</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-12">
          <CardHeader
            label="▢ Danger zone"
            title="Irreversible operations"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30">
              <div className="font-medium text-ink-primary">Export all data</div>
              <p className="mt-1 text-sm text-ink-secondary">Download a JSON of your entire ASCEND history.</p>
              <Button variant="ghost" size="sm" className="mt-4">Export</Button>
            </div>
            <div className="p-5 rounded-xs border border-signal-red/30 bg-signal-red/5">
              <div className="font-medium text-signal-red">Delete account</div>
              <p className="mt-1 text-sm text-ink-secondary">This wipes your data permanently. The chain breaks here.</p>
              <Button variant="ghost" size="sm" className="mt-4 border-signal-red/30 text-signal-red hover:border-signal-red/60">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
