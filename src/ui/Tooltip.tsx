"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "./utils";

export interface TooltipClassNames {
  trigger?: string;
  tooltip?: string;
  shortcut?: string;
}

export interface TooltipProps {
  label: React.ReactNode;
  shortcut?: string;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
  classNames?: TooltipClassNames;
}

export function Tooltip({
  label,
  shortcut,
  side = "top",
  children,
  className = "",
  classNames = {},
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      if (side === "top") {
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
      } else if (side === "bottom") {
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
      } else if (side === "left") {
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
      } else if (side === "right") {
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
      }

      setCoords({ top, left });
      setShow(true);
    }
  };

  const handleClose = () => setShow(false);

  const transformStyle = {
    top: "translate(-50%, -100%)",
    bottom: "translate(-50%, 0%)",
    left: "translate(-100%, -50%)",
    right: "translate(0%, -50%)",
  }[side];

  return (
    <div
      ref={triggerRef}
      className={cn("inline-flex items-center justify-center shrink-0", className, classNames.trigger)}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {children}
      {show &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: transformStyle,
            }}
            className={cn(
              "z-[9999] pointer-events-none px-2.5 py-1 rounded-lg bg-stone-900/95 dark:bg-[#161b22]/95 backdrop-blur-md text-white border border-stone-700/60 dark:border-[#363d47] text-[10.5px] font-semibold shadow-xl whitespace-nowrap flex items-center gap-1.5 animate-in fade-in duration-100 select-none",
              classNames.tooltip
            )}
          >
            <span>{label}</span>
            {shortcut && (
              <kbd
                className={cn(
                  "px-1 py-0.2 rounded text-[9px] font-mono bg-stone-800 dark:bg-[#21262d] text-amber-400 border border-stone-600",
                  classNames.shortcut
                )}
              >
                {shortcut}
              </kbd>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
