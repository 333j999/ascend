import type { Briefing } from "@/lib/briefing";

/**
 * Plain HTML email template for the morning brief.
 * Inline styles only — no <link>/<style> blocks since most email clients
 * strip them. Uses our brand palette but a higher-contrast version tuned
 * for both light and dark Gmail/Apple Mail themes.
 */
export function renderBriefEmail({
  briefing,
  firstName,
  appUrl,
}: {
  briefing: Briefing;
  firstName: string;
  appUrl: string;
}): { subject: string; html: string; text: string } {
  const date = new Date(briefing.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const subject = `▢ ASCEND · ${date}${
    briefing.yesterdayScore !== null ? ` · Yesterday ${briefing.yesterdayScore}` : ""
  }`;

  const missionsRemaining = briefing.todaysMissions.filter(m => !m.completed);
  const yesterdayLine = briefing.yesterdayScore !== null
    ? `Yesterday closed at <b>${briefing.yesterdayScore}/100</b>.`
    : `No score logged yet for yesterday — set the baseline today.`;

  const habitsList = briefing.outstandingHabits.length === 0
    ? `<p style="margin:8px 0 0 0;color:#22c55e;">✓ All habits already claimed.</p>`
    : `<ul style="margin:8px 0 0 0;padding-left:18px;">${
        briefing.outstandingHabits.slice(0, 8).map(h =>
          `<li style="margin-bottom:4px;color:#e4e4e7;">${escapeHtml(h.name)}</li>`,
        ).join("")
      }</ul>`;

  const missionsList = missionsRemaining.length === 0
    ? `<p style="margin:8px 0 0 0;color:#22c55e;">✓ All missions complete or empty board — set today's now.</p>`
    : `<ul style="margin:8px 0 0 0;padding-left:18px;">${
        missionsRemaining.slice(0, 8).map(m =>
          `<li style="margin-bottom:4px;color:#e4e4e7;">${escapeHtml(m.title)}</li>`,
        ).join("")
      }</ul>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#08080a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,sans-serif;color:#f5f5f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08080a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#131316;border:1px solid #2a2a31;border-radius:4px;overflow:hidden;">

        <!-- Header bar -->
        <tr><td style="padding:20px 24px;border-bottom:1px solid #1f1f24;">
          <table width="100%"><tr>
            <td style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a3a3a8;">
              ▢ ASCEND · MORNING BRIEF
            </td>
            <td align="right" style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;color:#6b6b73;">
              ${date}
            </td>
          </tr></table>
        </td></tr>

        <!-- Greeting -->
        <tr><td style="padding:28px 24px 8px;">
          <h1 style="margin:0;font-size:28px;font-weight:500;letter-spacing:-0.03em;color:#f5f5f4;">
            ${briefing.greeting}, <span style="color:#ff7434;font-style:italic;font-weight:300;">${escapeHtml(firstName)}.</span>
          </h1>
          <p style="margin:12px 0 0 0;color:#a3a3a8;line-height:1.6;">${yesterdayLine}</p>
        </td></tr>

        <!-- Quick stat strip -->
        <tr><td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${statCell("Streak", `${briefing.currentStreak}d`)}
              ${statCell("Missions left", `${missionsRemaining.length}`)}
              ${statCell("Habits left", `${briefing.outstandingHabits.length}`)}
              ${statCell("Net · MTD", formatUSD(briefing.monthIncome - briefing.monthBurn))}
            </tr>
          </table>
        </td></tr>

        <!-- Habits -->
        <tr><td style="padding:0 24px 16px;">
          <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6b6b73;">
            Habits to claim today
          </div>
          ${habitsList}
        </td></tr>

        <!-- Missions -->
        <tr><td style="padding:8px 24px 16px;">
          <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6b6b73;">
            Today's mission board
          </div>
          ${missionsList}
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:8px 24px 24px;" align="center">
          <a href="${appUrl}/app/dashboard" style="display:inline-block;padding:12px 24px;background:#ff5e1a;color:#08080a;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:500;text-decoration:none;border-radius:4px;">
            Open Dashboard →
          </a>
        </td></tr>

        <!-- Quote -->
        <tr><td style="padding:20px 24px;border-top:1px solid #1f1f24;background:#0d0d10;">
          <blockquote style="margin:0;padding:0;font-style:italic;color:#a3a3a8;font-size:14px;line-height:1.6;">
            “${escapeHtml(briefing.quote.text)}”
          </blockquote>
          <div style="margin-top:8px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ff7434;">
            — ${escapeHtml(briefing.quote.author)}
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:16px 24px;background:#0a0a0c;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6b6b73;">
          <table width="100%"><tr>
            <td>© ASCEND · Operator system</td>
            <td align="right">
              <a href="${appUrl}/app/settings" style="color:#6b6b73;text-decoration:underline;">Manage briefs</a>
            </td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `▢ ASCEND · ${date}`,
    `${briefing.greeting}, ${firstName}.`,
    "",
    yesterdayLine.replace(/<[^>]+>/g, ""),
    "",
    `Streak: ${briefing.currentStreak}d  ·  Missions left: ${missionsRemaining.length}  ·  Habits left: ${briefing.outstandingHabits.length}`,
    `Net · MTD: ${formatUSD(briefing.monthIncome - briefing.monthBurn)}`,
    "",
    "Habits to claim today:",
    ...briefing.outstandingHabits.slice(0, 8).map(h => `  - ${h.name}`),
    "",
    "Today's mission board:",
    ...missionsRemaining.slice(0, 8).map(m => `  - ${m.title}`),
    "",
    `"${briefing.quote.text}" — ${briefing.quote.author}`,
    "",
    `Open: ${appUrl}/app/dashboard`,
    `Manage: ${appUrl}/app/settings`,
  ].join("\n");

  return { subject, html, text };
}

function statCell(label: string, value: string) {
  return `<td width="25%" valign="top" style="padding:4px;">
    <div style="background:#1a1a1f;border:1px solid #2a2a31;border-radius:4px;padding:10px 12px;">
      <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#6b6b73;">
        ${label}
      </div>
      <div style="margin-top:4px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:18px;color:#f5f5f4;font-weight:500;">
        ${value}
      </div>
    </div>
  </td>`;
}

function formatUSD(v: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
