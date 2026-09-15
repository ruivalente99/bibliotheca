"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOptionalTheme, type ThemeMode, type AccentColor } from "./ThemeContext";
import { ACCENT_LIST } from "../tokens";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";
import { cn } from "./utils";

export interface ThemeSelectorLabels {
  light?: React.ReactNode;
  dark?: React.ReactNode;
  system?: React.ReactNode;
  accentSection?: React.ReactNode;
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
  accentContainer?: string;
}

export interface ThemeSelectorProps {
  /** Display variant: 'dropdown' with label or compact 'toggle' button */
  variant?: "dropdown" | "toggle";
  /** Controlled theme mode override */
  theme?: ThemeMode;
  /** Controlled resolved theme override */
  resolvedTheme?: "light" | "dark";
  /** Callback when theme mode changes */
  onThemeChange?: (theme: ThemeMode) => void;
  /** Controlled accent override */
  accent?: AccentColor;
  /** Callback when accent changes */
  onAccentChange?: (accent: AccentColor) => void;
  /** Whether to display the accent color swatch selector inside the dropdown. Default: false */
  showAccentPicker?: boolean;
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
  theme: controlledTheme,
  resolvedTheme: controlledResolvedTheme,
  onThemeChange,
  accent: controlledAccent,
  onAccentChange,
  showAccentPicker = false,
  labels = {},
  className = "",
  classNames = {},
  icons = {},
}: ThemeSelectorProps) {
  const context = useOptionalTheme();
  const theme: ThemeMode = controlledTheme ?? context?.theme ?? "system";
  const resolvedTheme: "light" | "dark" =
    controlledResolvedTheme ??
    context?.resolvedTheme ??
    (theme === "dark" ? "dark" : "light");

  const setTheme = (newTheme: ThemeMode) => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    } else if (context?.setTheme) {
      context.setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    if (onThemeChange) {
      onThemeChange(resolvedTheme === "dark" ? "light" : "dark");
    } else if (context?.toggleTheme) {
      context.toggleTheme();
    }
  };

  const accent: AccentColor = controlledAccent ?? context?.accent ?? "amber";
  const setAccent = (newAccent: AccentColor) => {
    if (onAccentChange) {
      onAccentChange(newAccent);
    } else if (context?.setAccent) {
      context.setAccent(newAccent);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const LightIcon = icons.light || Sun;
  const DarkIcon = icons.dark || Moon;
  const SystemIcon = icons.system || Laptop;

  const t: ThemeSelectorLabels = {
    light: labels.light ?? "Light",
    dark: labels.dark ?? "Dark",
    system: labels.system ?? "System",
    accentSection: labels.accentSection ?? "Accent Palette",
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
          "hover:text-[var(--brand)] hover:border-[var(--brand-border)]",
          "transition-all duration-200 active:scale-95 cursor-pointer",
          className,
          classNames.root,
          classNames.trigger
        )}
        aria-label={t.ariaLabel || t.toggleTitle || "Toggle theme"}
        title={t.toggleTitle || undefined}
      >
        {resolvedTheme === "dark" ? (
          <LightIcon size={16} className={cn("text-[var(--brand)] animate-in spin-in-180 duration-300", classNames.icon)} />
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
        <CurrentIcon size={13} className={cn("text-[var(--brand)] shrink-0", classNames.icon)} />
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
            "absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#161b22] rounded-2xl shadow-xl border border-stone-200 dark:border-[#30363d] p-1.5 z-50 animate-in fade-in duration-100",
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
                  if (!showAccentPicker) setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer",
                  isSelected
                    ? cn("bg-[var(--brand-soft)] text-[var(--brand)]", classNames.itemActive)
                    : cn("text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d]", classNames.itemInactive),
                  classNames.item
                )}
              >
                <Icon
                  size={14}
                  className={
                    isSelected
                      ? "text-[var(--brand)]"
                      : "text-stone-500 dark:text-[#8b949e]"
                  }
                />
                <span>{opt.label}</span>
              </button>
            );
          })}

          {showAccentPicker && (
            <div className={cn("mt-2 pt-2 border-t border-stone-100 dark:border-[#21262d] px-1", classNames.accentContainer)}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-[#8b949e] mb-1.5 px-1">
                {t.accentSection}
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-50 dark:bg-[#0d1117] rounded-xl border border-stone-200/60 dark:border-[#30363d]">
                {ACCENT_LIST.map((themeDef) => {
                  const isAccentSelected = accent === themeDef.id;
                  const swatch = resolvedTheme === "dark" ? themeDef.dark.brand : themeDef.light.brand;

                  return (
                    <button
                      key={themeDef.id}
                      type="button"
                      title={themeDef.label}
                      onClick={() => {
                        setAccent(themeDef.id);
                      }}
                      style={{ backgroundColor: swatch }}
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer",
                        "hover:scale-105 active:scale-90",
                        isAccentSelected
                          ? "ring-2 ring-stone-900 dark:ring-white scale-110 shadow-xs"
                          : "opacity-80 hover:opacity-100"
                      )}
                    >
                      {isAccentSelected && (
                        <Check size={12} className="text-white drop-shadow-sm pointer-events-none" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
