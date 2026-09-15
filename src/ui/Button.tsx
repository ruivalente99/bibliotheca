"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export interface ButtonClassNames {
  root?: string;
  spinner?: string;
  iconLeft?: string;
  iconRight?: string;
  label?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "ghost" | "danger" | "pill" | "outline";
  /** Size variant */
  size?: "sm" | "md" | "lg" | "icon";
  /** Shows an integrated spinning loader */
  loading?: boolean;
  /** Optional icon component rendered on the left */
  iconLeft?: React.ReactNode;
  /** Optional icon component rendered on the right */
  iconRight?: React.ReactNode;
  /** Granular class overrides for internal sub-elements */
  classNames?: ButtonClassNames;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "secondary",
      size = "md",
      loading = false,
      disabled = false,
      iconLeft,
      iconRight,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold transition-transform transition-colors duration-150 ease-out cursor-pointer select-none active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]";

    const variantClasses = {
      primary:
        "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white shadow-xs",
      secondary:
        "bg-stone-100 hover:bg-stone-200 dark:bg-[#21262d] dark:hover:bg-[#30363d] text-stone-700 dark:text-[#c9d1d9] border border-stone-200/80 dark:border-[#363d47]",
      outline:
        "bg-transparent hover:bg-stone-100 dark:hover:bg-[#21262d] text-stone-700 dark:text-[#c9d1d9] border border-stone-300 dark:border-[#363d47]",
      ghost:
        "text-stone-600 dark:text-[#8b949e] hover:text-stone-900 dark:hover:text-[#f0f3f6] hover:bg-stone-100 dark:hover:bg-[#21262d]",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-xs dark:bg-rose-700 dark:hover:bg-rose-600",
      pill:
        "bg-white dark:bg-[#21262d] text-stone-700 dark:text-[#c9d1d9] border border-stone-200 dark:border-[#30363d] shadow-2xs hover:border-[var(--brand-light)] rounded-full",
    };

    const sizeClasses = {
      sm: "text-xs px-2.5 py-1 rounded-lg gap-1.5",
      md: "text-xs px-3.5 py-2 rounded-xl gap-2",
      lg: "text-sm px-4 py-2.5 rounded-2xl gap-2.5",
      icon: "p-2 rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          baseClasses,
          variantClasses[variant],
          variant === "pill" ? "rounded-full" : sizeClasses[size],
          className,
          classNames.root
        )}
        {...props}
      >
        {loading && <Loader2 className={cn("w-3.5 h-3.5 animate-spin", classNames.spinner)} />}
        {!loading && iconLeft && <span className={cn("shrink-0", classNames.iconLeft)}>{iconLeft}</span>}
        {children !== undefined && children !== null && (
          <span className={cn("truncate", classNames.label)}>{children}</span>
        )}
        {!loading && iconRight && <span className={cn("shrink-0", classNames.iconRight)}>{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
