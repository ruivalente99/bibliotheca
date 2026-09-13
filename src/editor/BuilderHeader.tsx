"use client";

import React from "react";
import { NanoBananaLogo } from "../ui/NanoBananaLogo";
import { ThemeSelector } from "../ui/ThemeSelector";
import { cn } from "../ui/utils";

export interface BuilderHeaderClassNames {
  root?: string;
  brand?: string;
  titleContainer?: string;
  title?: string;
  subtitle?: string;
  statusBadge?: string;
  actionsContainer?: string;
  utilitiesContainer?: string;
  divider?: string;
}

export interface BuilderHeaderProps {
  /** Main application or document title */
  title: React.ReactNode;
  /** Subtitle tagline or motto */
  subtitle?: React.ReactNode;
  /** Custom brand logo component */
  logo?: React.ReactNode;
  /** Status indicator text or badge */
  statusText?: React.ReactNode;
  /** Action buttons slot */
  actions?: React.ReactNode;
  /** Rightmost utilities slot (e.g. LanguageSwitcher, Help) */
  extraUtilities?: React.ReactNode;
  /** Whether to show the theme selector. Default: true */
  showThemeSelector?: boolean;
  className?: string;
  classNames?: BuilderHeaderClassNames;
}

export function BuilderHeader({
  title,
  subtitle,
  logo = <NanoBananaLogo size="md" glow />,
  statusText,
  actions,
  extraUtilities,
  showThemeSelector = true,
  className = "",
  classNames = {},
}: BuilderHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full px-4 sm:px-6 py-3",
        "bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md",
        "border-b border-stone-200/80 dark:border-[#30363d]",
        "flex items-center justify-between gap-3 shadow-2xs select-none",
        className,
        classNames.root
      )}
    >
      {/* Brand & Titles */}
      <div className={cn("flex items-center gap-3 min-w-0", classNames.brand)}>
        {logo && <div className="shrink-0">{logo}</div>}
        <div className={cn("min-w-0", classNames.titleContainer)}>
          <div className="flex items-center gap-2">
            <h1 className={cn("text-base sm:text-lg font-bold tracking-tight truncate text-stone-900 dark:text-[#f0f3f6]", classNames.title)}>
              {title}
            </h1>
            {statusText && (
              <span className={cn("hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand-border)]", classNames.statusBadge)}>
                {statusText}
              </span>
            )}
          </div>
          {subtitle && (
            <div className={cn("text-[11px] sm:text-xs text-stone-500 dark:text-[#8b949e] font-mono italic truncate", classNames.subtitle)}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Utilities */}
      <div className="flex items-center gap-2 shrink-0">
        {actions && <div className={cn("flex items-center gap-1.5", classNames.actionsContainer)}>{actions}</div>}

        {(extraUtilities || showThemeSelector) && (
          <div className={cn("flex items-center gap-2", classNames.utilitiesContainer)}>
            <div className={cn("w-[1px] h-5 bg-stone-200 dark:bg-[#30363d] hidden sm:block mx-1", classNames.divider)} />
            {extraUtilities}
            {showThemeSelector && <ThemeSelector variant="dropdown" showAccentPicker />}
          </div>
        )}
      </div>
    </header>
  );
}
