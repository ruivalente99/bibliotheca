"use client";

import { jsPDF } from "jspdf";
import { capturePages, CaptureOptions } from "./capture";

export interface PdfLinkAnnotation {
  url: string;
  xMm: number;
  yMm: number;
  wMm: number;
  hMm: number;
  pageIndex: number;
}

export interface ExportPdfOptions extends CaptureOptions {
  /** Target filename with or without .pdf extension. Default: 'document.pdf' */
  filename?: string;
  /** PDF page orientation: 'portrait' or 'landscape'. Default: 'portrait' */
  orientation?: "portrait" | "landscape";
  /** Standard page format (e.g. 'a4') or [width, height] in mm. Default: 'a4' */
  format?: string | [number, number];
  /** Interactive link annotations to embed on specific pages */
  linkAnnotations?: PdfLinkAnnotation[];
  /** Automatically extract interactive <a> hyperlinks from the DOM. Default: true */
  autoExtractLinks?: boolean;
}

/**
 * Computes optimal split points (in unscaled layout pixels) to avoid slicing through text elements.
 */
export function calculateSmartPageBreaks(
  el: HTMLElement,
  totalHeight: number,
  pageHeight = 1123,
  baseWidth = 794
): number[] {
  const parentRect = el.getBoundingClientRect();
  const currentScale = parentRect.width / baseWidth || 1;

  // Find all elements marked for mandatory or manual page break
  const forcedBreakElements = Array.from(
    el.querySelectorAll<HTMLElement>(
      '[data-page-break-before="true"], .page-break-before, [data-break-before="true"]'
    )
  );

  const forcedBreaks = forcedBreakElements
    .map((item) => {
      const r = item.getBoundingClientRect();
      return Math.round((r.top - parentRect.top) / currentScale);
    })
    .filter((y) => y > 10 && y < totalHeight - 10)
    .sort((a, b) => a - b);

  if (totalHeight <= pageHeight + 60 && forcedBreaks.length === 0) {
    return [totalHeight];
  }

  // Avoid-break candidates
  const items = Array.from(
    el.querySelectorAll<HTMLElement>(
      '[data-page-break-avoid="true"], [data-break-avoid="true"], li, p, h1, h2, h3, .section-card, [data-section]'
    )
  );

  const itemBoxes = items
    .map((item) => {
      const r = item.getBoundingClientRect();
      return {
        top: (r.top - parentRect.top) / currentScale,
        bottom: (r.bottom - parentRect.top) / currentScale,
        height: r.height / currentScale,
      };
    })
    .filter((box) => box.height > 5 && box.bottom <= totalHeight);

  const breaks: number[] = [];
  let currentY = 0;

  while (currentY < totalHeight) {
    const nextForced = forcedBreaks.find((fb) => fb > currentY + 15);
    const targetY = currentY + pageHeight;

    if (nextForced && nextForced <= targetY) {
      breaks.push(nextForced);
      currentY = nextForced;
      continue;
    }

    if (currentY + pageHeight >= totalHeight) {
      break;
    }

    if (totalHeight - targetY < 60) {
      break;
    }

    const intersectingItem = itemBoxes.find(
      (box) => box.top < targetY && box.bottom > targetY
    );

    let splitY = targetY;

    if (intersectingItem && intersectingItem.top > currentY + pageHeight * 0.6) {
      splitY = Math.max(currentY + pageHeight * 0.6, intersectingItem.top - 4);
    } else {
      const itemsBefore = itemBoxes.filter(
        (box) => box.bottom <= targetY && box.bottom > currentY + pageHeight * 0.65
      );
      if (itemsBefore.length > 0) {
        const lastItem = itemsBefore[itemsBefore.length - 1];
        splitY = lastItem.bottom + 4;
      }
    }

    breaks.push(splitY);
    currentY = splitY;
  }

  breaks.push(totalHeight);
  return breaks;
}

/**
 * Extracts and maps all <a> links inside a container element to PDF page millimeter coordinates.
 */
export function extractLinkAnnotations(
  el: HTMLElement,
  pageBreaks: number[] = [],
  baseWidth = 794,
  baseHeight = 1123,
  pageWidthMm = 210,
  pageHeightMm = 297
): PdfLinkAnnotation[] {
  const annotations: PdfLinkAnnotation[] = [];
  const parentRect = el.getBoundingClientRect();
  const currentScale = parentRect.width / baseWidth || 1;
  const mmPerPxX = pageWidthMm / baseWidth;
  const mmPerPxY = pageHeightMm / baseHeight;

  const anchors = el.querySelectorAll<HTMLAnchorElement>("a[href]");

  anchors.forEach((a) => {
    const rawHref = a.getAttribute("href")?.trim();
    if (!rawHref || rawHref === "#" || rawHref.startsWith("javascript:")) return;

    let url = rawHref;
    if (
      !url.startsWith("mailto:") &&
      !url.startsWith("tel:") &&
      !/^https?:\/\//i.test(url)
    ) {
      url = `https://${url}`;
    }

    const rect = a.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const unscaledX = (rect.left - parentRect.left) / currentScale;
    const unscaledY = (rect.top - parentRect.top) / currentScale;
    const unscaledW = rect.width / currentScale;
    const unscaledH = rect.height / currentScale;

    let pageIndex = 0;
    let pageStartY = 0;

    for (let p = 0; p < pageBreaks.length; p++) {
      const prevBreak = p === 0 ? 0 : pageBreaks[p - 1];
      const nextBreak = pageBreaks[p];
      if (unscaledY >= prevBreak && unscaledY < nextBreak) {
        pageIndex = p;
        pageStartY = prevBreak;
        break;
      }
    }

    const yOnPagePx = unscaledY - pageStartY;

    annotations.push({
      url,
      xMm: Math.max(0, unscaledX * mmPerPxX),
      yMm: Math.max(0, yOnPagePx * mmPerPxY),
      wMm: unscaledW * mmPerPxX,
      hMm: unscaledH * mmPerPxY,
      pageIndex,
    });
  });

  return annotations;
}

/**
 * Converts an array of HTMLCanvasElement pages into a PDF Blob with embedded link annotations.
 */
export async function canvasesToPdfBlob(
  canvases: HTMLCanvasElement[],
  options: Pick<ExportPdfOptions, "orientation" | "format" | "linkAnnotations"> = {}
): Promise<Blob> {
  const { orientation = "portrait", format = "a4", linkAnnotations = [] } = options;

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

    // Embed interactive link annotations for this page
    const pageLinks = linkAnnotations.filter((link) => link.pageIndex === i);
    for (const link of pageLinks) {
      pdf.link(link.xMm, link.yMm, link.wMm, link.hMm, { url: link.url });
    }
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
  const { filename = "document.pdf", autoExtractLinks = true, linkAnnotations = [], ...rest } = options;
  const pages = await capturePages(container, rest);

  let finalLinks = linkAnnotations;
  if (autoExtractLinks && finalLinks.length === 0) {
    const breaks = pages.map((_, idx) => (idx + 1) * 1123);
    finalLinks = extractLinkAnnotations(container, breaks);
  }

  const blob = await canvasesToPdfBlob(
    pages.map((p) => p.canvas),
    {
      ...rest,
      linkAnnotations: finalLinks,
    }
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
