"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "./utils";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export interface ToastContextValue {
  /** Dispatch a floating toast notification */
  showToast: (message: string, type?: ToastType) => void;
  /** Open an asynchronous confirmation modal dialog */
  confirmAction: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Toast auto-dismiss duration in milliseconds. Default: 4000 */
  autoDismissMs?: number;
}

export function ToastProvider({ children, autoDismissMs = 4000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmDialogOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const idCounter = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `toast-${Date.now()}-${idCounter.current++}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, autoDismissMs);
    },
    [autoDismissMs, removeToast]
  );

  const confirmAction = useCallback(
    (options: ConfirmDialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState((prev) => {
          if (prev) {
            prev.resolve(false);
          }
          return {
            isOpen: true,
            options,
            resolve,
          };
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (confirmState) {
      confirmState.resolve(true);
      setConfirmState(null);
    }
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    if (confirmState) {
      confirmState.resolve(false);
      setConfirmState(null);
    }
  }, [confirmState]);

  // Handle keyboard Escape to cancel confirmation modal
  useEffect(() => {
    if (!confirmState) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmState, handleCancel]);

  return (
    <ToastContext.Provider value={{ showToast, confirmAction }}>
      {children}

      {/* Floating Notifications Viewport */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = "border-stone-200 dark:border-[#363d47]";
          const bgClass = "bg-white dark:bg-[#161b22]";
          const textClass = "text-stone-800 dark:text-[#f0f3f6]";
          let iconClass = "text-amber-500";

          if (toast.type === "success") {
            Icon = CheckCircle2;
            iconClass = "text-emerald-500";
            borderClass = "border-emerald-500/30 dark:border-emerald-500/40";
          } else if (toast.type === "error") {
            Icon = AlertCircle;
            iconClass = "text-rose-500";
            borderClass = "border-rose-500/30 dark:border-rose-500/40";
          }

          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5",
                "rounded-2xl shadow-xl border backdrop-blur-md",
                "animate-in slide-in-from-top-2 duration-150",
                borderClass,
                bgClass,
                textClass
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} className={cn(iconClass, "shrink-0")} />
                <p className="text-xs font-medium leading-snug break-words">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] p-1 rounded-md transition-colors shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal Dialog */}
      {confirmState && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleCancel}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#161b22] border border-stone-200 dark:border-[#30363d] rounded-2xl shadow-2xl p-5 max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150"
          >
            {confirmState.options.title && (
              <h3 className="text-sm font-bold text-stone-900 dark:text-[#f0f3f6]">
                {confirmState.options.title}
              </h3>
            )}
            <p className="text-xs text-stone-600 dark:text-[#c9d1d9] leading-relaxed">
              {confirmState.options.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer"
              >
                {confirmState.options.cancelText || "Cancelar"}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-colors cursor-pointer",
                  confirmState.options.danger
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-amber-600 hover:bg-amber-700"
                )}
              >
                {confirmState.options.confirmText || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (msg: string) => console.log(`[Toast Fallback]: ${msg}`),
      confirmAction: async (opts: ConfirmDialogOptions) => {
        if (typeof window !== "undefined") {
          return window.confirm(opts.message);
        }
        return true;
      },
    };
  }
  return ctx;
}
