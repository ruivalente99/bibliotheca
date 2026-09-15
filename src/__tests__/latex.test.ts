import { describe, it, expect } from "vitest";
import { escapeLatex, sanitizeLatex, buildLatexPreamble } from "../export/latex";

describe("LaTeX Export Utilities", () => {
  it("escapes reserved characters correctly", () => {
    const raw = "100% Cotton & Wool $5 #1 item_test {a} ~ ^ \\test";
    const escaped = escapeLatex(raw);

    expect(escaped).toContain("\\%");
    expect(escaped).toContain("\\&");
    expect(escaped).toContain("\\$");
    expect(escaped).toContain("\\#");
    expect(escaped).toContain("\\_");
    expect(escaped).toContain("\\{");
    expect(escaped).toContain("\\}");
    expect(escaped).toContain("\\textasciitilde{}");
    expect(escaped).toContain("\\textasciicircum{}");
    expect(escaped).toContain("\\textbackslash{}");
  });

  it("handles null and undefined safely", () => {
    expect(escapeLatex(null)).toBe("");
    expect(escapeLatex(undefined)).toBe("");
    expect(sanitizeLatex(null)).toBe("");
    expect(sanitizeLatex(undefined)).toBe("");
  });

  it("sanitizes text by stripping control characters and normalizing whitespace", () => {
    const dirty = "  Hello \x00\x07 world \t\t with  spaces   ";
    const cleaned = sanitizeLatex(dirty);
    expect(cleaned).toBe("Hello world with spaces");
  });

  it("generates a standard compilable LaTeX preamble", () => {
    const preamble = buildLatexPreamble({
      documentClass: "article",
      language: "portuguese",
      margins: "2cm",
      packages: ["microtype", "\\usepackage{tikz}"],
      extraPreamble: "\\newcommand{\\mycmd}{val}",
    });

    expect(preamble).toContain("\\documentclass[10pt,a4paper]{article}");
    expect(preamble).toContain("\\usepackage[portuguese]{babel}");
    expect(preamble).toContain("\\usepackage[margin=2cm]{geometry}");
    expect(preamble).toContain("\\usepackage{microtype}");
    expect(preamble).toContain("\\usepackage{tikz}");
    expect(preamble).toContain("\\newcommand{\\mycmd}{val}");
  });
});
