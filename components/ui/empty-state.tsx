import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon?: React.ReactNode;
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon, label = "▢ Nothing yet", title, description, action, className,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center text-center px-4 py-12", className)}>
      {icon && (
        <div className="size-12 rounded-xs border border-edge-subtle bg-surface-3/40 grid place-items-center text-ink-muted mb-4">
          {icon}
        </div>
      )}
      <div className="label">{label}</div>
      <div className="mt-2 font-display text-base font-medium tracking-tight text-ink-primary">{title}</div>
      {description && (
        <p className="mt-1.5 text-sm text-ink-secondary max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
