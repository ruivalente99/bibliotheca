"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, type AccentColor } from "./ThemeContext";
import { ACCENT_THEMES, ACCENT_LIST } from "../tokens";
import { Check, ChevronDown, Palette } from "lucide-react";
import { cn } from "./utils";

export interface AccentSelectorClassNames {
  root?: string;
  trigger?: string;
  swatch?: string;
  label?: string;
  dropdown?: string;
  item?: string;
}

export interface AccentSelectorProps {
  /** Visual presentation: 'swatches' row or 'dropdown' menu */
  variant?: "swatches" | "dropdown";
  /** Optional size for swatches: 'sm' (24px), 'md' (32px), 'lg' (40px) */
  size?: "sm" | "md" | "lg";
  /** Controlled accent override */
  value?: AccentColor;
  /** Callback when accent changes */
  onChange?: (accent: AccentColor) => void;
  /** Accessible label */
  ariaLabel?: string;
  className?: string;
  classNames?: AccentSelectorClassNames;
}

export function AccentSelector({
  variant = "swatches",
  size = "md",
  value: controlledValue,
  onChange,
  ariaLabel = "Select accent color",
  className = "",
  classNames = {},
}: AccentSelectorProps) {
  const { accent: contextAccent, setAccent: contextSetAccent, resolvedTheme } = useTheme();
  const activeAccent = controlledValue ?? contextAccent;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (accent: AccentColor) => {
    if (onChange) {
      onChange(accent);
    } else {
      contextSetAccent(accent);
    }
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (variant !== "dropdown") return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, variant]);

  const swatchSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const checkSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  if (variant === "swatches") {
    return (
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-100/90 dark:bg-[#161b22]/90 border border-stone-200/80 dark:border-[#30363d]",
          className,
          classNames.root
        )}
      >
        {ACCENT_LIST.map((theme) => {
          const isSelected = activeAccent === theme.id;
          const previewColor = resolvedTheme === "dark" ? theme.dark.brand : theme.light.brand;

          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={`${theme.label}: ${theme.description}`}
              onClick={() => handleSelect(theme.id)}
              style={{ backgroundColor: previewColor }}
              className={cn(
                swatchSizes[size],
                "rounded-full flex items-center justify-center transition-all cursor-pointer relative",
                "active:scale-90 hover:scale-105 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isSelected
                  ? "scale-110 ring-2 ring-stone-900 dark:ring-white ring-offset-2 dark:ring-offset-[#161b22] shadow-sm"
                  : "opacity-85 hover:opacity-100",
                classNames.swatch
              )}
            >
              {isSelected && (
                <Check
                  size={checkSizes[size]}
                  className="text-white drop-shadow-sm pointer-events-none"
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: Dropdown
  const activeDef = ACCENT_THEMES[activeAccent] || ACCENT_THEMES.amber;
  const activeColor = resolvedTheme === "dark" ? activeDef.dark.brand : activeDef.light.brand;

  return (
    <div className={cn("relative inline-block", className, classNames.root)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "border border-stone-200 dark:border-[#363d47]",
          "bg-white dark:bg-[#21262d] hover:bg-stone-50 dark:hover:bg-[#30363d]",
          "text-stone-700 dark:text-[#f0f3f6] text-xs font-semibold shadow-2xs",
          "transition-all duration-150 cursor-pointer",
          classNames.trigger
        )}
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
          style={{ backgroundColor: activeColor }}
        />
        <span className={cn("font-medium text-[11.5px]", classNames.label)}>{activeDef.label}</span>
        <ChevronDown
          size={12}
          className={cn(
            "text-stone-400 dark:text-[#8b949e] transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#161b22] rounded-2xl shadow-xl border border-stone-200 dark:border-[#30363d] p-1.5 z-50 animate-in fade-in duration-100",
            classNames.dropdown
          )}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-[#8b949e] border-b border-stone-100 dark:border-[#21262d] mb-1 flex items-center gap-1.5">
            <Palette size={11} />
            <span>Accent Themes</span>
          </div>

          {ACCENT_LIST.map((theme) => {
            const isSelected = activeAccent === theme.id;
            const swatchColor = resolvedTheme === "dark" ? theme.dark.brand : theme.light.brand;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelect(theme.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-stone-100 dark:bg-[#21262d] text-stone-900 dark:text-white font-bold"
                    : "text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-50 dark:hover:bg-[#1c2128]",
                  classNames.item
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: swatchColor }}
                  />
                  <span className="truncate">{theme.label}</span>
                </div>
                {isSelected && <Check size={13} className="shrink-0 text-[var(--brand)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
