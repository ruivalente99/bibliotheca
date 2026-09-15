"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface UsePanZoomOptions {
  /** Document page width in pixels (e.g. 794 for A4 at 96 DPI). Default: 794 */
  docWidth?: number;
  /** Document page height in pixels (e.g. 1123 for A4 at 96 DPI). Default: 1123 */
  docHeight?: number;
  /** Minimum zoom factor. Default: 0.25 */
  minZoom?: number;
  /** Maximum zoom factor. Default: 3.0 */
  maxZoom?: number;
  /** Initial auto-fit behavior. Default: true */
  initialAutoFit?: boolean;
}

export interface UsePanZoomReturn {
  zoom: number;
  pan: { x: number; y: number };
  toolMode: "pointer" | "hand";
  isSpacePressed: boolean;
  isPanning: boolean;
  isAutoFit: boolean;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setToolMode: (mode: "pointer" | "hand") => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  fitToScreen: () => void;
  fitToWidth: () => void;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
}

export function usePanZoom({
  docWidth = 794,
  docHeight = 1123,
  minZoom = 0.25,
  maxZoom = 3.0,
  initialAutoFit = true,
}: UsePanZoomOptions = {}): UsePanZoomReturn {
  const [zoom, setZoomState] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [toolMode, setToolMode] = useState<"pointer" | "hand">("pointer");
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(initialAutoFit);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const setZoom = useCallback(
    (newZoom: number) => {
      setIsAutoFit(false);
      setZoomState(Math.max(minZoom, Math.min(maxZoom, Number(newZoom.toFixed(2)))));
    },
    [minZoom, maxZoom]
  );

  const zoomIn = useCallback(() => {
    setZoom(zoom + 0.1);
  }, [zoom, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(zoom - 0.1);
  }, [zoom, setZoom]);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  }, [setZoom]);

  // Dynamic Auto-Fit calculation
  const fitToScreen = useCallback(() => {
    const container = viewportRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;

    const margin = width < 640 ? 16 : 40;
    const availableW = Math.max(100, width - margin * 2);
    const availableH = Math.max(100, height - margin * 2);

    const scaleW = availableW / docWidth;
    const scaleH = availableH / docHeight;
    const bestFit = Math.min(scaleW, scaleH);

    const clamped = Math.max(minZoom, Math.min(1.25, Number(bestFit.toFixed(2))));
    setZoomState(clamped);
    setPan({ x: 0, y: 0 });
    setIsAutoFit(true);
  }, [docWidth, docHeight, minZoom]);

  const fitToWidth = useCallback(() => {
    const container = viewportRef.current;
    if (!container) return;
    const width = container.clientWidth;
    if (!width) return;
    const margin = width < 640 ? 16 : 40;
    const availableW = Math.max(100, width - margin * 2);
    const scale = Math.max(minZoom, Math.min(2.0, Number((availableW / docWidth).toFixed(2))));
    setZoomState(scale);
    setPan({ x: 0, y: 0 });
    setIsAutoFit(false);
  }, [docWidth, minZoom]);

  // Recalculate auto-fit on container resize
  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (isAutoFit) {
        fitToScreen();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [isAutoFit, fitToScreen]);

  // Spacebar hotkey for temporary pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        !isSpacePressed &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSpacePressed]);

  // Pan & Pointer handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const isHand = toolMode === "hand" || isSpacePressed || e.button === 1;
    if (!isHand) return;

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsPanning(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignored
      }
      setIsPanning(false);
    }
  };

  // Wheel zoom / trackpad pinch
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.005;
      setZoom(zoom + delta);
    } else if (toolMode === "hand" || isSpacePressed) {
      e.preventDefault();
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  return {
    zoom,
    pan,
    toolMode,
    isSpacePressed,
    isPanning,
    isAutoFit,
    viewportRef,
    setZoom,
    setPan,
    setToolMode,
    zoomIn,
    zoomOut,
    resetView,
    fitToScreen,
    fitToWidth,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
