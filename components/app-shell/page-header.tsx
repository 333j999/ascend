import { cn } from "@/lib/utils";

type Props = {
  code: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({ code, title, subtitle, action, className }: Props) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8", className)}>
      <div>
        <div className="label">{code}</div>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-medium tracking-tightest text-ink-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-ink-secondary max-w-xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
