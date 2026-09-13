"use client";

import React from "react";
import { cn } from "./utils";

export interface EmptyStateClassNames {
  root?: string;
  iconWrapper?: string;
  title?: string;
  description?: string;
  actionsContainer?: string;
}

export interface EmptyStateProps {
  /** Decorative icon or illustration */
  icon?: React.ReactNode;
  /** Primary title text */
  title: React.ReactNode;
  /** Explanatory description */
  description?: React.ReactNode;
  /** Primary action slot (e.g. Button to add an item) */
  action?: React.ReactNode;
  /** Optional secondary action slot */
  secondaryAction?: React.ReactNode;
  /** Visual style: 'dashed' border or 'plain' flat background */
  variant?: "dashed" | "plain";
  className?: string;
  classNames?: EmptyStateClassNames;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "dashed",
  className = "",
  classNames = {},
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl select-none",
        variant === "dashed"
          ? "border-2 border-dashed border-stone-200 dark:border-[#30363d] bg-stone-50/50 dark:bg-[#0d1117]/50"
          : "bg-transparent",
        className,
        classNames.root
      )}
    >
      {icon && (
        <div
          className={cn(
            "w-12 h-12 rounded-2xl mb-3 flex items-center justify-center",
            "bg-[var(--brand-soft)] text-[var(--brand)] shadow-2xs",
            classNames.iconWrapper
          )}
        >
          {icon}
        </div>
      )}

      <h4
        className={cn(
          "text-sm font-bold text-stone-800 dark:text-[#f0f3f6] max-w-sm",
          classNames.title
        )}
      >
        {title}
      </h4>

      {description && (
        <p
          className={cn(
            "text-xs text-stone-500 dark:text-[#8b949e] max-w-sm mt-1 leading-relaxed",
            classNames.description
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div
          className={cn(
            "flex items-center justify-center gap-2 mt-4 flex-wrap",
            classNames.actionsContainer
          )}
        >
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
