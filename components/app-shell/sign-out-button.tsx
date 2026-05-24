"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function SignOutButton() {
  const router = useRouter();

  async function onClick() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={onClick} className="btn-link inline-flex items-center gap-2">
      <LogOut className="size-3.5" /> Exit
    </button>
  );
}
