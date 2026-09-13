"use client";

import React, { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface ModalClassNames {
  overlay?: string;
  dialog?: string;
  header?: string;
  title?: string;
  description?: string;
  closeBtn?: string;
  body?: string;
  footer?: string;
}

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Modal header title */
  title?: React.ReactNode;
  /** Optional subtitle or description text */
  description?: React.ReactNode;
  /** Modal body content */
  children: React.ReactNode;
  /** Optional footer action buttons */
  footer?: React.ReactNode;
  /** Dialog width scale */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Whether clicking outside the dialog triggers onClose. Default: true */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape triggers onClose. Default: true */
  closeOnEscape?: boolean;
  /** Accessible close button label */
  closeAriaLabel?: string;
  className?: string;
  classNames?: ModalClassNames;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  closeAriaLabel = "Close dialog",
  className = "",
  classNames = {},
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-4xl",
  }[size];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onClick={closeOnBackdropClick ? onClose : undefined}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
        classNames.overlay
      )}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150",
          "bg-white dark:bg-[#161b22] border-stone-200 dark:border-[#30363d] text-[var(--heading)]",
          sizeClasses,
          className,
          classNames.dialog
        )}
      >
        {/* Modal Header */}
        {(title || description) && (
          <div className={cn("flex items-start justify-between p-5 border-b border-stone-100 dark:border-[#21262d]", classNames.header)}>
            <div className="space-y-1 min-w-0 pr-4">
              {title && (
                <h2 id={titleId} className={cn("text-base font-bold tracking-tight text-stone-900 dark:text-[#f0f3f6] truncate", classNames.title)}>
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className={cn("text-xs text-stone-500 dark:text-[#8b949e]", classNames.description)}>
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className={cn(
                "p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer shrink-0",
                classNames.closeBtn
              )}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className={cn("p-5 overflow-y-auto space-y-4 flex-1", classNames.body)}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className={cn("flex items-center justify-end gap-2 p-4 border-t border-stone-100 dark:border-[#21262d] bg-stone-50/50 dark:bg-[#0d1117]/50", classNames.footer)}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
