"use client";

import React, { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";
import { cn } from "../ui/utils";

export interface ShortcutItem {
  key: string;
  description: React.ReactNode;
}

export interface ShortcutsLegendModalClassNames {
  overlay?: string;
  dialog?: string;
  header?: string;
  title?: string;
  closeBtn?: string;
  list?: string;
  item?: string;
  description?: string;
  kbd?: string;
}

export interface ShortcutsLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  closeLabel?: string;
  shortcuts?: ShortcutItem[];
  className?: string;
  classNames?: ShortcutsLegendModalClassNames;
}

export function ShortcutsLegendModal({
  isOpen,
  onClose,
  title = "Keyboard Shortcuts",
  closeLabel = "Close",
  shortcuts = [],
  className = "",
  classNames = {},
}: ShortcutsLegendModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none",
        classNames.overlay
      )}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-sm rounded-2xl p-5 shadow-2xl border animate-in zoom-in-95 duration-150",
          "bg-white dark:bg-[#161b22] border-stone-200 dark:border-[#30363d]",
          className,
          classNames.dialog
        )}
      >
        <div className={cn("flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#21262d]", classNames.header)}>
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-amber-600 dark:text-amber-400" />
            <div className={cn("text-sm font-bold text-stone-900 dark:text-[#f0f3f6]", classNames.title)}>{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] transition-colors cursor-pointer",
              classNames.closeBtn
            )}
            aria-label={closeLabel}
          >
            <X size={14} />
          </button>
        </div>

        <div className={cn("py-3 space-y-2.5", classNames.list)}>
          {shortcuts.map((item, i) => (
            <div key={i} className={cn("flex items-center justify-between text-xs gap-3", classNames.item)}>
              <div className={cn("text-stone-600 dark:text-[#c9d1d9]", classNames.description)}>{item.description}</div>
              <kbd className={cn("px-2 py-0.5 rounded-md font-mono text-[10.5px] font-bold bg-stone-100 dark:bg-[#21262d] text-amber-700 dark:text-amber-400 border border-stone-200 dark:border-[#363d47] shrink-0", classNames.kbd)}>
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
