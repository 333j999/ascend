import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { hourInTZ } from "@/lib/timezone";
import { getBriefing } from "@/lib/briefing";
import { renderBriefEmail } from "@/lib/email/brief-template";

/**
 * Vercel Cron entry point.
 *
 * Schedule lives in vercel.json. The Vercel Hobby plan caps cron jobs at
 * once-per-day, so the default schedule is "0 10 * * *" (10am UTC daily).
 * When fired, we send a brief to every opted-in user — they receive it at
 * "10am UTC translated to their local time" (6am EST, 11am CET, 6pm SGT…).
 *
 * If you upgrade to Vercel Pro (or wire an external hourly trigger such as
 * cron-job.org or GitHub Actions), change the vercel.json schedule to
 * "0 * * * *" and set the env var CRON_PER_USER_HOUR=true. The route will
 * then only send to users whose local hour is currently PER_USER_SEND_HOUR
 * (6 by default) — true per-user-TZ 6am delivery.
 *
 * Auth: Vercel sets CRON_SECRET in env and includes it as a Bearer token
 * on cron invocations. We verify before doing any work.
 *
 * Required env vars:
 *   - CRON_SECRET
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - RESEND_API_KEY
 *   - RESEND_FROM_EMAIL
 *   - NEXT_PUBLIC_SITE_URL
 */
export const dynamic = "force-dynamic";

const PER_USER_SEND_HOUR = 6;
const HOURLY_PER_USER = process.env.CRON_PER_USER_HOUR === "true";

export async function GET(request: Request) {
  // Verify Vercel Cron auth
  const auth = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Supabase service env not configured" }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, timezone, name")
    .eq("email_brief_enabled", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sent: string[] = [];
  const skipped: string[] = [];
  const errors: { id: string; error: string }[] = [];

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "ASCEND <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ascend.app";

  for (const profile of profiles ?? []) {
    const tz = profile.timezone ?? "UTC";

    // On hourly schedule (Pro plan / external trigger) only send when it's
    // 6am in the user's TZ. On default once-daily schedule, send to all.
    if (HOURLY_PER_USER && hourInTZ(tz) !== PER_USER_SEND_HOUR) {
      skipped.push(profile.id);
      continue;
    }

    try {
      const { data: { user } } = await admin.auth.admin.getUserById(profile.id);
      if (!user?.email) {
        errors.push({ id: profile.id, error: "no email" });
        continue;
      }

      const briefing = await getBriefing(profile.id, tz);
      const firstName = (profile.name ?? user.email).split(/[\s@]/)[0];
      const { subject, html, text } = renderBriefEmail({ briefing, firstName, appUrl });

      const { error: sendError } = await resend.emails.send({
        from: fromAddress,
        to: user.email,
        subject,
        html,
        text,
      });

      if (sendError) {
        errors.push({ id: profile.id, error: sendError.message ?? String(sendError) });
      } else {
        sent.push(user.email);
      }
    } catch (e: any) {
      errors.push({ id: profile.id, error: e?.message ?? String(e) });
    }
  }

  return NextResponse.json({
    ok: true,
    schedule: HOURLY_PER_USER ? "hourly-per-user" : "daily-batch",
    timestamp: new Date().toISOString(),
    counts: { sent: sent.length, skipped: skipped.length, errors: errors.length },
    sent,
    errors,
  });
}
