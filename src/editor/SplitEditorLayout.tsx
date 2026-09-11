"use client";

import React, { useState } from "react";
import { GripVertical, Pencil, Eye } from "lucide-react";
import { useSplitRatio, UseSplitRatioOptions } from "./useSplitRatio";
import { cn } from "../ui/utils";

export interface SplitEditorLayoutProps {
  /** Left pane content (typically form controls inside .builder-form-pane) */
  formPane: React.ReactNode;
  /** Right pane content (typically document or canvas preview) */
  previewPane: React.ReactNode;
  /** Header rendered above the panes */
  header?: React.ReactNode;
  /** Configuration options for the split divider ratio */
  splitOptions?: UseSplitRatioOptions;
  /** Custom label for mobile edit tab */
  mobileEditLabel?: string;
  /** Custom label for mobile preview tab */
  mobilePreviewLabel?: string;
  /** Active mobile tab override (controlled) */
  mobileTab?: "edit" | "preview";
  /** Mobile tab change handler */
  onMobileTabChange?: (tab: "edit" | "preview") => void;
  className?: string;
}

export function SplitEditorLayout({
  formPane,
  previewPane,
  header,
  splitOptions = {},
  mobileEditLabel = "Editar",
  mobilePreviewLabel = "Visualizar",
  mobileTab: controlledMobileTab,
  onMobileTabChange,
  className = "",
}: SplitEditorLayoutProps) {
  const [internalMobileTab, setInternalMobileTab] = useState<"edit" | "preview">("edit");
  const activeMobileTab = controlledMobileTab ?? internalMobileTab;

  const handleMobileTabChange = (tab: "edit" | "preview") => {
    if (onMobileTabChange) {
      onMobileTabChange(tab);
    } else {
      setInternalMobileTab(tab);
    }
  };

  const {
    splitRatio,
    isDraggingSplit,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetSplitRatio,
  } = useSplitRatio(splitOptions);

  return (
    <div className={cn("min-h-screen flex flex-col bg-[var(--page)] text-[var(--heading)]", className)}>
      {header}

      {/* Mobile Tab Segment Switcher */}
      <div className="md:hidden px-4 py-2 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-md border-b border-stone-200 dark:border-[#30363d] sticky top-0 z-30 flex justify-center">
        <div className="flex p-0.5 rounded-full bg-stone-100 dark:bg-[#0d1117] border border-stone-200 dark:border-[#363d47] w-full max-w-xs">
          <button
            type="button"
            onClick={() => handleMobileTabChange("edit")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              activeMobileTab === "edit"
                ? "bg-white dark:bg-[#21262d] text-amber-800 dark:text-amber-400 shadow-xs"
                : "text-stone-500 dark:text-[#8b949e]"
            )}
          >
            <Pencil size={12} />
            <span>{mobileEditLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => handleMobileTabChange("preview")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              activeMobileTab === "preview"
                ? "bg-white dark:bg-[#21262d] text-amber-800 dark:text-amber-400 shadow-xs"
                : "text-stone-500 dark:text-[#8b949e]"
            )}
          >
            <Eye size={12} />
            <span>{mobilePreviewLabel}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Split Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          "flex-1 flex flex-col md:flex-row relative w-full overflow-hidden",
          isDraggingSplit && "select-none cursor-col-resize"
        )}
      >
        {/* Left Form Pane */}
        <div
          style={{ width: undefined }}
          className={cn(
            "w-full overflow-y-auto transition-none",
            "md:block",
            activeMobileTab === "edit" ? "block" : "hidden md:block"
          )}
          // Set proportional desktop width dynamically
          ref={(el) => {
            if (el && typeof window !== "undefined" && window.innerWidth >= 768) {
              el.style.width = `${splitRatio}%`;
            } else if (el) {
              el.style.width = "100%";
            }
          }}
        >
          {formPane}
        </div>

        {/* Resizable Splitter Handle (Desktop only) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={Math.round(splitRatio)}
          aria-label="Resize Editor and Preview columns"
          onPointerDown={handlePointerDown}
          onDoubleClick={resetSplitRatio}
          title="Drag to resize panes, double-click to reset (50%)"
          className={cn(
            "hidden md:flex items-center justify-center relative z-20 shrink-0",
            "w-3 -mx-1.5 cursor-col-resize select-none group",
            isDraggingSplit && "bg-amber-500/20"
          )}
        >
          <div
            className={cn(
              "w-1 h-full rounded-full transition-colors",
              isDraggingSplit
                ? "bg-amber-500"
                : "bg-stone-200/80 dark:bg-[#30363d] group-hover:bg-amber-400 dark:group-hover:bg-amber-500"
            )}
          />
          <div
            className={cn(
              "absolute flex items-center justify-center w-5 h-8 rounded-md shadow-sm border",
              "bg-white dark:bg-[#21262d] border-stone-300 dark:border-[#363d47]",
              "text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors",
              isDraggingSplit && "ring-2 ring-amber-500"
            )}
          >
            <GripVertical size={11} />
          </div>
        </div>

        {/* Right Preview Pane */}
        <div
          className={cn(
            "flex-1 bg-stone-100 dark:bg-[#0d1117] overflow-hidden transition-none",
            "md:sticky md:top-0 md:h-[calc(100vh-64px)]",
            activeMobileTab === "preview"
              ? "fixed inset-0 z-40 h-[100dvh] md:relative md:inset-auto md:z-auto md:h-[calc(100vh-64px)] block"
              : "hidden md:block"
          )}
        >
          {previewPane}
        </div>
      </div>
    </div>
  );
}
