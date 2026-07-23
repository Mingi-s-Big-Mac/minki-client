import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label shown above the input. */
  label: string;
}

/**
 * Labelled text input matching the auth-form fields in the Figma design:
 * a 12px label above a dark field (azure/12) with a subtle border.
 */
export function TextField({ label, className, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs text-ink-subtle">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-sm border border-line-strong bg-field px-[13px] py-[11px]",
          "text-[14px] text-porcelain placeholder:text-ink-muted",
          "outline-none transition-colors focus:border-primary",
          className,
        )}
        {...props}
      />
    </div>
  );
}
