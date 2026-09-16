"use client";

import React, { useId, forwardRef } from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface InputClassNames {
  root?: string;
  label?: string;
  wrapper?: string;
  input?: string;
  iconLeft?: string;
  iconRight?: string;
  clearBtn?: string;
  helperText?: string;
  error?: string;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Optional form field label */
  label?: React.ReactNode;
  /** Optional explanatory helper text */
  helperText?: React.ReactNode;
  /** Error message or boolean indicating invalid state */
  error?: React.ReactNode;
  /** Icon displayed on the left of input */
  iconLeft?: React.ReactNode;
  /** Icon displayed on the right of input */
  iconRight?: React.ReactNode;
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /** Whether to show a clear button when input has value */
  clearable?: boolean;
  /** Clear button callback */
  onClear?: () => void;
  /** Granular slot class overrides */
  classNames?: InputClassNames;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      iconLeft,
      iconRight,
      size = "md",
      clearable = false,
      onClear,
      value,
      disabled = false,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const hasError = Boolean(error);
    const hasValue = value !== undefined && value !== "";

    const sizeClasses = {
      sm: "text-xs py-1.5 px-2.5 rounded-lg",
      md: "text-xs py-2 px-3.5 rounded-xl",
      lg: "text-sm py-2.5 px-4 rounded-2xl",
    }[size];

    const paddingLeftClass = iconLeft
      ? {
          sm: "pl-8",
          md: "pl-9",
          lg: "pl-11",
        }[size]
      : "";

    const paddingRightClass = (iconRight || (clearable && hasValue))
      ? {
          sm: "pr-8",
          md: "pr-9",
          lg: "pr-11",
        }[size]
      : "";

    return (
      <div className={cn("w-full space-y-1.5", className, classNames.root)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-xs font-bold text-stone-800 dark:text-[#f0f3f6] select-none",
              classNames.label
            )}
          >
            {label}
          </label>
        )}

        <div className={cn("relative flex items-center w-full", classNames.wrapper)}>
          {iconLeft && (
            <div
              className={cn(
                "absolute flex items-center justify-center pointer-events-none text-stone-400 dark:text-[#8b949e]",
                size === "sm" ? "left-2.5" : size === "lg" ? "left-3.5" : "left-3",
                classNames.iconLeft
              )}
            >
              {iconLeft}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            value={value}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={cn(
              "w-full bg-white dark:bg-[#161b22] text-stone-900 dark:text-[#f0f3f6] placeholder:text-stone-400 dark:placeholder:text-[#8b949e]",
              "border border-stone-200/80 dark:border-[#30363d] shadow-2xs transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)] focus-visible:border-[var(--brand)]",
              "disabled:opacity-50 disabled:bg-stone-50 dark:disabled:bg-[#0d1117] disabled:cursor-not-allowed",
              hasError && "border-rose-500 focus-visible:ring-rose-500/30 focus-visible:border-rose-500",
              sizeClasses,
              paddingLeftClass,
              paddingRightClass,
              classNames.input
            )}
            {...props}
          />

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className={cn(
                "absolute right-2.5 p-1 rounded-md text-stone-400 hover:text-stone-700 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] transition-colors cursor-pointer",
                classNames.clearBtn
              )}
            >
              <X size={13} />
            </button>
          )}

          {!clearable && iconRight && (
            <div
              className={cn(
                "absolute flex items-center justify-center pointer-events-none text-stone-400 dark:text-[#8b949e]",
                size === "sm" ? "right-2.5" : size === "lg" ? "right-3.5" : "right-3",
                classNames.iconRight
              )}
            >
              {iconRight}
            </div>
          )}
        </div>

        {hasError ? (
          <p id={`${id}-error`} className={cn("text-[11px] font-medium text-rose-600 dark:text-rose-400", classNames.error)}>
            {error}
          </p>
        ) : helperText ? (
          <p id={`${id}-helper`} className={cn("text-[11px] text-stone-500 dark:text-[#8b949e]", classNames.helperText)}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
