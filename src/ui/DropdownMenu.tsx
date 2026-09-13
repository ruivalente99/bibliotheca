"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "./utils";

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuClassNames {
  root?: string;
  trigger?: string;
  menu?: string;
  item?: string;
  divider?: string;
  shortcut?: string;
}

export interface DropdownMenuProps {
  /** Trigger element (e.g. Button or icon button) */
  trigger: React.ReactNode;
  /** Array of menu action items */
  items: DropdownMenuItem[];
  /** Horizontal alignment: 'left' or 'right' */
  align?: "left" | "right";
  className?: string;
  classNames?: DropdownMenuClassNames;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className = "",
  classNames = {},
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const alignmentClass = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={containerRef} className={cn("relative inline-block", className, classNames.root)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn("inline-flex items-center cursor-pointer", classNames.trigger)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "absolute mt-1.5 w-48 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in duration-100",
            "bg-white dark:bg-[#161b22] border border-stone-200 dark:border-[#30363d] text-[var(--heading)]",
            alignmentClass,
            classNames.menu
          )}
        >
          {items.map((item) => {
            if (item.divider) {
              return (
                <div
                  key={item.id}
                  className={cn(
                    "my-1 h-[1px] bg-stone-100 dark:bg-[#21262d]",
                    classNames.divider
                  )}
                  role="separator"
                />
              );
            }

            const Icon = item.icon;

            return (
              <button
                key={item.id}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none text-left",
                  item.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                  item.destructive
                    ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    : "text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d] hover:text-stone-900 dark:hover:text-white",
                  classNames.item
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {Icon && <Icon size={14} className="shrink-0 opacity-75" />}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className={cn("font-mono text-[10px] text-stone-400 dark:text-[#8b949e] shrink-0", classNames.shortcut)}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
