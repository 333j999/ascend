import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof JSX.IntrinsicElements;
  interactive?: boolean;
  bare?: boolean;
};

export function Card({
  as = "div",
  className,
  interactive,
  bare,
  ...rest
}: CardProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn(
        bare ? "" : interactive ? "card-interactive" : "card",
        "p-5",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  label,
  title,
  action,
  className,
}: {
  label?: string;
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div className="space-y-1">
        {label ? <div className="label">{label}</div> : null}
        {title ? (
          <div className="font-display text-[15px] font-medium tracking-tight text-ink-primary">
            {title}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
