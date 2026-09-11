"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, ThemeMode } from "./ThemeContext";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface ThemeSelectorLabels {
  light?: string;
  dark?: string;
  system?: string;
  toggleTitle?: string;
}

export interface ThemeSelectorProps {
  /** Display variant: 'dropdown' with label or compact 'toggle' button */
  variant?: "dropdown" | "toggle";
  /** Custom labels for i18n support */
  labels?: ThemeSelectorLabels;
  /** Extra CSS classes */
  className?: string;
}

const DEFAULT_LABELS: Required<ThemeSelectorLabels> = {
  light: "Light",
  dark: "Dark",
  system: "System",
  toggleTitle: "Toggle color theme",
};

export function ThemeSelector({
  variant = "dropdown",
  labels = {},
  className = "",
}: ThemeSelectorProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = { ...DEFAULT_LABELS, ...labels };

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

  // Variant: Simple Toggle Button
  if (variant === "toggle") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full",
          "border border-stone-200/80 dark:border-[#363d47]",
          "bg-stone-100/70 dark:bg-[#1c2128]",
          "text-stone-600 dark:text-stone-300",
          "hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-500/50",
          "transition-all duration-200 active:scale-95 cursor-pointer",
          className
        )}
        aria-label={t.toggleTitle}
        title={t.toggleTitle}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-stone-600 animate-in spin-in-180 duration-300" />
        )}
      </button>
    );
  }

  // Variant: Dropdown Menu
  const options: Array<{ id: ThemeMode; label: string; icon: typeof Sun }> = [
    { id: "light", label: t.light, icon: Sun },
    { id: "dark", label: t.dark, icon: Moon },
    { id: "system", label: t.system, icon: Laptop },
  ];

  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;
  const currentLabel = options.find((o) => o.id === theme)?.label || theme;

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Theme: ${currentLabel}`}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          "border border-stone-200 dark:border-[#363d47]",
          "bg-white dark:bg-[#21262d] hover:bg-stone-50 dark:hover:bg-[#30363d]",
          "text-stone-700 dark:text-[#f0f3f6] text-xs font-semibold shadow-2xs",
          "transition-all duration-150 cursor-pointer"
        )}
      >
        <CurrentIcon size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="capitalize font-mono text-[11.5px]">{currentLabel}</span>
        <ChevronDown
          size={11}
          className={cn(
            "text-stone-400 dark:text-[#8b949e] transition-transform duration-150",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-[#161b22] rounded-2xl shadow-xl border border-stone-200 dark:border-[#30363d] p-1.5 z-50 animate-in fade-in duration-100">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300"
                    : "text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d]"
                )}
              >
                <Icon
                  size={14}
                  className={
                    isSelected
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-stone-500 dark:text-[#8b949e]"
                  }
                />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
