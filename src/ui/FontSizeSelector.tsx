"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Check, Minus, Plus, Type } from "lucide-react";
import { cn } from "./utils";
import {
  FONT_SIZE_SCALES,
  DENSITY_SCALES,
  type FontSizeScaleKey,
  type DensityScaleKey,
} from "../tokens";

export interface FontSizeOption<T extends string = string> {
  id: T;
  label: React.ReactNode;
  shortLabel?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  scaleFactor?: number;
}

export interface FontSizeSelectorLabels {
  title?: React.ReactNode;
  decrease?: string;
  increase?: string;
  ariaLabel?: string;
  customLabels?: Record<string, React.ReactNode>;
}

export interface FontSizeSelectorClassNames {
  root?: string;
  label?: string;
  container?: string;
  option?: string;
  optionActive?: string;
  optionInactive?: string;
  stepperButton?: string;
  stepperValue?: string;
  dropdownTrigger?: string;
  dropdownMenu?: string;
  dropdownItem?: string;
  icon?: string;
  badge?: string;
}

export interface FontSizeSelectorProps<T extends string = string> {
  /** Selected size identifier */
  value: T;
  /** Callback fired when size changes */
  onChange: (value: T) => void;
  /** Available font size options. Defaults to 3-tier density scale (compact, normal, spacious) */
  options?: Array<FontSizeOption<T>>;
  /** Visual presentation variant: 'segmented' (pills), 'stepper' (- / +), 'dropdown' (select popover), 'buttons' */
  variant?: "segmented" | "stepper" | "dropdown" | "buttons";
  /** Size of the selector component */
  size?: "xs" | "sm" | "md" | "lg";
  /** Optional visible title/label */
  label?: React.ReactNode;
  /** Custom labels and accessible strings */
  labels?: FontSizeSelectorLabels;
  /** Accessible label */
  ariaLabel?: string;
  /** Whether to show a leading typography icon */
  showIcon?: boolean;
  /** Disables the selector */
  disabled?: boolean;
  className?: string;
  classNames?: FontSizeSelectorClassNames;
}

export const DEFAULT_DENSITY_OPTIONS: Array<FontSizeOption<DensityScaleKey>> = [
  {
    id: "compact",
    label: DENSITY_SCALES.compact.label,
    shortLabel: DENSITY_SCALES.compact.shortLabel,
    description: DENSITY_SCALES.compact.description,
    scaleFactor: DENSITY_SCALES.compact.scaleFactor,
  },
  {
    id: "normal",
    label: DENSITY_SCALES.normal.label,
    shortLabel: DENSITY_SCALES.normal.shortLabel,
    description: DENSITY_SCALES.normal.description,
    scaleFactor: DENSITY_SCALES.normal.scaleFactor,
  },
  {
    id: "spacious",
    label: DENSITY_SCALES.spacious.label,
    shortLabel: DENSITY_SCALES.spacious.shortLabel,
    description: DENSITY_SCALES.spacious.description,
    scaleFactor: DENSITY_SCALES.spacious.scaleFactor,
  },
];

export const DEFAULT_SCALE_OPTIONS: Array<FontSizeOption<FontSizeScaleKey>> = [
  {
    id: "xs",
    label: FONT_SIZE_SCALES.xs.label,
    shortLabel: FONT_SIZE_SCALES.xs.shortLabel,
    description: FONT_SIZE_SCALES.xs.description,
    scaleFactor: FONT_SIZE_SCALES.xs.scaleFactor,
  },
  {
    id: "sm",
    label: FONT_SIZE_SCALES.sm.label,
    shortLabel: FONT_SIZE_SCALES.sm.shortLabel,
    description: FONT_SIZE_SCALES.sm.description,
    scaleFactor: FONT_SIZE_SCALES.sm.scaleFactor,
  },
  {
    id: "md",
    label: FONT_SIZE_SCALES.md.label,
    shortLabel: FONT_SIZE_SCALES.md.shortLabel,
    description: FONT_SIZE_SCALES.md.description,
    scaleFactor: FONT_SIZE_SCALES.md.scaleFactor,
  },
  {
    id: "lg",
    label: FONT_SIZE_SCALES.lg.label,
    shortLabel: FONT_SIZE_SCALES.lg.shortLabel,
    description: FONT_SIZE_SCALES.lg.description,
    scaleFactor: FONT_SIZE_SCALES.lg.scaleFactor,
  },
  {
    id: "xl",
    label: FONT_SIZE_SCALES.xl.label,
    shortLabel: FONT_SIZE_SCALES.xl.shortLabel,
    description: FONT_SIZE_SCALES.xl.description,
    scaleFactor: FONT_SIZE_SCALES.xl.scaleFactor,
  },
];

export function FontSizeSelector<T extends string = string>({
  value,
  onChange,
  options,
  variant = "segmented",
  size = "md",
  label,
  labels = {},
  ariaLabel = "Font size selector",
  showIcon = false,
  disabled = false,
  className = "",
  classNames = {},
}: FontSizeSelectorProps<T>) {
  const resolvedOptions = (options ?? (DEFAULT_DENSITY_OPTIONS as unknown as Array<FontSizeOption<T>>));
  const currentIndex = resolvedOptions.findIndex((opt) => opt.id === value);
  const activeOption = resolvedOptions[currentIndex >= 0 ? currentIndex : 0];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (variant !== "dropdown") return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, variant]);

  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < resolvedOptions.length - 1;

  const handleDecrease = () => {
    if (disabled || !canDecrease) return;
    onChange(resolvedOptions[currentIndex - 1].id);
  };

  const handleIncrease = () => {
    if (disabled || !canIncrease) return;
    onChange(resolvedOptions[currentIndex + 1].id);
  };

  // Resolve custom label for option
  const getOptionLabel = (opt: FontSizeOption<T>): React.ReactNode => {
    if (labels.customLabels && labels.customLabels[opt.id] !== undefined) {
      return labels.customLabels[opt.id];
    }
    return opt.label;
  };

  const getOptionShortLabel = (opt: FontSizeOption<T>): React.ReactNode => {
    if (opt.shortLabel) return opt.shortLabel;
    if (labels.customLabels && labels.customLabels[opt.id] !== undefined) {
      return labels.customLabels[opt.id];
    }
    return opt.label;
  };

  // Keyboard navigation for segmented radio list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (index + 1) % resolvedOptions.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (index - 1 + resolvedOptions.length) % resolvedOptions.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = resolvedOptions.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const target = resolvedOptions[nextIndex];
      if (target) {
        onChange(target.id);
        const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>("[role='radio']");
        buttons?.[nextIndex]?.focus();
      }
    }
  };

  const sizeClasses = {
    xs: {
      root: "text-[10px]",
      button: "px-2 py-0.5 text-[10px]",
      stepperBtn: "w-5 h-5 min-w-[20px] min-h-[20px]",
      stepperValue: "px-2 text-[10px] min-w-[28px]",
      icon: 10,
    },
    sm: {
      root: "text-[11px]",
      button: "px-2.5 py-0.5 text-[11px]",
      stepperBtn: "w-6 h-6 min-w-[24px] min-h-[24px]",
      stepperValue: "px-2.5 text-[11px] min-w-[32px]",
      icon: 12,
    },
    md: {
      root: "text-xs",
      button: "px-3 py-1 text-xs",
      stepperBtn: "w-7 h-7 min-w-[28px] min-h-[28px]",
      stepperValue: "px-3 text-xs min-w-[38px]",
      icon: 14,
    },
    lg: {
      root: "text-sm",
      button: "px-4 py-1.5 text-sm",
      stepperBtn: "w-8 h-8 min-w-[32px] min-h-[32px]",
      stepperValue: "px-4 text-sm min-w-[46px]",
      icon: 16,
    },
  }[size];

  // 1. STEPPER VARIANT (Compact - / + buttons)
  if (variant === "stepper") {
    return (
      <div
        className={cn("inline-flex items-center gap-1.5", className, classNames.root)}
        aria-label={labels.ariaLabel || ariaLabel}
      >
        {(label || labels.title) && (
          <span className={cn("font-medium text-stone-600 dark:text-[#8b949e] select-none", sizeClasses.root, classNames.label)}>
            {label || labels.title}
          </span>
        )}
        <div
          ref={containerRef}
          role="group"
          aria-label={labels.ariaLabel || ariaLabel}
          className={cn(
            "inline-flex items-center bg-stone-100/90 dark:bg-[#161b22]/90 backdrop-blur-md rounded-full p-0.5 border border-stone-200/80 dark:border-[#30363d] shadow-2xs",
            disabled && "opacity-50 pointer-events-none",
            classNames.container
          )}
        >
          {showIcon && (
            <div className="pl-1.5 pr-0.5 text-stone-500 dark:text-[#8b949e]">
              <Type size={sizeClasses.icon} className={classNames.icon} />
            </div>
          )}
          <button
            type="button"
            onClick={handleDecrease}
            disabled={disabled || !canDecrease}
            title={labels.decrease || "Decrease text size"}
            aria-label={labels.decrease || "Decrease text size"}
            className={cn(
              "flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] hover:bg-stone-200/60 dark:hover:bg-[#21262d] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]",
              sizeClasses.stepperBtn,
              classNames.stepperButton
            )}
          >
            <Minus size={sizeClasses.icon} />
          </button>

          <span
            className={cn(
              "font-mono font-bold text-center text-stone-800 dark:text-[#f0f3f6] select-none whitespace-nowrap",
              sizeClasses.stepperValue,
              classNames.stepperValue
            )}
            title={activeOption ? String(getOptionLabel(activeOption)) : undefined}
          >
            {activeOption ? getOptionShortLabel(activeOption) : value}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={disabled || !canIncrease}
            title={labels.increase || "Increase text size"}
            aria-label={labels.increase || "Increase text size"}
            className={cn(
              "flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] hover:bg-stone-200/60 dark:hover:bg-[#21262d] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]",
              sizeClasses.stepperBtn,
              classNames.stepperButton
            )}
          >
            <Plus size={sizeClasses.icon} />
          </button>
        </div>
      </div>
    );
  }

  // 2. DROPDOWN VARIANT
  if (variant === "dropdown") {
    return (
      <div
        ref={dropdownRef}
        className={cn("relative inline-block text-left", className, classNames.root)}
      >
        {(label || labels.title) && (
          <label className={cn("block font-medium text-stone-600 dark:text-[#8b949e] mb-1.5 select-none", sizeClasses.root, classNames.label)}>
            {label || labels.title}
          </label>
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsDropdownOpen((prev) => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-label={labels.ariaLabel || ariaLabel}
          className={cn(
            "flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer select-none",
            "bg-white dark:bg-[#161b22] border-stone-200 dark:border-[#30363d] text-stone-800 dark:text-[#f0f3f6] shadow-2xs hover:bg-stone-50 dark:hover:bg-[#21262d]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]",
            disabled && "opacity-50 pointer-events-none",
            sizeClasses.root,
            classNames.dropdownTrigger
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {showIcon && <Type size={sizeClasses.icon} className={cn("text-stone-500 dark:text-[#8b949e] shrink-0", classNames.icon)} />}
            <span className="font-semibold truncate">
              {activeOption ? getOptionLabel(activeOption) : value}
            </span>
            {activeOption?.shortLabel && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-[#21262d] text-stone-500 dark:text-[#8b949e]">
                {activeOption.shortLabel}
              </span>
            )}
          </div>
          <ChevronDown
            size={sizeClasses.icon}
            className={cn("text-stone-400 transition-transform duration-150 shrink-0", isDropdownOpen && "rotate-180")}
          />
        </button>

        {isDropdownOpen && (
          <div
            role="listbox"
            aria-label={labels.ariaLabel || ariaLabel}
            className={cn(
              "absolute left-0 mt-1.5 min-w-[200px] z-50 rounded-2xl p-1.5 shadow-xl border animate-in fade-in zoom-in-95 duration-150",
              "bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xl border-stone-200/80 dark:border-[#30363d]",
              classNames.dropdownMenu
            )}
          >
            {resolvedOptions.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <button
                  key={opt.id}
                  role="option"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.id);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer select-none",
                    isSelected
                      ? "bg-[var(--brand-soft)] text-[var(--brand)] font-bold"
                      : "text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d]",
                    classNames.dropdownItem
                  )}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-semibold", isSelected && "text-[var(--brand)]")}>
                        {getOptionLabel(opt)}
                      </span>
                      {opt.shortLabel && (
                        <span className="text-[10px] font-mono opacity-70">
                          ({opt.shortLabel})
                        </span>
                      )}
                    </div>
                    {opt.description && (
                      <span className="text-[10px] text-stone-400 dark:text-[#8b949e] font-normal leading-tight mt-0.5 line-clamp-1">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-[var(--brand)] shrink-0" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3. SEGMENTED CONTROL / BUTTONS VARIANT (Default)
  return (
    <div
      className={cn("inline-flex items-center gap-2", className, classNames.root)}
      aria-label={labels.ariaLabel || ariaLabel}
    >
      {(label || labels.title) && (
        <span className={cn("font-medium text-stone-600 dark:text-[#8b949e] select-none", sizeClasses.root, classNames.label)}>
          {label || labels.title}
        </span>
      )}
      <div
        ref={containerRef}
        role="radiogroup"
        aria-label={labels.ariaLabel || ariaLabel}
        className={cn(
          "inline-flex items-center gap-1 p-0.5 rounded-full",
          "bg-stone-100/90 dark:bg-[#161b22]/90 backdrop-blur-md",
          "border border-stone-200/80 dark:border-[#30363d] shadow-2xs",
          "overflow-x-auto no-scrollbar",
          disabled && "opacity-50 pointer-events-none",
          classNames.container
        )}
      >
        {showIcon && (
          <div className="pl-2 pr-0.5 text-stone-400 dark:text-[#8b949e]">
            <Type size={sizeClasses.icon} className={classNames.icon} />
          </div>
        )}
        {resolvedOptions.map((opt, index) => {
          const isSelected = opt.id === value;
          const displayLabel = getOptionLabel(opt);
          const shortLabel = getOptionShortLabel(opt);

          return (
            <button
              key={opt.id}
              role="radio"
              type="button"
              tabIndex={isSelected ? 0 : -1}
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              title={opt.description ? `${displayLabel} — ${opt.description}` : String(displayLabel)}
              className={cn(
                "flex items-center justify-center gap-1 rounded-full font-semibold whitespace-nowrap",
                "transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]",
                sizeClasses.button,
                isSelected
                  ? cn("bg-white dark:bg-[#21262d] text-stone-900 dark:text-[#f0f3f6] shadow-xs font-bold", classNames.optionActive)
                  : cn("text-stone-500 hover:text-stone-800 dark:text-[#8b949e] dark:hover:text-[#f0f3f6]", classNames.optionInactive),
                classNames.option
              )}
            >
              {opt.icon && (
                <opt.icon size={sizeClasses.icon} className={cn("shrink-0", classNames.icon)} />
              )}
              <span>{displayLabel}</span>
              {opt.shortLabel && opt.shortLabel !== displayLabel && (
                <span
                  className={cn(
                    "text-[9px] font-mono px-1 rounded-md ml-0.5",
                    isSelected
                      ? "bg-stone-100 dark:bg-[#30363d] text-stone-600 dark:text-stone-300"
                      : "text-stone-400 dark:text-stone-500",
                    classNames.badge
                  )}
                >
                  {shortLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Ergonomic alias
export const TextSizeSelector = FontSizeSelector;
