"use client";

import React, { useState } from "react";
import { GripVertical, Pencil, Eye } from "lucide-react";
import { useSplitRatio, UseSplitRatioOptions } from "./useSplitRatio";
import { cn } from "../ui/utils";

export interface SplitEditorLayoutClassNames {
  root?: string;
  mobileNav?: string;
  mobileSwitcher?: string;
  mobileBtnEdit?: string;
  mobileBtnPreview?: string;
  panesContainer?: string;
  formPane?: string;
  previewPane?: string;
  handle?: string;
  handleBar?: string;
  grip?: string;
}

export interface SplitEditorLayoutProps {
  /** Left pane content (typically form controls inside .builder-form-pane) */
  formPane: React.ReactNode;
  /** Right pane content (typically document or canvas preview) */
  previewPane: React.ReactNode;
  /** Header rendered above the panes */
  header?: React.ReactNode;
  /** Configuration options for the split divider ratio */
  splitOptions?: UseSplitRatioOptions;
  /** Custom label for mobile edit tab. Default: 'Edit' */
  mobileEditLabel?: React.ReactNode;
  /** Custom label for mobile preview tab. Default: 'Preview' */
  mobilePreviewLabel?: React.ReactNode;
  /** Custom icons for mobile tabs */
  mobileIcons?: {
    edit?: React.ComponentType<{ size?: number; className?: string }>;
    preview?: React.ComponentType<{ size?: number; className?: string }>;
  };
  /** Active mobile tab override (controlled) */
  mobileTab?: "edit" | "preview";
  /** Mobile tab change handler */
  onMobileTabChange?: (tab: "edit" | "preview") => void;
  className?: string;
  classNames?: SplitEditorLayoutClassNames;
}

export function SplitEditorLayout({
  formPane,
  previewPane,
  header,
  splitOptions = {},
  mobileEditLabel = "Edit",
  mobilePreviewLabel = "Preview",
  mobileIcons = {},
  mobileTab: controlledMobileTab,
  onMobileTabChange,
  className = "",
  classNames = {},
}: SplitEditorLayoutProps) {
  const [internalMobileTab, setInternalMobileTab] = useState<"edit" | "preview">("edit");
  const activeMobileTab = controlledMobileTab ?? internalMobileTab;

  const EditIcon = mobileIcons.edit || Pencil;
  const PreviewIcon = mobileIcons.preview || Eye;

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
    <div className={cn("min-h-screen flex flex-col bg-[var(--page)] text-[var(--heading)]", className, classNames.root)}>
      {header}

      {/* Mobile Tab Segment Switcher */}
      <div
        className={cn(
          "md:hidden px-4 py-2 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-md border-b border-stone-200 dark:border-[#30363d] sticky top-0 z-30 flex justify-center",
          classNames.mobileNav
        )}
      >
        <div
          className={cn(
            "flex p-0.5 rounded-full bg-stone-100 dark:bg-[#0d1117] border border-stone-200 dark:border-[#363d47] w-full max-w-xs",
            classNames.mobileSwitcher
          )}
        >
          <button
            type="button"
            onClick={() => handleMobileTabChange("edit")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              activeMobileTab === "edit"
                ? "bg-white dark:bg-[#21262d] text-[var(--brand)] shadow-xs"
                : "text-stone-500 dark:text-[#8b949e]",
              classNames.mobileBtnEdit
            )}
          >
            <EditIcon size={12} />
            <span>{mobileEditLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => handleMobileTabChange("preview")}
            className={cn(
              "flex-1 py-1.5 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer",
              activeMobileTab === "preview"
                ? "bg-white dark:bg-[#21262d] text-[var(--brand)] shadow-xs"
                : "text-stone-500 dark:text-[#8b949e]",
              classNames.mobileBtnPreview
            )}
          >
            <PreviewIcon size={12} />
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
          isDraggingSplit && "select-none cursor-col-resize",
          classNames.panesContainer
        )}
      >
        {/* Left Form Pane */}
        <div
          className={cn(
            "w-full overflow-y-auto transition-none",
            "md:block",
            activeMobileTab === "edit" ? "block" : "hidden md:block",
            classNames.formPane
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
          aria-label="Resize Columns"
          onPointerDown={handlePointerDown}
          onDoubleClick={resetSplitRatio}
          title="Drag to resize panes"
          className={cn(
            "hidden md:flex items-center justify-center relative z-20 shrink-0",
            "w-3 -mx-1.5 cursor-col-resize select-none group",
            isDraggingSplit && "bg-[var(--brand-soft)]",
            classNames.handle
          )}
        >
          <div
            className={cn(
              "w-1 h-full rounded-full transition-colors",
              isDraggingSplit
                ? "bg-[var(--brand)]"
                : "bg-stone-200/80 dark:bg-[#30363d] group-hover:bg-[var(--brand-light)]",
              classNames.handleBar
            )}
          />
          <div
            className={cn(
              "absolute flex items-center justify-center w-5 h-8 rounded-md shadow-sm border",
              "bg-white dark:bg-[#21262d] border-stone-300 dark:border-[#363d47]",
              "text-stone-400 group-hover:text-[var(--brand)] transition-colors",
              isDraggingSplit && "ring-2 ring-[var(--brand)]",
              classNames.grip
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
              : "hidden md:block",
            classNames.previewPane
          )}
        >
          {previewPane}
        </div>
      </div>
    </div>
  );
}
