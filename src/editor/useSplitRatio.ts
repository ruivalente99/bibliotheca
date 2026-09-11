"use client";

import { useState, useEffect, useRef } from "react";

export interface UseSplitRatioOptions {
  /** LocalStorage key for persisting the ratio. Default: 'bibliotheca_split_ratio' */
  storageKey?: string;
  /** Default percentage for the left pane. Default: 50 */
  defaultRatio?: number;
  /** Minimum percentage for the left pane. Default: 25 */
  min?: number;
  /** Maximum percentage for the left pane. Default: 75 */
  max?: number;
}

export interface UseSplitRatioReturn {
  splitRatio: number;
  isDraggingSplit: boolean;
  setSplitRatio: (ratio: number) => void;
  resetSplitRatio: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export function useSplitRatio({
  storageKey = "bibliotheca_split_ratio",
  defaultRatio = 50,
  min = 25,
  max = 75,
}: UseSplitRatioOptions = {}): UseSplitRatioReturn {
  const [splitRatio, setRatio] = useState<number>(defaultRatio);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Restore saved ratio on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= min && val <= max) {
          setRatio(val);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [storageKey, min, max]);

  const setSplitRatio = (newRatio: number) => {
    const clamped = Math.max(min, Math.min(max, Number(newRatio.toFixed(1))));
    setRatio(clamped);
    try {
      localStorage.setItem(storageKey, clamped.toString());
    } catch {
      // Storage unavailable
    }
  };

  const resetSplitRatio = () => {
    setSplitRatio(defaultRatio);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDraggingSplit(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(min, Math.min(max, Number(newRatio.toFixed(1))));
    setRatio(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSplit) {
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignored
      }
      setIsDraggingSplit(false);
      try {
        localStorage.setItem(storageKey, splitRatio.toString());
      } catch {
        // Ignored
      }
    }
  };

  return {
    splitRatio,
    isDraggingSplit,
    setSplitRatio,
    resetSplitRatio,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
