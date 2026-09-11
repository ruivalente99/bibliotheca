"use client";

import { captureElementToCanvas, CaptureOptions } from "./capture";

export interface ExportImageOptions extends CaptureOptions {
  filename?: string;
  format?: "image/png" | "image/jpeg" | "image/webp";
}

/**
 * Converts an HTMLCanvasElement into a Blob.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: "image/png" | "image/jpeg" | "image/webp" = "image/png",
  quality = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to extract blob from canvas"));
      },
      format,
      quality
    );
  });
}

/**
 * Captures a DOM element and downloads it as an image file (PNG/JPEG/WebP).
 */
export async function exportElementToImage(
  element: HTMLElement,
  options: ExportImageOptions = {}
): Promise<Blob> {
  const { filename = "document.png", format = "image/png", quality = 0.95, ...captureOpts } = options;

  const canvas = await captureElementToCanvas(element, captureOpts);
  const blob = await canvasToBlob(canvas, format, quality);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  return blob;
}
