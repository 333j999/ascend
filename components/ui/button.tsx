import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "minimal";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  minimal:
    "inline-flex items-center gap-1.5 text-ink-secondary hover:text-ink-primary " +
    "font-mono text-[11px] uppercase tracking-widest transition-colors",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[10px]",
  md: "",
  lg: "h-12 px-7 text-[12px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(variantClass[variant], sizeClass[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
