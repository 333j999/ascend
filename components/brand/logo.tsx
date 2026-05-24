import { cn } from "@/lib/utils";

/**
 * ASCEND brand mark.
 * Geometric ascending bars + wordmark. Single ember accent.
 */
export function Logo({
  className,
  mark = false,
  size = "md",
}: {
  className?: string;
  mark?: boolean;             // mark-only (square)
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? 18 : size === "lg" ? 28 : 22;
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width={dim} height={dim} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2"  y="14" width="3" height="8" rx="0.5" fill="#3a3a44" />
        <rect x="7"  y="10" width="3" height="12" rx="0.5" fill="#6b6b73" />
        <rect x="12" y="6"  width="3" height="16" rx="0.5" fill="#a3a3a8" />
        <rect x="17" y="2"  width="3" height="20" rx="0.5" fill="#ff5e1a" />
      </svg>
      {!mark && (
        <span className="font-display font-medium text-[15px] tracking-[0.18em] uppercase text-ink-primary">
          Ascend
        </span>
      )}
    </div>
  );
}
