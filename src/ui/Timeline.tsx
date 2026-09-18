"use client";

import React from "react";
import { cn } from "./utils";

export interface TimelineClassNames {
  root?: string;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  classNames?: TimelineClassNames;
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ children, className = "", classNames = {}, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn("relative flex flex-col space-y-6 list-none p-0 m-0", className, classNames.root)}
        {...props}
      >
        {children}
      </ol>
    );
  }
);
Timeline.displayName = "Timeline";

export interface TimelineItemClassNames {
  root?: string;
  indicatorWrapper?: string;
  indicator?: string;
  connector?: string;
  content?: string;
  header?: string;
  date?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  body?: string;
  action?: string;
}

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** Date string or node */
  date?: React.ReactNode;
  /** Primary event title */
  title: React.ReactNode;
  /** Secondary subtitle (e.g. company, institution) */
  subtitle?: React.ReactNode;
  /** Badge node (e.g. full-time, active, degree) */
  badge?: React.ReactNode;
  /** Custom node indicator icon or element */
  icon?: React.ReactNode;
  /** Highlights the current item with brand color */
  active?: boolean;
  /** Interactive action or link */
  action?: React.ReactNode;
  /** Whether to suppress connector line below (automatically applied to last child if desired) */
  isLast?: boolean;
  classNames?: TimelineItemClassNames;
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      date,
      title,
      subtitle,
      badge,
      icon,
      active = false,
      action,
      isLast = false,
      children,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    return (
      <li
        ref={ref}
        className={cn("relative flex gap-4 text-left group", className, classNames.root)}
        {...props}
      >
        {/* Node indicator & vertical connector line */}
        <div
          className={cn(
            "relative flex flex-col items-center shrink-0 w-6 pt-1",
            classNames.indicatorWrapper
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center w-5 h-5 rounded-full border-2 text-[10px] z-10 transition-colors bg-white dark:bg-[#161b22]",
              active
                ? "border-[var(--brand)] text-[var(--brand)] shadow-xs"
                : "border-stone-300 dark:border-[#363d47] text-stone-500 dark:text-[#8b949e]",
              classNames.indicator
            )}
            aria-hidden="true"
          >
            {icon ? icon : <span className={cn("w-2 h-2 rounded-full", active ? "bg-[var(--brand)]" : "bg-stone-400 dark:bg-[#484f58]")} />}
          </span>

          {!isLast && (
            <span
              className={cn(
                "absolute top-7 bottom-0 w-0.5 bg-stone-200 dark:bg-[#30363d] -mb-6",
                classNames.connector
              )}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Content pane */}
        <div className={cn("flex-1 pb-2 min-w-0", classNames.content)}>
          <div className={cn("flex flex-wrap items-center justify-between gap-2 mb-1", classNames.header)}>
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span
                className={cn(
                  "text-sm font-bold tracking-tight text-stone-900 dark:text-[#f0f3f6] truncate",
                  classNames.title
                )}
              >
                {title}
              </span>
              {badge && (
                <span className={cn("shrink-0", classNames.badge)}>{badge}</span>
              )}
            </div>
            {date && (
              <span
                className={cn(
                  "text-xs font-mono text-stone-500 dark:text-[#8b949e] shrink-0",
                  classNames.date
                )}
              >
                {date}
              </span>
            )}
          </div>

          {(subtitle || action) && (
            <div className="flex items-center justify-between gap-2 mb-2">
              {subtitle && (
                <span
                  className={cn(
                    "text-xs font-medium text-stone-600 dark:text-[#8b949e]",
                    classNames.subtitle
                  )}
                >
                  {subtitle}
                </span>
              )}
              {action && (
                <span className={cn("shrink-0", classNames.action)}>{action}</span>
              )}
            </div>
          )}

          {children && (
            <div
              className={cn(
                "text-xs text-stone-600 dark:text-[#8b949e] leading-relaxed mt-2",
                classNames.body
              )}
            >
              {children}
            </div>
          )}
        </div>
      </li>
    );
  }
);
TimelineItem.displayName = "TimelineItem";
