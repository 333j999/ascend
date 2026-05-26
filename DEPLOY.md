# Deploying ASCEND

This walks you through deploying ASCEND so that **real users can sign in with email or Google** on a production URL.

The whole flow takes ~30 minutes and is free at small scale (Vercel free tier + Supabase free tier).

---

## Big picture

You'll be touching four services:

1. **GitHub** — host the source code
2. **Supabase** — database, auth, sessions
3. **Google Cloud Console** — OAuth client for "Sign in with Google"
4. **Vercel** — hosts the Next.js app

The flow is: code lives on GitHub → Vercel deploys it → app talks to Supabase → Supabase talks to Google for OAuth.

---

## 1. Push the code to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial commit — ASCEND"
```

Then go to <https://github.com/new>, create an empty repo named `ascend` (don't add a README or `.gitignore` — you already have one), and run the two commands GitHub shows you:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ascend.git
git branch -M main
git push -u origin main
```

---

## 2. Create the Supabase project

1. Go to <https://supabase.com> and sign up (free).
2. Click **New project**. Name it `ascend`, pick a strong DB password (save it), and the closest region. Click **Create**.
3. Wait ~2 minutes for it to provision.

### 2a. Run the schema

1. In your Supabase project, click **SQL Editor** in the left rail.
2. Click **New query**.
3. Open `lib/supabase/schema.sql` from your repo, copy the entire contents, paste into the editor.
4. Click **Run** (bottom right). You should see `Success. No rows returned.`
5. Click **Table Editor** in the left rail to confirm — you should see `profiles`, `transactions`, `missions`, `habits`, `workouts`, `journal_entries`, etc.

### 2b. Grab your API keys

1. Click **Project Settings** (gear icon, bottom left) → **API**.
2. Copy the **Project URL** — looks like `https://xxxx.supabase.co`. Save it.
3. Copy the **anon public** key (under "Project API keys"). Save it.

You'll paste these into Vercel in step 5.

---

## 3. Set up Google OAuth

This is the most click-heavy step. Go slow.

### 3a. Create a Google Cloud project

1. Go to <https://console.cloud.google.com>.
2. Top bar → project dropdown → **New Project**. Name it `ASCEND`. Click **Create**.
3. Wait for it to finish, then make sure the dropdown shows `ASCEND` selected.

### 3b. Configure the OAuth consent screen

1. Left rail → **APIs & Services** → **OAuth consent screen**.
2. Choose **External** → **Create**.
3. Fill in:
   - **App name**: `ASCEND`
   - **User support email**: your email
   - **Developer contact**: your email
4. **Save and continue**. Skip scopes, skip test users (or add your own email). **Back to dashboard**.
5. Under **Publishing status**, click **Publish app** to skip the test-user-only mode. (For a real launch you'd verify the domain; for personal use the unverified warning is fine.)

### 3c. Create OAuth credentials

1. Left rail → **APIs & Services** → **Credentials**.
2. **+ Create credentials** → **OAuth client ID**.
3. **Application type**: Web application.
4. **Name**: `ASCEND Web`.
5. Under **Authorized redirect URIs**, click **Add URI** and paste:

   ```
   https://YOUR-SUPABASE-PROJECT-REF.supabase.co/auth/v1/callback
   ```

   Replace `YOUR-SUPABASE-PROJECT-REF` with your actual project ref (the subdomain part of your Supabase URL).

6. Click **Create**.
7. A modal pops up with **Client ID** and **Client secret**. Copy both. Save them.

### 3d. Wire Google into Supabase

1. Back in Supabase → **Authentication** → **Providers**.
2. Find **Google**, click to expand.
3. Toggle **Enable sign in with Google** on.
4. Paste the **Client ID** and **Client Secret** from step 3c.
5. Click **Save**.

---

## 4. Deploy to Vercel

1. Go to <https://vercel.com> and sign in with your GitHub account.
2. Click **Add New** → **Project**.
3. Find your `ascend` repo → **Import**.
4. Vercel auto-detects Next.js. Don't change the build settings.
5. Expand **Environment Variables** and add three:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (your Supabase Project URL from step 2b) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (your Supabase anon key from step 2b) |
   | `NEXT_PUBLIC_SITE_URL` | (leave blank for now — fill in after first deploy) |

6. Click **Deploy**. Wait ~90 seconds for the build.
7. Once it's live, copy the production URL — looks like `https://ascend-xyz.vercel.app`.

---

## 5. Wire the production URL back to Supabase + Google

This is the step everyone forgets. Without it, Google sign-in will redirect to localhost.

### 5a. Tell Supabase your site URL

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL** → paste `https://ascend-xyz.vercel.app` (your Vercel URL).
3. **Redirect URLs** → add both:
   - `https://ascend-xyz.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (so local dev still works)
4. **Save**.

### 5b. Tell Google your site URL

1. Google Cloud Console → **Credentials** → click your `ASCEND Web` client.
2. Under **Authorized JavaScript origins**, add:
   - `https://ascend-xyz.vercel.app`
   - `http://localhost:3000`
3. Under **Authorized redirect URIs**, you should already have the Supabase one. That's all Google needs — Supabase handles the callback to your app.
4. **Save**.

---

## 6. Test it

1. Open your production URL.
2. Click **Sign in** → **Continue with Google**.
3. Pick a Google account.
4. You should land on `/app/dashboard` with your real session.
5. Check Supabase → **Authentication** → **Users**. Your account should be there.
6. Check Supabase → **Table Editor** → `profiles`. A row should have been auto-created (the trigger in `schema.sql` does this).

---

## Local dev with real auth

To use real Supabase locally (so Google sign-in works on `localhost:3000`):

```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` values from Vercel. Restart `npm run dev`.

If you don't set env vars locally, the app falls back to **preview mode**: login/signup forms just route straight to `/app/dashboard` with the mock data. Useful for design work.

---

## Common gotchas

- **"redirect_uri_mismatch" from Google** → the URI in Google Cloud doesn't exactly match what Supabase is sending. It must be `https://YOUR-REF.supabase.co/auth/v1/callback` — not your Vercel domain.
- **Google sign-in loops back to /login** → you forgot step 5a (Site URL in Supabase). Or the Vercel deployment doesn't have the env vars.
- **"Invalid API key"** → you copied the `service_role` key instead of the `anon` key. Use `anon`.
- **Sign-up works but no profile row** → run `lib/supabase/schema.sql` again. The trigger at the bottom is what creates the row.
- **Email signup never sends confirmation** → Supabase → Authentication → Email Templates → Confirm signup. By default it uses Supabase's SMTP which works but is rate-limited. For production add your own SMTP (Resend, Postmark) under Authentication → SMTP Settings.

---

## What you've got

After all six steps:

- Real users can sign up with email/password or Google
- Each user has an isolated database row (row-level security enforces it)
- Sessions persist via cookies (refreshed by the middleware on every request)
- Anyone visiting `/app/*` without a valid session is redirected to `/login`
- The "Exit" button in the sidebar actually signs them out

You're shipped.

---

## 7. (Optional) Daily morning brief by email

ASCEND can send each user a 6am-local email with yesterday's score, today's
missions, and the habits they still owe. Setup is ~10 minutes and free at
small scale.

### 7a. Run the migration

Open the Supabase SQL editor and run [lib/supabase/migrations/002_profile_email_brief.sql](lib/supabase/migrations/002_profile_email_brief.sql).
This adds the `email_brief_enabled` column on `profiles`.

### 7b. Set up Resend

1. Go to https://resend.com and sign up (free — 3,000 emails/month).
2. **API Keys** → **Create API Key** → name it `ASCEND production`, scope `Full access`. Copy it.
3. **Domains** → either:
   - **Use the shared sender** for testing: leave `RESEND_FROM_EMAIL` as `ASCEND <onboarding@resend.dev>`. Emails work but go to spam easily.
   - **Verify your own domain** for production: add your domain, follow the DNS instructions, then set `RESEND_FROM_EMAIL` to e.g. `ASCEND <brief@yourdomain.com>`.

### 7c. Add the env vars to Vercel

Project → Settings → Environment Variables. Add:

| Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_xxx...` | from step 7b |
| `RESEND_FROM_EMAIL` | `ASCEND <onboarding@resend.dev>` | or your verified domain |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase → Project Settings → API → **service_role** key | server-only, never exposed |
| `NEXT_PUBLIC_SITE_URL` | your Vercel URL | used for links inside emails |
| `CRON_SECRET` | any random string (e.g. `openssl rand -hex 32`) | also added by Vercel automatically when crons exist, but pin it yourself for safety |

Click **Save** → trigger a redeploy from the Deployments tab.

### 7d. Verify the cron

After redeploy, in Vercel → Project → **Settings → Cron Jobs**, you should
see `/api/cron/daily-brief` listed with schedule `0 * * * *` (every hour at :00).

Test it manually right now (use the live URL):

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-app.vercel.app/api/cron/daily-brief
```

You should get back a JSON like:
```
{ "ok": true, "counts": { "sent": 0, "skipped": N, "errors": 0 } }
```

(`sent: 0` is correct unless it happens to be 6am local for an opted-in user
right now. `skipped` counts users it's not currently their morning hour.)

### 7e. Opt yourself in

Open https://your-app.vercel.app/app/settings → toggle on **Daily morning brief**.

At 6am your local time tomorrow, you'll get the email. To test sooner, change
your timezone in Settings to one where it's currently 6am (e.g. if it's 6pm
EST, pick a TZ that's 12 hours ahead), wait for the next top-of-hour, and
the cron will pick you up.

### Notes

- **Hobby tier limit**: Vercel Hobby allows hourly crons. If you hit a limit, change the schedule in `vercel.json` to `"0 11 * * *"` (once daily at 11am UTC) and accept that everyone gets the brief at that fixed UTC time regardless of TZ.
- **Email deliverability**: Without a verified domain, ~50% of emails land in spam. For real production use, verify your own domain in Resend.
- **Per-user editing**: Users can toggle the brief on/off anytime from Settings. Their timezone is auto-detected on onboarding and editable in Settings.
