import { describe, it, expect } from "vitest";
import {
  md5,
  rc4,
  computePdfPermissions,
  bytesToHex,
  encryptPdfBytes,
  generatePdfUaXmp,
  enrichPdfWithPdfUa,
  diffArray,
  diffTextLines,
  getDocumentTextScaleCss,
  drawCheckerboard,
  applyShapeCutout,
} from "../index";

describe("PDF Security and Encryption Utilities", () => {
  it("computes MD5 hash accurately", () => {
    const input = new TextEncoder().encode("Hello Bibliotheca");
    const hash = md5(input);
    expect(hash).toHaveLength(16);
    expect(bytesToHex(hash)).toHaveLength(32);
  });

  it("encrypts and decrypts with RC4 stream cipher symmetrically", () => {
    const key = new TextEncoder().encode("secret-key");
    const data = new TextEncoder().encode("Confidential document content");
    const encrypted = rc4(key, data);
    expect(encrypted).not.toEqual(data);
    const decrypted = rc4(key, encrypted);
    expect(new TextDecoder().decode(decrypted)).toBe("Confidential document content");
  });

  it("computes permission flags with custom settings", () => {
    const defaultP = computePdfPermissions();
    expect(typeof defaultP).toBe("number");

    const restrictedP = computePdfPermissions({
      allowPrinting: false,
      allowCopying: false,
      allowModifying: false,
    });
    expect(restrictedP).not.toBe(defaultP);
  });

  it("handles unencrypted or plain PDF bytes gracefully", () => {
    const mockPdf = new TextEncoder().encode("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
    const result = encryptPdfBytes(mockPdf, { userPassword: "" });
    expect(result).toEqual(mockPdf);
  });
});

describe("PDF/UA-1 Accessibility Utilities", () => {
  it("generates valid ISO 14289-1 XMP metadata packet", () => {
    const xmp = generatePdfUaXmp({
      title: "Quarterly Report",
      author: "Bibliotheca Team",
      language: "pt-PT",
      keywords: ["report", "quarterly", "sovereign"],
    });

    expect(xmp).toContain("PDF/UA Universal Accessibility Schema");
    expect(xmp).toContain("Quarterly Report");
    expect(xmp).toContain("Bibliotheca Team");
    expect(xmp).toContain("<dc:language>");
    expect(xmp).toContain("pt-PT");
  });

  it("enriches raw PDF text with /ViewerPreferences and metadata", () => {
    const mockPdf = new TextEncoder().encode("%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\ntrailer\n<<>>\n%%EOF");
    const enriched = enrichPdfWithPdfUa(mockPdf, {
      title: "Accessible Document",
      language: "en-US",
    });

    const text = new TextDecoder("latin1").decode(enriched);
    expect(text).toContain("/ViewerPreferences << /DisplayDocTitle true >>");
    expect(text).toContain("/MarkInfo << /Marked true >>");
    expect(text).toContain("/Lang (en-US)");
    expect(text).toContain("/Metadata");
  });
});

describe("Diffing Algorithms", () => {
  it("calculates LCS diff operations correctly on string arrays", () => {
    const listA = ["Item 1", "Item 2", "Item 3"];
    const listB = ["Item 1", "Modified Item 2", "Item 3", "Item 4"];

    const diff = diffArray(listA, listB);
    expect(diff).toEqual([
      { type: "keep", value: "Item 1" },
      { type: "remove", value: "Item 2" },
      { type: "add", value: "Modified Item 2" },
      { type: "keep", value: "Item 3" },
      { type: "add", value: "Item 4" },
    ]);
  });

  it("provides convenience diffTextLines wrapper", () => {
    const diff = diffTextLines(["Alpha", "Beta"], ["Alpha", "Gamma"]);
    expect(diff).toHaveLength(3);
    expect(diff[0]).toEqual({ type: "keep", value: "Alpha" });
  });
});

describe("Preview Typography Text Scale", () => {
  it("returns scoped CSS rules for non-default scale", () => {
    const css = getDocumentTextScaleCss("sm", ".my-sheet");
    expect(css).toContain(".my-sheet");
    expect(css).toContain("!important");
  });

  it("returns empty string for default medium scale", () => {
    expect(getDocumentTextScaleCss("md")).toBe("");
    expect(getDocumentTextScaleCss(undefined)).toBe("");
  });
});

describe("Visual Canvas and Shape Utilities", () => {
  it("executes drawCheckerboard without throwing", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      expect(() => drawCheckerboard(ctx, 100, 100, { squareSize: 10 })).not.toThrow();
    }
  });

  it("executes applyShapeCutout for each shape type", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      expect(() => applyShapeCutout(ctx, 100, 100, "circle")).not.toThrow();
      expect(() => applyShapeCutout(ctx, 100, 100, "squircle")).not.toThrow();
      expect(() => applyShapeCutout(ctx, 100, 100, "rounded-rect")).not.toThrow();
      expect(() => applyShapeCutout(ctx, 100, 100, "heart")).not.toThrow();
      expect(() => applyShapeCutout(ctx, 100, 100, "star")).not.toThrow();
      expect(() => applyShapeCutout(ctx, 100, 100, "free")).not.toThrow();
    }
  });
});
