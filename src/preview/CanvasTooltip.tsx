"use client";

import React from "react";
import { Tooltip, TooltipProps } from "../ui/Tooltip";

export interface CanvasTooltipProps extends TooltipProps {}

/**
 * Specialized tooltip component for Canvas & Document Preview actions,
 * featuring shortcut badges and viewport alignment.
 */
export function CanvasTooltip(props: CanvasTooltipProps) {
  return <Tooltip {...props} />;
}
