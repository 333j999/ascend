import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { hourInTZ } from "@/lib/timezone";
import { getBriefing } from "@/lib/briefing";
import { renderBriefEmail } from "@/lib/email/brief-template";

/**
 * Vercel Cron entry point — hits every hour at minute 0.
 *
 * For each user opted in to email_brief_enabled, we check the current hour
 * in THEIR timezone. If it's 6am local for them, we send. Otherwise skip.
 * This delivers each user a 6am-local brief without needing per-user cron
 * scheduling on the Vercel side.
 *
 * Auth: Vercel sets the CRON_SECRET env var and includes it as a Bearer token
 * on cron invocations. We verify it before doing any work.
 *
 * Required env vars:
 *   - CRON_SECRET                 (auto-set by Vercel, also add to .env.local)
 *   - SUPABASE_SERVICE_ROLE_KEY   (so we can read auth.users emails)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - RESEND_API_KEY              (from resend.com)
 *   - RESEND_FROM_EMAIL           (e.g. "ASCEND <brief@yourdomain.com>")
 *   - NEXT_PUBLIC_SITE_URL        (e.g. "https://ascend-woad-mu.vercel.app")
 */
export const dynamic = "force-dynamic";

const SEND_HOUR = 6; // 6am local for each user

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

  // Pull all opted-in profiles
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

    // Only send when it's 6am in the user's TZ right now.
    if (hourInTZ(tz) !== SEND_HOUR) {
      skipped.push(profile.id);
      continue;
    }

    try {
      // Fetch the auth.users row to get email
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
    timestamp: new Date().toISOString(),
    counts: { sent: sent.length, skipped: skipped.length, errors: errors.length },
    sent,
    errors,
  });
}
