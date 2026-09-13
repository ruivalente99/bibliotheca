"use client";

import React, { useId } from "react";
import { cn } from "./utils";

export interface SwitchClassNames {
  root?: string;
  labelContainer?: string;
  label?: string;
  description?: string;
  track?: string;
  thumb?: string;
}

export interface SwitchProps {
  /** Checked status of the toggle */
  checked: boolean;
  /** Callback when state toggles */
  onChange: (checked: boolean) => void;
  /** Primary label text */
  label?: React.ReactNode;
  /** Subtitle description text */
  description?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md";
  /** Optional custom id */
  id?: string;
  className?: string;
  classNames?: SwitchClassNames;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  id: customId,
  className = "",
  classNames = {},
}: SwitchProps) {
  const generatedId = useId();
  const id = customId || generatedId;

  const trackSizes = {
    sm: "w-8 h-4.5 p-0.5",
    md: "w-11 h-6 p-1",
  }[size];

  const thumbSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  }[size];

  const thumbTranslate = {
    sm: checked ? "translate-x-3.5" : "translate-x-0",
    md: checked ? "translate-x-5" : "translate-x-0",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3 select-none",
        disabled && "opacity-50 pointer-events-none",
        className,
        classNames.root
      )}
    >
      {(label || description) && (
        <label htmlFor={id} className={cn("cursor-pointer space-y-0.5 min-w-0 pr-2", classNames.labelContainer)}>
          {label && (
            <div className={cn("text-xs font-bold text-stone-800 dark:text-[#f0f3f6]", classNames.label)}>
              {label}
            </div>
          )}
          {description && (
            <div className={cn("text-[11px] text-stone-500 dark:text-[#8b949e]", classNames.description)}>
              {description}
            </div>
          )}
        </label>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)] focus-visible:ring-offset-2",
          trackSizes,
          checked
            ? "bg-[var(--brand)]"
            : "bg-stone-200 dark:bg-[#30363d]",
          classNames.track
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200",
            thumbSizes,
            thumbTranslate,
            classNames.thumb
          )}
        />
      </button>
    </div>
  );
}
