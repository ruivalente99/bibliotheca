"use client";

import React, { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";
import { cn } from "../ui/utils";

export interface ShortcutItem {
  key: string;
  description: string;
}

export interface ShortcutsLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  shortcuts?: ShortcutItem[];
  className?: string;
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { key: "Space + Drag", description: "Pan canvas / mover documento livremente" },
  { key: "Cmd/Ctrl + Scroll", description: "Zoom in e zoom out contínuo" },
  { key: "+ / -", description: "Aumentar / reduzir escala de zoom" },
  { key: "0", description: "Repor zoom para 100%" },
  { key: "F", description: "Ajustar automaticamente ao ecrã (Auto-fit)" },
  { key: "G", description: "Ativar / desativar grelha de alinhamento" },
  { key: "Esc", description: "Fechar modais ou cancelar ações" },
];

export function ShortcutsLegendModal({
  isOpen,
  onClose,
  title = "Atalhos de Teclado",
  shortcuts = DEFAULT_SHORTCUTS,
  className = "",
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-sm rounded-2xl p-5 shadow-2xl border animate-in zoom-in-95 duration-150",
          "bg-white dark:bg-[#161b22] border-stone-200 dark:border-[#30363d]",
          className
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#21262d]">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-[#f0f3f6]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] transition-colors cursor-pointer"
            aria-label="Fechar atalhos"
          >
            <X size={14} />
          </button>
        </div>

        <div className="py-3 space-y-2.5">
          {shortcuts.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs gap-3">
              <span className="text-stone-600 dark:text-[#c9d1d9]">{item.description}</span>
              <kbd className="px-2 py-0.5 rounded-md font-mono text-[10.5px] font-bold bg-stone-100 dark:bg-[#21262d] text-amber-700 dark:text-amber-400 border border-stone-200 dark:border-[#363d47] shrink-0">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
