"use client";

import React from "react";
import { cn } from "./utils";

export interface SegmentItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number | string;
}

export interface SegmentedControlProps<T extends string = string> {
  items: Array<SegmentItem<T>>;
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  size = "md",
  className = "",
  ariaLabel = "Segmented tab options",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-full",
        "bg-stone-100/90 dark:bg-[#161b22]/90 backdrop-blur-md",
        "border border-stone-200/80 dark:border-[#30363d] shadow-2xs",
        "overflow-x-auto no-scrollbar",
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = value === item.id;

        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
              "transition-all duration-150 cursor-pointer select-none",
              size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs",
              isActive
                ? "bg-white dark:bg-[#21262d] text-amber-700 dark:text-amber-400 shadow-xs font-bold"
                : "text-stone-500 hover:text-stone-800 dark:text-[#8b949e] dark:hover:text-[#f0f3f6]"
            )}
          >
            {Icon && <Icon size={size === "sm" ? 12 : 14} className="shrink-0" />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-mono font-bold rounded-full",
                  isActive
                    ? "bg-amber-500/20 text-amber-800 dark:text-amber-300"
                    : "bg-stone-200 dark:bg-[#30363d] text-stone-600 dark:text-stone-400"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
