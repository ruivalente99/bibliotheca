"use client";

import React from "react";
import { cn } from "./utils";

export interface SkeletonClassNames {
  root?: string;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant. Default: "rounded" */
  variant?: "text" | "circular" | "rectangular" | "rounded";
  /** Animation style. Default: "pulse" */
  animation?: "pulse" | "none";
  /** Custom explicit width */
  width?: string | number;
  /** Custom explicit height */
  height?: string | number;
  classNames?: SkeletonClassNames;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "rounded",
      animation = "pulse",
      width,
      height,
      className = "",
      classNames = {},
      style,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      text: "h-4 w-full rounded-md",
      circular: "rounded-full shrink-0",
      rectangular: "rounded-none",
      rounded: "rounded-xl",
    };

    const animationClasses = {
      pulse: "animate-pulse",
      none: "",
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "bg-stone-200/80 dark:bg-[#21262d] select-none",
          variantClasses[variant],
          animationClasses[animation],
          className,
          classNames.root
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";
