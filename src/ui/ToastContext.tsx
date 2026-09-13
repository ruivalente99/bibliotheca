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
  message: React.ReactNode;
}

export interface ConfirmDialogOptions {
  title?: React.ReactNode;
  message: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  danger?: boolean;
}

export interface ToastContextValue {
  /** Dispatch a floating toast notification */
  showToast: (message: React.ReactNode, type?: ToastType) => void;
  /** Open an asynchronous confirmation modal dialog */
  confirmAction: (options: ConfirmDialogOptions) => Promise<boolean>;
}

export interface ToastClassNames {
  viewport?: string;
  toast?: string;
  toastSuccess?: string;
  toastError?: string;
  toastInfo?: string;
  closeBtn?: string;
  dialogOverlay?: string;
  dialogBox?: string;
  dialogTitle?: string;
  dialogMessage?: string;
  dialogActions?: string;
  confirmBtn?: string;
  cancelBtn?: string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Toast auto-dismiss duration in milliseconds. Default: 4000 */
  autoDismissMs?: number;
  /** Default label for confirm button in dialogs. Default: 'Confirm' */
  defaultConfirmText?: React.ReactNode;
  /** Default label for cancel button in dialogs. Default: 'Cancel' */
  defaultCancelText?: React.ReactNode;
  /** Custom class overrides for toast dock and modal elements */
  classNames?: ToastClassNames;
}

export function ToastProvider({
  children,
  autoDismissMs = 4000,
  defaultConfirmText = "Confirm",
  defaultCancelText = "Cancel",
  classNames = {},
}: ToastProviderProps) {
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
    (message: React.ReactNode, type: ToastType = "info") => {
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
        className={cn(
          "fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full",
          classNames.viewport
        )}
      >
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = "border-stone-200 dark:border-[#363d47]";
          const bgClass = "bg-white dark:bg-[#161b22]";
          const textClass = "text-stone-800 dark:text-[#f0f3f6]";
          let iconClass = "text-[var(--brand)]";
          let customTypeClass = classNames.toastInfo;

          if (toast.type === "success") {
            Icon = CheckCircle2;
            iconClass = "text-emerald-500";
            borderClass = "border-emerald-500/30 dark:border-emerald-500/40";
            customTypeClass = classNames.toastSuccess;
          } else if (toast.type === "error") {
            Icon = AlertCircle;
            iconClass = "text-rose-500";
            borderClass = "border-rose-500/30 dark:border-rose-500/40";
            customTypeClass = classNames.toastError;
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
                textClass,
                classNames.toast,
                customTypeClass
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} className={cn(iconClass, "shrink-0")} />
                <div className="text-xs font-medium leading-snug break-words">{toast.message}</div>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className={cn(
                  "text-stone-400 hover:text-stone-700 dark:text-[#8b949e] dark:hover:text-[#f0f3f6] p-1 rounded-md transition-colors shrink-0 cursor-pointer",
                  classNames.closeBtn
                )}
                aria-label="Dismiss"
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
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150",
            classNames.dialogOverlay
          )}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white dark:bg-[#161b22] border border-stone-200 dark:border-[#30363d] rounded-2xl shadow-2xl p-5 max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150",
              classNames.dialogBox
            )}
          >
            {confirmState.options.title && (
              <h3
                className={cn(
                  "text-sm font-bold text-stone-900 dark:text-[#f0f3f6]",
                  classNames.dialogTitle
                )}
              >
                {confirmState.options.title}
              </h3>
            )}
            <div
              className={cn(
                "text-xs text-stone-600 dark:text-[#c9d1d9] leading-relaxed",
                classNames.dialogMessage
              )}
            >
              {confirmState.options.message}
            </div>
            <div className={cn("flex items-center justify-end gap-2 pt-2", classNames.dialogActions)}>
              <button
                type="button"
                onClick={handleCancel}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 dark:text-[#c9d1d9] hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer",
                  classNames.cancelBtn
                )}
              >
                {confirmState.options.cancelText ?? defaultCancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-colors cursor-pointer",
                  confirmState.options.danger
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-[var(--brand)] hover:bg-[var(--brand-hover)]",
                  classNames.confirmBtn
                )}
              >
                {confirmState.options.confirmText ?? defaultConfirmText}
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
      showToast: (msg: React.ReactNode) => console.log(`[Toast Fallback]:`, msg),
      confirmAction: async (opts: ConfirmDialogOptions) => {
        if (typeof window !== "undefined" && typeof opts.message === "string") {
          return window.confirm(opts.message);
        }
        return true;
      },
    };
  }
  return ctx;
}
