import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, ...props }, ref) => {
    return (
      <label className="block w-full">
        {label && (
          <span className="label mb-2 block">{label}</span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-11 px-3.5 rounded-xs",
            "bg-surface-2 border border-edge-subtle",
            "text-ink-primary font-sans text-sm placeholder:text-ink-dim",
            "focus:outline-none focus:border-ember-500 focus:bg-surface-3",
            "transition-colors duration-200",
            className,
          )}
          {...props}
        />
        {hint && (
          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            {hint}
          </span>
        )}
      </label>
    );
  },
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
>(({ className, label, ...props }, ref) => {
  return (
    <label className="block w-full">
      {label && <span className="label mb-2 block">{label}</span>}
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[120px] p-3.5 rounded-xs resize-y",
          "bg-surface-2 border border-edge-subtle",
          "text-ink-primary font-sans text-sm placeholder:text-ink-dim leading-relaxed",
          "focus:outline-none focus:border-ember-500 focus:bg-surface-3",
          "transition-colors duration-200",
          className,
        )}
        {...props}
      />
    </label>
  );
});
Textarea.displayName = "Textarea";
