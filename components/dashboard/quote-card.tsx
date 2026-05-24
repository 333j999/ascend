import { Quote } from "lucide-react";
import { getTodayQuote } from "@/lib/mock-data";

export function QuoteCard() {
  const q = getTodayQuote();
  return (
    <div className="relative card p-6 bg-gradient-to-br from-surface-2 to-surface-1 overflow-hidden">
      {/* Decorative quote mark */}
      <Quote className="absolute -top-2 -right-2 size-16 text-ember-500/10" strokeWidth={1} />

      <div className="label">▢ Daily Brief</div>
      <blockquote className="mt-3 font-display text-lg leading-relaxed text-ink-primary tracking-tight">
        &ldquo;{q.text}&rdquo;
      </blockquote>
      <div className="mt-4 flex items-center gap-2">
        <span className="h-px flex-1 bg-edge" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ember-400">— {q.author}</span>
      </div>
    </div>
  );
}
