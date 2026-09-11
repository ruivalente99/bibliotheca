"use client";

import React from "react";
import { NanoBananaLogo } from "../ui/NanoBananaLogo";
import { ThemeSelector } from "../ui/ThemeSelector";
import { cn } from "../ui/utils";

export interface BuilderHeaderProps {
  /** Main application or document title */
  title: string;
  /** Latin motto or subtitle tagline */
  subtitle?: string;
  /** Optional custom brand logo component. Defaults to NanoBananaLogo */
  logo?: React.ReactNode;
  /** Status indicator text or badge (e.g. "Auto-saved", "Draft") */
  statusText?: string;
  /** Quick action buttons slot (e.g. JSON, Reset, Template select) */
  actions?: React.ReactNode;
  /** Rightmost utilities slot (e.g. LanguageSwitcher, Help) */
  extraUtilities?: React.ReactNode;
  /** Whether to show the theme selector. Default: true */
  showThemeSelector?: boolean;
  className?: string;
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
}: BuilderHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full px-4 sm:px-6 py-3",
        "bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md",
        "border-b border-stone-200/80 dark:border-[#30363d]",
        "flex items-center justify-between gap-3 shadow-2xs select-none",
        className
      )}
    >
      {/* Brand & Titles */}
      <div className="flex items-center gap-3 min-w-0">
        {logo && <div className="shrink-0">{logo}</div>}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate text-stone-900 dark:text-[#f0f3f6]">
              {title}
            </h1>
            {statusText && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-500/30">
                {statusText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-[#8b949e] font-mono italic truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons & Utilities */}
      <div className="flex items-center gap-2 shrink-0">
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}

        {(extraUtilities || showThemeSelector) && (
          <>
            <div className="w-[1px] h-5 bg-stone-200 dark:bg-[#30363d] hidden sm:block mx-1" />
            {extraUtilities}
            {showThemeSelector && <ThemeSelector variant="dropdown" />}
          </>
        )}
      </div>
    </header>
  );
}
