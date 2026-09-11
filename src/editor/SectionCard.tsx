"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../ui/utils";

export interface SectionCardClassNames {
  root?: string;
  header?: string;
  icon?: string;
  title?: string;
  badge?: string;
  actionsContainer?: string;
  collapseBtn?: string;
  body?: string;
}

export interface SectionCardProps {
  /** Unique identifier matching the target for section synchronization */
  id?: string;
  /** Section heading title */
  title: React.ReactNode;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Optional counter or badge */
  badge?: React.ReactNode;
  /** Action button rendered on the top right (e.g. Add item) */
  action?: React.ReactNode;
  /** Whether the section is currently highlighted by preview interaction */
  highlighted?: boolean;
  /** Whether the card can be collapsed. Default: false */
  collapsible?: boolean;
  /** Initial collapsed state if collapsible is true. Default: false */
  defaultCollapsed?: boolean;
  /** Accessible label when collapsed */
  expandLabel?: string;
  /** Accessible label when expanded */
  collapseLabel?: string;
  children: React.ReactNode;
  className?: string;
  classNames?: SectionCardClassNames;
}

export function SectionCard({
  id,
  title,
  icon,
  badge,
  action,
  highlighted = false,
  collapsible = false,
  defaultCollapsed = false,
  expandLabel = "Expand section",
  collapseLabel = "Collapse section",
  children,
  className = "",
  classNames = {},
}: SectionCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div
      id={id}
      tabIndex={-1}
      className={cn(
        "rounded-2xl border transition-all duration-300 outline-none",
        "bg-white dark:bg-[#161b22] border-stone-200/80 dark:border-[#30363d] shadow-2xs",
        highlighted
          ? "ring-2 ring-amber-500 border-amber-500/80 bg-amber-500/[0.03] shadow-md shadow-amber-500/10"
          : "hover:border-stone-300 dark:hover:border-[#363d47]",
        className,
        classNames.root
      )}
    >
      {/* Card Header */}
      <div className={cn("flex items-center justify-between p-4 border-b border-stone-100 dark:border-[#21262d]", classNames.header)}>
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className={cn("text-amber-600 dark:text-amber-400 shrink-0", classNames.icon)}>{icon}</span>}
          <div className={cn("text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-800 dark:text-[#f0f3f6] truncate", classNames.title)}>
            {title}
          </div>
          {badge !== undefined && (
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-stone-100 dark:bg-[#21262d] text-stone-600 dark:text-[#8b949e]", classNames.badge)}>
              {badge}
            </span>
          )}
        </div>

        <div className={cn("flex items-center gap-2 shrink-0", classNames.actionsContainer)}>
          {action}
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? expandLabel : collapseLabel}
              className={cn("p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-[#21262d] text-stone-400 dark:text-[#8b949e] transition-colors cursor-pointer", classNames.collapseBtn)}
            >
              {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      {!isCollapsed && <div className={cn("p-4 space-y-4", classNames.body)}>{children}</div>}
    </div>
  );
}
