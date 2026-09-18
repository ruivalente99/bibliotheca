"use client";

import React from "react";
import { cn } from "./utils";

export interface BentoGridClassNames {
  root?: string;
}

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column count for desktop breakpoint. Default: 4 */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  /** Gap scale. Default: "md" */
  gap?: "none" | "sm" | "md" | "lg";
  classNames?: BentoGridClassNames;
}

const colsClassMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12",
};

const gapClassMap = {
  none: "gap-0",
  sm: "gap-2.5",
  md: "gap-4",
  lg: "gap-6",
};

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ children, cols = 4, gap = "md", className = "", classNames = {}, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full auto-rows-auto",
          colsClassMap[cols] || colsClassMap[4],
          gapClassMap[gap],
          className,
          classNames.root
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = "BentoGrid";

export interface BentoCardClassNames {
  root?: string;
  header?: string;
  icon?: string;
  title?: string;
  description?: string;
  badge?: string;
  content?: string;
  footer?: string;
}

export interface BentoCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Responsive column span. Default: 1 */
  colSpan?: 1 | 2 | 3 | 4 | "full";
  /** Responsive row span. Default: 1 */
  rowSpan?: 1 | 2 | 3;
  /** Surface visual variant. Default: "default" */
  variant?: "default" | "subtle" | "outline" | "glass" | "ghost";
  /** Elevates surface on hover */
  hoverable?: boolean;
  /** Clickable cursor and active tap feedback */
  interactive?: boolean;
  /** Optional icon in header */
  icon?: React.ReactNode;
  /** Title text or node */
  title?: React.ReactNode;
  /** Subtitle or description node */
  description?: React.ReactNode;
  /** Optional badge in header */
  badge?: React.ReactNode;
  /** Custom header replacement slot */
  header?: React.ReactNode;
  /** Footer content or actions */
  footer?: React.ReactNode;
  classNames?: BentoCardClassNames;
}

const colSpanClassMap: Record<string | number, string> = {
  1: "lg:col-span-1",
  2: "sm:col-span-2 lg:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
  full: "col-span-full",
};

const rowSpanClassMap: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      children,
      colSpan = 1,
      rowSpan = 1,
      variant = "default",
      hoverable = false,
      interactive = false,
      icon,
      title,
      description,
      badge,
      header,
      footer,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default:
        "bg-white dark:bg-[#161b22] border-stone-200/80 dark:border-[#30363d] shadow-2xs",
      subtle:
        "bg-stone-50 dark:bg-[#0d1117] border-stone-200/60 dark:border-[#21262d]",
      outline:
        "bg-transparent border-stone-200 dark:border-[#363d47]",
      glass:
        "bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-md border-stone-200/60 dark:border-[#30363d]/60 shadow-xs",
      ghost:
        "bg-transparent border-transparent",
    };

    const hasHeader = header || title || icon || badge;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border transition-all duration-200 text-[var(--heading)] flex flex-col overflow-hidden relative",
          colSpanClassMap[colSpan] || colSpanClassMap[1],
          rowSpanClassMap[rowSpan] || rowSpanClassMap[1],
          variantClasses[variant],
          hoverable && "hover:shadow-md hover:border-stone-300 dark:hover:border-[#484f58]",
          interactive && "cursor-pointer active:scale-[0.99] select-none",
          className,
          classNames.root
        )}
        {...props}
      >
        {hasHeader && (
          <div
            className={cn(
              "flex items-start justify-between gap-3 p-5 pb-3",
              classNames.header
            )}
          >
            {header ? (
              header
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  {icon && (
                    <span className={cn("text-[var(--brand)] shrink-0", classNames.icon)}>
                      {icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    {title && (
                      <h3
                        className={cn(
                          "text-sm font-bold tracking-tight text-stone-900 dark:text-[#f0f3f6] truncate",
                          classNames.title
                        )}
                      >
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p
                        className={cn(
                          "text-xs text-stone-500 dark:text-[#8b949e] mt-0.5 line-clamp-2",
                          classNames.description
                        )}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                {badge && (
                  <span className={cn("shrink-0", classNames.badge)}>{badge}</span>
                )}
              </>
            )}
          </div>
        )}

        {children && (
          <div
            className={cn(
              "p-5 flex-1",
              hasHeader && "pt-1",
              footer && "pb-3",
              classNames.content
            )}
          >
            {children}
          </div>
        )}

        {footer && (
          <div
            className={cn(
              "flex items-center justify-between p-5 pt-0 border-t border-stone-100 dark:border-[#21262d] mt-auto",
              classNames.footer
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);
BentoCard.displayName = "BentoCard";
