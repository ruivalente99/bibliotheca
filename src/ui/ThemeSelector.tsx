"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, ThemeMode } from "./ThemeContext";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface ThemeSelectorLabels {
  light?: React.ReactNode;
  dark?: React.ReactNode;
  system?: React.ReactNode;
  toggleTitle?: string;
  ariaLabel?: string;
}

export interface ThemeSelectorClassNames {
  root?: string;
  trigger?: string;
  icon?: string;
  label?: string;
  chevron?: string;
  dropdown?: string;
  item?: string;
  itemActive?: string;
  itemInactive?: string;
}

export interface ThemeSelectorProps {
  /** Display variant: 'dropdown' with label or compact 'toggle' button */
  variant?: "dropdown" | "toggle";
  /** Labels for i18n support */
  labels?: ThemeSelectorLabels;
  /** Root class name */
  className?: string;
  /** Granular slot class overrides */
  classNames?: ThemeSelectorClassNames;
  /** Custom icons map */
  icons?: {
    light?: React.ComponentType<{ size?: number; className?: string }>;
    dark?: React.ComponentType<{ size?: number; className?: string }>;
    system?: React.ComponentType<{ size?: number; className?: string }>;
  };
}

export function ThemeSelector({
  variant = "dropdown",
  labels = {},
  className = "",
  classNames = {},
  icons = {},
}: ThemeSelectorProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const LightIcon = icons.light || Sun;
  const DarkIcon = icons.dark || Moon;
  const SystemIcon = icons.system || Laptop;

  const t: ThemeSelectorLabels = {
    light: labels.light ?? "Light",
    dark: labels.dark ?? "Dark",
    system: labels.system ?? "System",
    toggleTitle: labels.toggleTitle ?? "",
    ariaLabel: labels.ariaLabel,
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
          className,
          classNames.root,
          classNames.trigger
        )}
        aria-label={t.toggleTitle || t.ariaLabel || "Toggle theme"}
        title={t.toggleTitle || undefined}
      >
        {resolvedTheme === "dark" ? (
          <LightIcon size={16} className={cn("text-amber-400 animate-in spin-in-180 duration-300", classNames.icon)} />
        ) : (
          <DarkIcon size={16} className={cn("text-stone-600 animate-in spin-in-180 duration-300", classNames.icon)} />
        )}
      </button>
    );
  }

  // Variant: Dropdown Menu
  const options: Array<{
    id: ThemeMode;
    label: React.ReactNode;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    { id: "light", label: t.light, icon: LightIcon },
    { id: "dark", label: t.dark, icon: DarkIcon },
    { id: "system", label: t.system, icon: SystemIcon },
  ];

  const CurrentIcon = resolvedTheme === "dark" ? DarkIcon : LightIcon;
  const currentLabel = options.find((o) => o.id === theme)?.label || theme;

  return (
    <div className={cn("relative inline-block", className, classNames.root)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.ariaLabel || "Select theme"}
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          "border border-stone-200 dark:border-[#363d47]",
          "bg-white dark:bg-[#21262d] hover:bg-stone-50 dark:hover:bg-[#30363d]",
          "text-stone-700 dark:text-[#f0f3f6] text-xs font-semibold shadow-2xs",
          "transition-all duration-150 cursor-pointer",
          classNames.trigger
        )}
      >
        <CurrentIcon size={13} className={cn("text-amber-600 dark:text-amber-400 shrink-0", classNames.icon)} />
        <span className={cn("capitalize font-mono text-[11.5px]", classNames.label)}>{currentLabel}</span>
        <ChevronDown
          size={11}
          className={cn(
            "text-stone-400 dark:text-[#8b949e] transition-transform duration-150",
            isOpen && "rotate-180",
            classNames.chevron
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-1.5 w-40 bg-white dark:bg-[#161b22] rounded-2xl shadow-xl border border-stone-200 dark:border-[#30363d] p-1.5 z-50 animate-in fade-in duration-100",
            classNames.dropdown
          )}
        >
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
                    ? cn("bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300", classNames.itemActive)
                    : cn("text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d]", classNames.itemInactive),
                  classNames.item
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
