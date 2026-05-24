import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { QuoteCard } from "@/components/dashboard/quote-card";
import { JournalComposer } from "@/components/mind/journal-composer";
import { MoodChart } from "@/components/mind/mood-chart";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getJournalEntries } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MOOD_TONE_BADGE: Record<string, "ember" | "neutral" | "amber" | "red"> = {
  elite: "ember", focused: "ember", neutral: "neutral", low: "amber", broken: "red",
};

export default async function MindPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const entries = await getJournalEntries(user.id, 30);

  // Today's entry (if any) so the composer shows existing data
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayEntry = entries.find(e => e.date === todayIso);

  // 14-day streak
  const streak = computeJournalStreak(entries);

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 05 · Mind / Journal"
        title={<>What you don&rsquo;t reflect on, <span className="italic font-light text-ember-300">runs you.</span></>}
        subtitle="A simple ritual. Win. Loss. Reflection. Minimal friction, maximum signal. Five minutes a day to stay sovereign over your own mind."
      />

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label={`▢ Today · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
            title={todayEntry ? "You've journaled today" : "Daily reflection"}
          />
          <JournalComposer existing={todayEntry} />
        </Card>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <QuoteCard />

          <Card>
            <CardHeader label="▢ Mood · last 14 entries" title="Inner weather" />
            {entries.length > 0 ? (
              <MoodChart entries={entries.slice(0, 14).reverse()} />
            ) : (
              <EmptyState title="No mood data yet" description="Log a journal entry to start tracking your inner weather." />
            )}
          </Card>

          <Card>
            <CardHeader label="▢ Streak · journaling" title="Don't break it" />
            <div className="flex items-baseline gap-2">
              <span className="stat text-4xl text-ember-300 tracking-tightest">{streak.current}</span>
              <span className="font-mono text-xs text-ink-muted">days consecutive</span>
            </div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Best · {streak.longest} days
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader label="▢ Archive" title="Past entries" />
        {entries.length === 0 ? (
          <EmptyState title="No entries yet" description="Your archive populates as you write." />
        ) : (
          <div className="space-y-3">
            {entries.map((j) => (
              <article
                key={j.id}
                className="p-5 rounded-xs border border-edge-subtle bg-surface-3/30 hover:bg-surface-3/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                    {formatDate(j.date, "long")}
                  </div>
                  <Badge tone={MOOD_TONE_BADGE[j.mood] ?? "neutral"}>
                    {j.mood}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm leading-relaxed">
                  {j.win && (
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400 mr-2">Win</span>
                      <span className="text-ink-primary">{j.win}</span>
                    </div>
                  )}
                  {j.loss && (
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-signal-red mr-2">Loss</span>
                      <span className="text-ink-secondary">{j.loss}</span>
                    </div>
                  )}
                  {j.reflection && (
                    <div className="pt-2 border-t border-edge-subtle italic text-ink-secondary">
                      &ldquo;{j.reflection}&rdquo;
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function computeJournalStreak(entries: { date: string }[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };
  const sortedDesc = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  // current — consecutive days ending today or yesterday
  let current = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; i < sortedDesc.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedIso = expected.toISOString().slice(0, 10);
    if (sortedDesc[i].date === expectedIso) current += 1;
    else break;
  }

  // longest — scan ascending
  const sortedAsc = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1].date);
    const cur = new Date(sortedAsc[i].date);
    const diff = (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) { run += 1; if (run > longest) longest = run; }
    else run = 1;
  }
  return { current, longest };
}
