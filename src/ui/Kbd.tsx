"use client";

import React from "react";
import { cn } from "./utils";

export interface KbdClassNames {
  root?: string;
  key?: string;
  separator?: string;
}

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of shortcut key identifiers (e.g. ["mod", "k"], ["shift", "enter"]) */
  keys?: string[];
  /** Visual variant. Default: "default" */
  variant?: "default" | "outline" | "subtle";
  /** Size scale. Default: "sm" */
  size?: "xs" | "sm" | "md";
  classNames?: KbdClassNames;
}

const keySymbolMap: Record<string, string> = {
  mod: "⌘",
  cmd: "⌘",
  command: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  opt: "⌥",
  option: "⌥",
  shift: "⇧",
  enter: "↵",
  return: "↵",
  tab: "⇥",
  backspace: "⌫",
  delete: "⌦",
  esc: "Esc",
  escape: "Esc",
  space: "␣",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  (
    {
      children,
      keys,
      variant = "default",
      size = "sm",
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: "text-[10px] px-1 py-0.5 min-h-4 min-w-4 gap-0.5",
      sm: "text-xs px-1.5 py-0.5 min-h-5 min-w-5 gap-1",
      md: "text-xs px-2 py-1 min-h-6 min-w-6 gap-1.5",
    };

    const variantClasses = {
      default:
        "bg-stone-100 dark:bg-[#21262d] text-stone-700 dark:text-[#c9d1d9] border-stone-300 dark:border-[#363d47] shadow-2xs",
      outline:
        "bg-transparent text-stone-700 dark:text-[#c9d1d9] border-stone-300 dark:border-[#363d47]",
      subtle:
        "bg-stone-50 dark:bg-[#161b22] text-stone-600 dark:text-[#8b949e] border-stone-200/80 dark:border-[#21262d]",
    };

    const renderKeyLabel = (key: string) => {
      const normalized = key.toLowerCase();
      return keySymbolMap[normalized] || key.toUpperCase();
    };

    return (
      <kbd
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-mono font-medium rounded-md border select-none transition-colors align-middle",
          sizeClasses[size],
          variantClasses[variant],
          className,
          classNames.root
        )}
        {...props}
      >
        {keys && keys.length > 0 ? (
          keys.map((k, idx) => (
            <React.Fragment key={idx}>
              <span className={classNames.key}>{renderKeyLabel(k)}</span>
              {idx < keys.length - 1 && (
                <span className={cn("opacity-40", classNames.separator)}>+</span>
              )}
            </React.Fragment>
          ))
        ) : (
          <span className={classNames.key}>{children}</span>
        )}
      </kbd>
    );
  }
);
Kbd.displayName = "Kbd";
