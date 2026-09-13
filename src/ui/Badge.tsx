"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface BadgeClassNames {
  root?: string;
  dot?: string;
  icon?: string;
  label?: string;
  removeButton?: string;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: "default" | "brand" | "secondary" | "outline" | "success" | "warning" | "danger";
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /** Whether to render a colored status indicator dot */
  dot?: boolean;
  /** Optional icon displayed before the label */
  icon?: React.ReactNode;
  /** Whether the badge can be dismissed with a close button */
  removable?: boolean;
  /** Callback fired when the remove button is clicked */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for the remove button */
  removeAriaLabel?: string;
  className?: string;
  classNames?: BadgeClassNames;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  removable = false,
  onRemove,
  removeAriaLabel = "Remove tag",
  className = "",
  classNames = {},
  ...props
}: BadgeProps) {
  const variantClasses = {
    default:
      "bg-stone-100 text-stone-700 border-stone-200/80 dark:bg-[#21262d] dark:text-[#c9d1d9] dark:border-[#30363d]",
    brand:
      "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-border)] dark:border-[var(--brand-border)]",
    secondary:
      "bg-stone-200/70 text-stone-800 border-stone-300 dark:bg-[#161b22] dark:text-[#f0f3f6] dark:border-[#363d47]",
    outline:
      "bg-transparent text-stone-700 border-stone-300 dark:text-[#c9d1d9] dark:border-[#363d47]",
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-300/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    warning:
      "bg-amber-50 text-amber-800 border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    danger:
      "bg-rose-50 text-rose-700 border-rose-300/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  };

  const dotColorClasses = {
    default: "bg-stone-400 dark:bg-stone-500",
    brand: "bg-[var(--brand)]",
    secondary: "bg-stone-600 dark:bg-stone-300",
    outline: "bg-stone-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11.5px] px-2.5 py-0.5 gap-1.5",
    lg: "text-xs px-3 py-1 gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors select-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
        classNames.root
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColorClasses[variant],
            classNames.dot
          )}
          aria-hidden="true"
        />
      )}
      {icon && <span className={cn("shrink-0", classNames.icon)}>{icon}</span>}
      <span className={cn("truncate", classNames.label)}>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeAriaLabel}
          className={cn(
            "ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer",
            classNames.removeButton
          )}
        >
          <X size={size === "sm" ? 10 : 12} />
        </button>
      )}
    </span>
  );
}
