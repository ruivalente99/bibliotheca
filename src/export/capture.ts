"use client";

import { domToCanvas } from "modern-screenshot";

export interface CaptureOptions {
  /** Canvas device pixel ratio scale multiplier. Default: 2 */
  scale?: number;
  /** Image quality between 0 and 1. Default: 0.95 */
  quality?: number;
  /** Background color for canvas rendering. Default: '#ffffff' */
  backgroundColor?: string;
  /** Custom filter function to exclude elements from capture */
  filter?: (node: Node) => boolean;
}

/**
 * Captures a DOM element into a high-DPI HTMLCanvasElement.
 */
export async function captureElementToCanvas(
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<HTMLCanvasElement> {
  const { scale = 2, quality = 0.95, backgroundColor = "#ffffff", filter } = options;

  return await domToCanvas(element, {
    scale,
    quality,
    backgroundColor,
    filter: (node) => {
      // Ignore user-drag handles or elements with data-capture-ignore
      if (node instanceof HTMLElement) {
        if (node.getAttribute("data-capture-ignore") === "true") {
          return false;
        }
      }
      return filter ? filter(node) : true;
    },
  });
}

/**
 * Scans a container for child pages marked with [data-page] or captures the container directly.
 */
export async function capturePages(
  container: HTMLElement,
  options: CaptureOptions = {}
): Promise<Array<{ pageNumber: number; canvas: HTMLCanvasElement }>> {
  const pageElements = Array.from(container.querySelectorAll<HTMLElement>("[data-page]"));

  if (pageElements.length === 0) {
    const singleCanvas = await captureElementToCanvas(container, options);
    return [{ pageNumber: 1, canvas: singleCanvas }];
  }

  const results: Array<{ pageNumber: number; canvas: HTMLCanvasElement }> = [];
  for (let i = 0; i < pageElements.length; i++) {
    const pageEl = pageElements[i];
    const canvas = await captureElementToCanvas(pageEl, options);
    results.push({ pageNumber: i + 1, canvas });
  }

  return results;
}
