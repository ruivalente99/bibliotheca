"use client";

import React from "react";
import { cn } from "./utils";

export interface SeparatorClassNames {
  root?: string;
  line?: string;
  label?: string;
}

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the separator. Default: "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Whether the separator is purely decorative. If false, renders role="separator". Default: true */
  decorative?: boolean;
  /** Optional centered text label or icon (horizontal only) */
  label?: React.ReactNode;
  classNames?: SeparatorClassNames;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      decorative = true,
      label,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal";

    if (isHorizontal && label) {
      return (
        <div
          ref={ref}
          role={decorative ? "none" : "separator"}
          aria-orientation="horizontal"
          className={cn(
            "flex items-center w-full my-4 text-xs font-medium text-stone-500 dark:text-[#8b949e]",
            className,
            classNames.root
          )}
          {...props}
        >
          <div className={cn("flex-1 h-px bg-stone-200 dark:bg-[#30363d]", classNames.line)} />
          <span className={cn("px-3 shrink-0", classNames.label)}>{label}</span>
          <div className={cn("flex-1 h-px bg-stone-200 dark:bg-[#30363d]", classNames.line)} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-stone-200 dark:bg-[#30363d]",
          isHorizontal ? "h-px w-full my-2" : "w-px h-full mx-2 self-stretch min-h-4",
          className,
          classNames.root
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";
