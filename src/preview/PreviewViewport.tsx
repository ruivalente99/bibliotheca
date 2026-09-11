"use client";

import React, { useEffect } from "react";
import { usePanZoom, UsePanZoomOptions } from "./usePanZoom";
import { DockableToolbar, DockEdge } from "./DockableToolbar";
import { GridOverlay, GridVariant } from "./GridOverlay";
import { cn } from "../ui/utils";

export interface PreviewViewportProps {
  /** Target document node or rendered pages */
  children: React.ReactNode;
  /** Document page width in pixels (e.g. 794 for A4 at 96 DPI) */
  docWidth?: number;
  /** Document page height in pixels (e.g. 1123 for A4 at 96 DPI) */
  docHeight?: number;
  /** Pan and zoom configuration options */
  panZoomOptions?: UsePanZoomOptions;
  /** Whether the alignment grid is visible. Controlled or default false */
  showGrid?: boolean;
  /** Visual style of the grid */
  gridVariant?: GridVariant;
  /** Callback when grid visibility is toggled */
  onToggleGrid?: () => void;
  /** Initial dock edge position for the floating toolbar */
  defaultDockEdge?: DockEdge;
  /** Extra export action buttons rendered in the toolbar */
  toolbarActions?: React.ReactNode;
  /** Ref to forward to the capture container if needed */
  captureRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function PreviewViewport({
  children,
  docWidth = 794,
  docHeight = 1123,
  panZoomOptions,
  showGrid = false,
  gridVariant = "dots",
  onToggleGrid,
  defaultDockEdge = "bottom",
  toolbarActions,
  captureRef,
  className = "",
}: PreviewViewportProps) {
  const {
    zoom,
    pan,
    toolMode,
    isSpacePressed,
    isPanning,
    viewportRef,
    zoomIn,
    zoomOut,
    resetView,
    fitToScreen,
    setToolMode,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  } = usePanZoom({
    docWidth,
    docHeight,
    ...panZoomOptions,
  });

  // Fit to screen on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToScreen();
    }, 80);
    return () => clearTimeout(timer);
  }, [fitToScreen]);

  const isHandActive = toolMode === "hand" || isSpacePressed;

  return (
    <div
      ref={viewportRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={cn(
        "relative w-full h-full overflow-hidden select-none touch-none",
        "bg-stone-100 dark:bg-[#0d1117]",
        isHandActive
          ? isPanning
            ? "cursor-grabbing"
            : "cursor-grab"
          : "cursor-default",
        className
      )}
    >
      {/* Background Alignment Grid Overlay */}
      <GridOverlay visible={showGrid} variant={gridVariant} />

      {/* Scaled & Panned Document Stage */}
      <div
        ref={captureRef}
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: "center top",
          transition: isPanning ? "none" : "transform 100ms ease-out",
        }}
        className="w-full flex flex-col items-center pt-8 pb-32 will-change-transform"
      >
        {children}
      </div>

      {/* Floating Action Toolbar */}
      <DockableToolbar
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onFitToScreen={fitToScreen}
        toolMode={toolMode}
        onToolModeChange={setToolMode}
        showGrid={showGrid}
        onToggleGrid={onToggleGrid}
        defaultDockEdge={defaultDockEdge}
        containerRef={viewportRef}
        extraActions={toolbarActions}
      />
    </div>
  );
}
