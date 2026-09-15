"use client";

import React from "react";
import { cn } from "../ui/utils";

export type GridVariant = "dots" | "squares" | "checkerboard";

export interface GridOverlayProps {
  /** Whether the grid overlay is active */
  visible?: boolean;
  /** Visual style: subtle 'dots', engineering 'squares', or transparency 'checkerboard' */
  variant?: GridVariant;
  /** Opacity factor between 0 and 1. Default: 0.6 */
  opacity?: number;
  /** Optional safety margin inset in pixels, drawn as a dashed boundary guide */
  safetyMarginPx?: number;
  className?: string;
}

export function GridOverlay({
  visible = true,
  variant = "dots",
  opacity = 0.6,
  safetyMarginPx,
  className = "",
}: GridOverlayProps) {
  if (!visible) return null;

  const patterns = {
    dots: {
      backgroundImage: "radial-gradient(#78716c 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    },
    squares: {
      backgroundImage:
        "linear-gradient(to right, rgba(120, 113, 108, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 113, 108, 0.15) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    },
    checkerboard: {
      backgroundImage:
        "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    },
  };

  return (
    <div
      aria-hidden="true"
      style={{
        ...patterns[variant],
        opacity,
      }}
      className={cn(
        "absolute inset-0 pointer-events-none z-10 transition-opacity duration-200",
        className
      )}
    >
      {safetyMarginPx !== undefined && safetyMarginPx > 0 && (
        <div
          style={{
            inset: `${safetyMarginPx}px`,
          }}
          className="absolute border border-dashed border-amber-500/50 pointer-events-none"
        />
      )}
    </div>
  );
}
