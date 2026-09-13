"use client";

import React, { useRef } from "react";
import { cn } from "./utils";

export interface SegmentItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  badge?: React.ReactNode;
}

export interface SegmentedControlClassNames {
  root?: string;
  item?: string;
  itemActive?: string;
  itemInactive?: string;
  icon?: string;
  label?: string;
  badge?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  items: Array<SegmentItem<T>>;
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  classNames?: SegmentedControlClassNames;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  size = "md",
  className = "",
  classNames = {},
  ariaLabel = "Tabs",
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // WAI-ARIA Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const nextItem = items[nextIndex];
      if (nextItem) {
        onChange(nextItem.id);
        const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
        buttons?.[nextIndex]?.focus();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-full",
        "bg-stone-100/90 dark:bg-[#161b22]/90 backdrop-blur-md",
        "border border-stone-200/80 dark:border-[#30363d] shadow-2xs",
        "overflow-x-auto no-scrollbar",
        className,
        classNames.root
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = value === item.id;

        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
              "transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]",
              size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs",
              isActive
                ? cn("bg-white dark:bg-[#21262d] text-[var(--brand)] shadow-xs font-bold", classNames.itemActive)
                : cn("text-stone-500 hover:text-stone-800 dark:text-[#8b949e] dark:hover:text-[#f0f3f6]", classNames.itemInactive),
              classNames.item
            )}
          >
            {Icon && <Icon size={size === "sm" ? 12 : 14} className={cn("shrink-0", classNames.icon)} />}
            <span className={classNames.label}>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-mono font-bold rounded-full",
                  isActive
                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "bg-stone-200 dark:bg-[#30363d] text-stone-600 dark:text-stone-400",
                  classNames.badge
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
