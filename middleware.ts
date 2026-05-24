import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes Supabase session cookies on each request.
 * Also enforces auth on protected routes (/app/*).
 *
 * NOTE: this middleware is a no-op when Supabase env vars are
 * absent — useful during local design/preview work.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      get(name) { return request.cookies.get(name)?.value; },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  const isAuthRoute = ["/login", "/signup", "/onboarding"].some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );

  if (isAppRoute && !user) {
    const redirect = new URL("/login", request.url);
    redirect.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }

  if (isAuthRoute && user && request.nextUrl.pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\.svg).*)"],
};
