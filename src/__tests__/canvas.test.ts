import { describe, it, expect } from "vitest";
import { fitDimensionsToBoundingBox, createOffscreenCanvas } from "../export/canvas";
import { PAGE_FORMATS } from "../tokens";

describe("Canvas & Geometry Utilities", () => {
  it("fits dimensions to bounding box while preserving aspect ratio", () => {
    // 1000x500 in 500x500 box -> 500x250
    const wide = fitDimensionsToBoundingBox(1000, 500, 500, 500);
    expect(wide.width).toBe(500);
    expect(wide.height).toBe(250);
    expect(wide.scale).toBe(0.5);

    // 500x1000 in 500x500 box -> 250x500
    const tall = fitDimensionsToBoundingBox(500, 1000, 500, 500);
    expect(tall.width).toBe(250);
    expect(tall.height).toBe(500);
    expect(tall.scale).toBe(0.5);

    // Negative or zero dimensions return safe fallback
    const zero = fitDimensionsToBoundingBox(0, 0, 100, 100);
    expect(zero.width).toBe(0);
    expect(zero.height).toBe(0);
    expect(zero.scale).toBe(1);
  });

  it("creates offscreen canvas with positive dimensions", () => {
    const { canvas, ctx } = createOffscreenCanvas(256, 128);
    expect(canvas.width).toBe(256);
    expect(canvas.height).toBe(128);
    expect(ctx).toBeDefined();
  });

  it("verifies PAGE_FORMATS presets", () => {
    expect(PAGE_FORMATS.a4.widthPx).toBe(794);
    expect(PAGE_FORMATS.a4.heightPx).toBe(1123);
    expect(PAGE_FORMATS.letter.widthPx).toBe(816);
    expect(PAGE_FORMATS.square512.widthPx).toBe(512);
    expect(PAGE_FORMATS.square512.heightPx).toBe(512);
  });
});
