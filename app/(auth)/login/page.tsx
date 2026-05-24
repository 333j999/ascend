"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialError = params.get("error");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    // Preview mode (no Supabase env vars) — just bounce to the dashboard.
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 500));
      router.push("/app/dashboard");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/app/dashboard");
    router.refresh();
  }

  async function onGoogle() {
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Add Supabase env vars to enable Google sign-in. See DEPLOY.md.");
      return;
    }

    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success Supabase redirects to Google — no further client action needed.
  }

  return (
    <div>
      <div className="label">▢ Re-engage</div>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tightest text-ink-primary">
        Sign in
      </h1>
      <p className="mt-3 text-ink-secondary text-sm">
        Welcome back, operator. Pick up where you left off.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xs border border-signal-red/30 bg-signal-red/5">
          <AlertCircle className="size-4 text-signal-red shrink-0 mt-0.5" />
          <span className="text-sm text-ink-primary leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="relative">
          <Mail className="absolute left-3.5 top-[42px] size-4 text-ink-muted pointer-events-none" />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="operator@ascend.io"
            className="pl-10"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-[42px] size-4 text-ink-muted pointer-events-none" />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest">
          <label className="inline-flex items-center gap-2 text-ink-muted cursor-pointer">
            <input type="checkbox" className="size-3.5 accent-ember-500" />
            Remember device
          </label>
          <Link href="/login" className="text-ember-400 hover:text-ember-300 transition-colors">
            Forgot?
          </Link>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Authenticating…" : (<>Sign in <ArrowRight className="size-4" /></>)}
        </Button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-edge-subtle" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">or</span>
        <span className="h-px flex-1 bg-edge-subtle" />
      </div>

      <Button
        variant="ghost"
        size="lg"
        className="w-full"
        onClick={onGoogle}
        disabled={googleLoading}
      >
        <GoogleLogo />
        {googleLoading ? "Opening Google…" : "Continue with Google"}
      </Button>

      <p className="mt-8 text-sm text-ink-secondary text-center">
        New to ASCEND?{" "}
        <Link href="/signup" className="text-ember-400 hover:text-ember-300 transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38Z"/>
    </svg>
  );
}
