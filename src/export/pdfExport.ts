"use client";

import { jsPDF } from "jspdf";
import { capturePages, CaptureOptions } from "./capture";

export interface ExportPdfOptions extends CaptureOptions {
  /** Target filename with or without .pdf extension. Default: 'document.pdf' */
  filename?: string;
  /** PDF page orientation: 'portrait' or 'landscape'. Default: 'portrait' */
  orientation?: "portrait" | "landscape";
  /** Standard page format (e.g. 'a4') or [width, height] in mm. Default: 'a4' */
  format?: string | [number, number];
}

/**
 * Converts an array of HTMLCanvasElement pages into a PDF Blob.
 */
export async function canvasesToPdfBlob(
  canvases: HTMLCanvasElement[],
  options: Pick<ExportPdfOptions, "orientation" | "format"> = {}
): Promise<Blob> {
  const { orientation = "portrait", format = "a4" } = options;

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format,
    compress: true,
  });

  const pageWidthMm = pdf.internal.pageSize.getWidth();
  const pageHeightMm = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < canvases.length; i++) {
    if (i > 0) {
      pdf.addPage(format, orientation);
    }

    const canvas = canvases[i];
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidthMm, pageHeightMm, undefined, "FAST");
  }

  return pdf.output("blob");
}

/**
 * High-level helper: Captures a container element and triggers an automatic PDF download.
 */
export async function exportElementToPdf(
  container: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<Blob> {
  const { filename = "document.pdf", ...rest } = options;
  const pages = await capturePages(container, rest);
  const blob = await canvasesToPdfBlob(
    pages.map((p) => p.canvas),
    rest
  );

  const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cleanFilename;
  a.click();
  URL.revokeObjectURL(url);

  return blob;
}
