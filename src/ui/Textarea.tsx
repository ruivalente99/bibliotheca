"use client";

import React, { useId, forwardRef, useEffect, useRef } from "react";
import { cn } from "./utils";

export interface TextareaClassNames {
  root?: string;
  label?: string;
  textarea?: string;
  helperText?: string;
  error?: string;
  counter?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Optional form field label */
  label?: React.ReactNode;
  /** Optional explanatory helper text */
  helperText?: React.ReactNode;
  /** Error message or boolean indicating invalid state */
  error?: React.ReactNode;
  /** Whether to automatically expand vertical height as user types */
  autoResize?: boolean;
  /** Whether to show current character count when maxLength is set */
  showCount?: boolean;
  /** Granular slot class overrides */
  classNames?: TextareaClassNames;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error,
      autoResize = false,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled = false,
      rows = 3,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const hasError = Boolean(error);

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

    const adjustHeight = () => {
      if (!autoResize) return;
      const el = internalRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value, autoResize]);

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

        <textarea
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          id={id}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          onChange={(e) => {
            adjustHeight();
            onChange?.(e);
          }}
          className={cn(
            "w-full bg-white dark:bg-[#161b22] text-stone-900 dark:text-[#f0f3f6] placeholder:text-stone-400 dark:placeholder:text-[#8b949e]",
            "border border-stone-200/80 dark:border-[#30363d] rounded-xl p-3 text-xs shadow-2xs transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)] focus-visible:border-[var(--brand)]",
            "disabled:opacity-50 disabled:bg-stone-50 dark:disabled:bg-[#0d1117] disabled:cursor-not-allowed",
            hasError && "border-rose-500 focus-visible:ring-rose-500/30 focus-visible:border-rose-500",
            autoResize ? "resize-none overflow-hidden" : "resize-y",
            classNames.textarea
          )}
          {...props}
        />

        <div className="flex items-center justify-between text-[11px] gap-2">
          {hasError ? (
            <p id={`${id}-error`} className={cn("font-medium text-rose-600 dark:text-rose-400", classNames.error)}>
              {error}
            </p>
          ) : helperText ? (
            <p id={`${id}-helper`} className={cn("text-stone-500 dark:text-[#8b949e]", classNames.helperText)}>
              {helperText}
            </p>
          ) : (
            <span />
          )}

          {showCount && maxLength && (
            <span className={cn("font-mono text-stone-400 dark:text-[#8b949e] shrink-0", classNames.counter)}>
              {`${currentLength}/${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
