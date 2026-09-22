"use client";

import React, { useId } from "react";
import { cn } from "./utils";

export interface FieldClassNames {
  root?: string;
  labelWrapper?: string;
  label?: string;
  requiredIndicator?: string;
  optionalIndicator?: string;
  description?: string;
  error?: string;
  content?: string;
}

export interface FieldProps {
  /** Label text or node displayed above the control */
  label?: React.ReactNode;
  /** HTML id of the input element this label targets */
  htmlFor?: string;
  /** Supporting hint or description text */
  description?: React.ReactNode;
  /** Validation error message. When present, displays with error tokens */
  error?: React.ReactNode;
  /** Whether the field is mandatory */
  required?: boolean;
  /** Whether to render an explicit (optional) indicator */
  optional?: boolean;
  /** Child form input control (Input, Textarea, Select, etc.) */
  children: React.ReactNode;
  className?: string;
  classNames?: FieldClassNames;
}

export function Field({
  label,
  htmlFor,
  description,
  error,
  required = false,
  optional = false,
  children,
  className = "",
  classNames = {},
}: FieldProps) {
  const generatedId = useId();
  const inputId = htmlFor || `field-input-${generatedId}`;
  const descriptionId = description ? `field-desc-${generatedId}` : undefined;
  const errorId = error ? `field-err-${generatedId}` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className, classNames.root)}>
      {label && (
        <div className={cn("flex items-center justify-between gap-2", classNames.labelWrapper)}>
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-semibold text-[var(--heading)] select-none",
              classNames.label
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className={cn("ml-1 text-[var(--brand)] font-bold", classNames.requiredIndicator)}
              >
                *
              </span>
            )}
          </label>
          {optional && (
            <span
              className={cn(
                "text-[10px] uppercase font-mono tracking-wider text-[var(--body-subtle)]",
                classNames.optionalIndicator
              )}
            >
              Optional
            </span>
          )}
        </div>
      )}

      {description && (
        <p
          id={descriptionId}
          className={cn("text-[11px] text-[var(--body-subtle)] -mt-0.5", classNames.description)}
        >
          {description}
        </p>
      )}

      <div className={cn("w-full", classNames.content)}>
        {children}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className={cn("text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-0.5", classNames.error)}
        >
          {error}
        </p>
      )}
    </div>
  );
}
