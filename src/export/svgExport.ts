/**
 * Vector SVG Export Pipeline
 *
 * Captures live DOM nodes directly to scalable vector SVG markup using modern-screenshot.
 * Enables client-side vector downloads compatible with Figma, Penpot, and Illustrator.
 */

import { domToSvg } from "modern-screenshot";

export interface SvgExportOptions {
  /** Target canvas width in pixels */
  width?: number;
  /** Target canvas height in pixels */
  height?: number;
  /** Scale factor. Default: 1 */
  scale?: number;
  /** Custom filter function to exclude elements */
  filter?: (node: Node) => boolean;
}

/**
 * Triggers a client-side file download from a Blob.
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Renders an HTMLElement to an SVG string.
 */
export async function captureNodeToSvgString(
  element: HTMLElement,
  options: SvgExportOptions = {}
): Promise<string> {
  if (typeof document === "undefined" || !element) {
    throw new Error("SVG export is only supported in a browser environment");
  }

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  return domToSvg(element, {
    width: options.width ?? element.offsetWidth,
    height: options.height ?? element.offsetHeight,
    scale: options.scale ?? 1,
    filter: options.filter,
  });
}

/**
 * Captures an HTMLElement to a standalone vector SVG file and triggers download.
 */
export async function exportNodeToSvg(
  element: HTMLElement,
  filename: string = "document.svg",
  options: SvgExportOptions = {}
): Promise<void> {
  const cleanFilename = filename.endsWith(".svg") ? filename : `${filename}.svg`;
  const svgString = await captureNodeToSvgString(element, options);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  triggerBlobDownload(blob, cleanFilename);
}
