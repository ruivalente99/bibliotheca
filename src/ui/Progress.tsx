"use client";

import React from "react";
import { cn } from "./utils";

export interface ProgressClassNames {
  root?: string;
  header?: string;
  label?: string;
  valueLabel?: string;
  track?: string;
  indicator?: string;
}

export interface ProgressProps {
  /** Current progress value (between 0 and max) */
  value?: number;
  /** Maximum progress value. Default: 100 */
  max?: number;
  /** Whether the progress is in an indeterminate loading state */
  indeterminate?: boolean;
  /** Optional accessible label displayed above the bar */
  label?: React.ReactNode;
  /** Whether to render the formatted numeric percentage */
  showValueLabel?: boolean;
  /** Height dimension preset */
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  classNames?: ProgressClassNames;
}

export function Progress({
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  showValueLabel = false,
  size = "md",
  className = "",
  classNames = {},
}: ProgressProps) {
  const percentage = indeterminate
    ? undefined
    : Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }[size];

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={indeterminate ? "Loading..." : `${percentage}%`}
      className={cn("w-full flex flex-col gap-1.5", className, classNames.root)}
    >
      {(label || showValueLabel) && (
        <div className={cn("flex items-center justify-between text-xs", classNames.header)}>
          {label && (
            <span className={cn("font-medium text-[var(--heading)]", classNames.label)}>
              {label}
            </span>
          )}
          {showValueLabel && !indeterminate && (
            <span className={cn("font-mono text-[var(--body-subtle)] font-semibold", classNames.valueLabel)}>
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-[var(--control-fill)] border border-[var(--border-subtle)]",
          sizeClasses,
          classNames.track
        )}
      >
        <div
          style={{ width: indeterminate ? "100%" : `${percentage}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out bg-[var(--brand)]",
            indeterminate && "animate-pulse bg-gradient-to-r from-[var(--brand)] via-[var(--brand-light)] to-[var(--brand)]",
            classNames.indicator
          )}
        />
      </div>
    </div>
  );
}
