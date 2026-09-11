"use client";

import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  MousePointer,
  RotateCcw,
  Grid,
  GripVertical,
  HelpCircle,
} from "lucide-react";
import { CanvasTooltip } from "./CanvasTooltip";
import { ShortcutsLegendModal } from "./ShortcutsLegendModal";
import { cn } from "../ui/utils";

export type DockEdge = "bottom" | "top" | "left" | "right";

export interface DockableToolbarProps {
  /** Current zoom level factor (e.g. 1.0 = 100%) */
  zoom: number;
  /** Zoom in callback */
  onZoomIn: () => void;
  /** Zoom out callback */
  onZoomOut: () => void;
  /** Reset view (100% zoom and 0,0 pan) callback */
  onResetView?: () => void;
  /** Auto-fit to viewport callback */
  onFitToScreen?: () => void;
  /** Active pointer navigation tool: 'pointer' or 'hand' */
  toolMode?: "pointer" | "hand";
  /** Tool mode change handler */
  onToolModeChange?: (mode: "pointer" | "hand") => void;
  /** Whether the alignment grid is visible */
  showGrid?: boolean;
  /** Grid toggle callback */
  onToggleGrid?: () => void;
  /** Initial dock edge. Default: 'bottom' */
  defaultDockEdge?: DockEdge;
  /** Parent container reference for edge detection during dragging */
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /** Custom export buttons or extra action slot */
  extraActions?: React.ReactNode;
  className?: string;
}

export function DockableToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToScreen,
  toolMode = "pointer",
  onToolModeChange,
  showGrid = false,
  onToggleGrid,
  defaultDockEdge = "bottom",
  containerRef,
  extraActions,
  className = "",
}: DockableToolbarProps) {
  const [dockEdge, setDockEdge] = useState<DockEdge>(defaultDockEdge);
  const [isDragging, setIsDragging] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const cycleDockEdge = () => {
    setDockEdge((prev) => {
      if (prev === "bottom") return "right";
      if (prev === "right") return "top";
      if (prev === "top") return "left";
      return "bottom";
    });
  };

  const handleGripPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleGripPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    const rect = containerRef?.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const distLeft = x;
    const distRight = rect.width - x;
    const distTop = y;
    const distBottom = rect.height - y;

    const minDist = Math.min(distLeft, distRight, distTop, distBottom);
    if (minDist === distLeft && dockEdge !== "left") setDockEdge("left");
    else if (minDist === distRight && dockEdge !== "right") setDockEdge("right");
    else if (minDist === distTop && dockEdge !== "top") setDockEdge("top");
    else if (minDist === distBottom && dockEdge !== "bottom") setDockEdge("bottom");
  };

  const handleGripPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const dockPositionClasses = {
    bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-row",
    top: "top-4 left-1/2 -translate-x-1/2 flex-row",
    left: "left-4 top-1/2 -translate-y-1/2 flex-col",
    right: "right-4 top-1/2 -translate-y-1/2 flex-col",
  }[dockEdge];

  const isVertical = dockEdge === "left" || dockEdge === "right";
  const tooltipSide = dockEdge === "bottom" ? "top" : dockEdge === "top" ? "bottom" : dockEdge === "left" ? "right" : "left";

  return (
    <>
      <div
        className={cn(
          "absolute z-30 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full shadow-2xl border transition-all duration-200 select-none",
          "bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-md",
          "border-stone-200/90 dark:border-[#30363d]",
          "text-stone-700 dark:text-[#c9d1d9]",
          dockPositionClasses,
          className
        )}
      >
        {/* Drag Handle Grip */}
        <div
          role="button"
          aria-label="Drag toolbar to edge, or double click to cycle"
          title="Drag to dock on edge / Double-click to cycle position"
          onPointerDown={handleGripPointerDown}
          onPointerMove={handleGripPointerMove}
          onPointerUp={handleGripPointerUp}
          onDoubleClick={cycleDockEdge}
          className="p-1 rounded-full cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-700 dark:hover:text-[#f0f3f6] transition-colors shrink-0"
        >
          <GripVertical size={13} />
        </div>

        {/* Navigation Mode Switcher (Pointer vs Hand) */}
        {onToolModeChange && (
          <div className={cn("flex items-center gap-0.5 p-0.5 rounded-full bg-stone-100 dark:bg-[#21262d]", isVertical ? "flex-col" : "flex-row")}>
            <CanvasTooltip label="Modo Seleção" shortcut="V" side={tooltipSide}>
              <button
                type="button"
                onClick={() => onToolModeChange("pointer")}
                className={cn(
                  "p-1.5 rounded-full transition-all cursor-pointer",
                  toolMode === "pointer"
                    ? "bg-white dark:bg-[#30363d] text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-stone-400 hover:text-stone-700 dark:hover:text-[#f0f3f6]"
                )}
                aria-label="Selection Tool"
              >
                <MousePointer size={13} />
              </button>
            </CanvasTooltip>

            <CanvasTooltip label="Modo Mão (Pan livre)" shortcut="Space" side={tooltipSide}>
              <button
                type="button"
                onClick={() => onToolModeChange("hand")}
                className={cn(
                  "p-1.5 rounded-full transition-all cursor-pointer",
                  toolMode === "hand"
                    ? "bg-white dark:bg-[#30363d] text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-stone-400 hover:text-stone-700 dark:hover:text-[#f0f3f6]"
                )}
                aria-label="Hand Pan Tool"
              >
                <Hand size={13} />
              </button>
            </CanvasTooltip>
          </div>
        )}

        <div className={cn("bg-stone-200 dark:bg-[#30363d]", isVertical ? "w-4 h-[1px] my-0.5" : "w-[1px] h-4 mx-0.5")} />

        {/* Zoom Controls */}
        <CanvasTooltip label="Reduzir Zoom" shortcut="-" side={tooltipSide}>
          <button
            type="button"
            onClick={onZoomOut}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer"
            aria-label="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
        </CanvasTooltip>

        <span className="font-mono text-[11px] font-bold min-w-[36px] text-center text-stone-600 dark:text-[#8b949e]">
          {Math.round(zoom * 100)}%
        </span>

        <CanvasTooltip label="Aumentar Zoom" shortcut="+" side={tooltipSide}>
          <button
            type="button"
            onClick={onZoomIn}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer"
            aria-label="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
        </CanvasTooltip>

        {onFitToScreen && (
          <CanvasTooltip label="Ajustar à Janela" shortcut="F" side={tooltipSide}>
            <button
              type="button"
              onClick={onFitToScreen}
              className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer"
              aria-label="Fit to screen"
            >
              <Maximize2 size={13} />
            </button>
          </CanvasTooltip>
        )}

        {onResetView && (
          <CanvasTooltip label="Repor Escala 100%" shortcut="0" side={tooltipSide}>
            <button
              type="button"
              onClick={onResetView}
              className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer"
              aria-label="Reset Zoom"
            >
              <RotateCcw size={13} />
            </button>
          </CanvasTooltip>
        )}

        {/* Grid toggle */}
        {onToggleGrid && (
          <>
            <div className={cn("bg-stone-200 dark:bg-[#30363d]", isVertical ? "w-4 h-[1px] my-0.5" : "w-[1px] h-4 mx-0.5")} />
            <CanvasTooltip label="Alternar Grelha" shortcut="G" side={tooltipSide}>
              <button
                type="button"
                onClick={onToggleGrid}
                className={cn(
                  "p-1.5 rounded-full transition-all cursor-pointer",
                  showGrid
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold"
                    : "hover:bg-stone-100 dark:hover:bg-[#21262d]"
                )}
                aria-label="Toggle grid"
              >
                <Grid size={13} />
              </button>
            </CanvasTooltip>
          </>
        )}

        {/* Extra Action Buttons slot (e.g. PDF download, JSON, etc.) */}
        {extraActions && (
          <>
            <div className={cn("bg-stone-200 dark:bg-[#30363d]", isVertical ? "w-4 h-[1px] my-0.5" : "w-[1px] h-4 mx-0.5")} />
            <div className={cn("flex items-center gap-1", isVertical ? "flex-col" : "flex-row")}>
              {extraActions}
            </div>
          </>
        )}

        {/* Help / Shortcuts Button */}
        <div className={cn("bg-stone-200 dark:bg-[#30363d]", isVertical ? "w-4 h-[1px] my-0.5" : "w-[1px] h-4 mx-0.5")} />
        <CanvasTooltip label="Atalhos do Teclado" shortcut="?" side={tooltipSide}>
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#21262d] text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            aria-label="Keyboard shortcuts"
          >
            <HelpCircle size={13} />
          </button>
        </CanvasTooltip>
      </div>

      <ShortcutsLegendModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
