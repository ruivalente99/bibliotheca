/**
 * Canvas & Image Processing Utilities
 *
 * Provides client-side helpers for offscreen canvas management, image compression,
 * clipboard export, sticker contour dilation, and bounding box geometry.
 */

/**
 * Creates an offscreen canvas element and 2D context of specified dimensions.
 */
export function createOffscreenCanvas(
  width: number,
  height: number
): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d", { willReadFrequently: true }) || ({} as CanvasRenderingContext2D);
  return { canvas, ctx };
}

/**
 * Proportional aspect ratio calculations to fit source dimensions within a bounding box.
 */
export function fitDimensionsToBoundingBox(
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number
): { width: number; height: number; scale: number } {
  if (srcW <= 0 || srcH <= 0 || maxW <= 0 || maxH <= 0) {
    return { width: 0, height: 0, scale: 1 };
  }
  const scaleW = maxW / srcW;
  const scaleH = maxH / srcH;
  const scale = Math.min(scaleW, scaleH);
  return {
    width: Math.round(srcW * scale),
    height: Math.round(srcH * scale),
    scale,
  };
}

/**
 * Compresses an HTMLCanvasElement into a Blob with custom quality and mime type.
 */
export function compressCanvasImage(
  canvas: HTMLCanvasElement,
  quality = 0.92,
  type: "image/webp" | "image/jpeg" | "image/png" = "image/webp"
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode canvas to blob"));
      },
      type,
      quality
    );
  });
}

/**
 * Copies canvas contents to the system clipboard as a PNG image.
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }

  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Downloads canvas contents as an image file.
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType: "image/png" | "image/jpeg" | "image/webp" = "image/png"
): void {
  if (typeof document === "undefined") return;

  const url = canvas.toDataURL(mimeType);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

/**
 * Generates a smooth, anti-aliased die-cut sticker silhouette outline using radial dilation.
 * Runs completely client-side in microseconds without external libraries.
 */
export function renderStickerOutline(
  sourceCanvas: HTMLCanvasElement,
  borderWidth: number,
  borderColor: string
): HTMLCanvasElement {
  if (borderWidth <= 0) return sourceCanvas;

  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  // 1. Create silhouette mask (tint visible pixels with borderColor)
  const { canvas: maskCanvas, ctx: maskCtx } = createOffscreenCanvas(w, h);
  maskCtx.drawImage(sourceCanvas, 0, 0);
  maskCtx.globalCompositeOperation = "source-in";
  maskCtx.fillStyle = borderColor;
  maskCtx.fillRect(0, 0, w, h);

  // 2. Dilate silhouette outward using concentric radial steps
  const { canvas: dilatedCanvas, ctx: dilatedCtx } = createOffscreenCanvas(w, h);
  dilatedCtx.imageSmoothingEnabled = true;

  const steps = Math.max(24, Math.ceil(borderWidth * 2.5));
  const angleStep = (Math.PI * 2) / steps;
  const radialInterval = Math.max(1, Math.floor(borderWidth / 6));

  for (let r = radialInterval; r <= borderWidth; r += radialInterval) {
    for (let i = 0; i < steps; i++) {
      const angle = i * angleStep;
      const dx = Math.round(Math.cos(angle) * r);
      const dy = Math.round(Math.sin(angle) * r);
      dilatedCtx.drawImage(maskCanvas, dx, dy);
    }
  }

  // Draw outermost perimeter ring with maximum accuracy
  for (let i = 0; i < steps; i++) {
    const angle = i * angleStep;
    const dx = Math.round(Math.cos(angle) * borderWidth);
    const dy = Math.round(Math.sin(angle) * borderWidth);
    dilatedCtx.drawImage(maskCanvas, dx, dy);
  }

  // 3. Composite original artwork on top of the dilated outline
  dilatedCtx.drawImage(sourceCanvas, 0, 0);

  return dilatedCanvas;
}
