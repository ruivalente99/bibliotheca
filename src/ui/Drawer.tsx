"use client";

import React, { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "./utils";

export type DrawerPlacement = "right" | "left" | "bottom";

export interface DrawerClassNames {
  overlay?: string;
  drawer?: string;
  header?: string;
  title?: string;
  description?: string;
  closeBtn?: string;
  body?: string;
  footer?: string;
}

export interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Edge from which the drawer slides out */
  placement?: DrawerPlacement;
  /** Drawer heading title */
  title?: React.ReactNode;
  /** Optional subtitle or description */
  description?: React.ReactNode;
  /** Drawer body content */
  children: React.ReactNode;
  /** Optional bottom footer actions */
  footer?: React.ReactNode;
  /** Drawer dimension scale */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether clicking the backdrop dismisses the drawer */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape dismisses the drawer */
  closeOnEscape?: boolean;
  /** Accessible label for the close button */
  closeAriaLabel?: string;
  className?: string;
  classNames?: DrawerClassNames;
}

export function Drawer({
  isOpen,
  onClose,
  placement = "right",
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  closeAriaLabel = "Close drawer",
  className = "",
  classNames = {},
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const widthSizes = {
    sm: "max-w-xs",
    md: "max-w-sm",
    lg: "max-w-md",
    xl: "max-w-lg",
  }[size];

  const placementClasses = {
    right: cn("top-0 right-0 bottom-0 h-full w-full border-l animate-in slide-in-from-right duration-200", widthSizes),
    left: cn("top-0 left-0 bottom-0 h-full w-full border-r animate-in slide-in-from-left duration-200", widthSizes),
    bottom: "bottom-0 left-0 right-0 max-h-[85vh] w-full border-t rounded-t-3xl animate-in slide-in-from-bottom duration-200",
  }[placement];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onClick={closeOnBackdropClick ? onClose : undefined}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150",
        classNames.overlay
      )}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "fixed flex flex-col shadow-2xl bg-white dark:bg-[#161b22] border-stone-200 dark:border-[#30363d] text-[var(--heading)]",
          placementClasses,
          className,
          classNames.drawer
        )}
      >
        {/* Drawer Header */}
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

        {/* Drawer Body */}
        <div className={cn("p-5 overflow-y-auto space-y-4 flex-1", classNames.body)}>
          {children}
        </div>

        {/* Drawer Footer */}
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
