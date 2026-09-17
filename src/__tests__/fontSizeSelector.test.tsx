import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  FontSizeSelector,
  TextSizeSelector,
  DEFAULT_DENSITY_OPTIONS,
  DEFAULT_SCALE_OPTIONS,
} from "../ui/FontSizeSelector";
import { FONT_SIZE_SCALES, DENSITY_SCALES } from "../tokens";

describe("FontSizeSelector Component", () => {
  it("renders segmented variant with radiogroup role and active state", () => {
    const html = renderToString(
      <FontSizeSelector
        value="normal"
        onChange={() => {}}
        options={DEFAULT_DENSITY_OPTIONS}
        label="Densidade"
      />
    );

    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('role="radio"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain("Densidade");
    expect(html).toContain("Compact");
    expect(html).toContain("Normal");
    expect(html).toContain("Spacious");
  });

  it("renders stepper variant with minus and plus controls and aria labels", () => {
    const html = renderToString(
      <FontSizeSelector
        variant="stepper"
        value="normal"
        onChange={() => {}}
        options={DEFAULT_DENSITY_OPTIONS}
        showIcon
        labels={{
          decrease: "Diminuir fonte",
          increase: "Aumentar fonte",
          ariaLabel: "Controlo de escala",
        }}
      />
    );

    expect(html).toContain('aria-label="Controlo de escala"');
    expect(html).toContain('aria-label="Diminuir fonte"');
    expect(html).toContain('aria-label="Aumentar fonte"');
    expect(html).toContain("<svg"); // Icon presence
  });

  it("renders dropdown variant with trigger button and aria-haspopup", () => {
    const html = renderToString(
      <FontSizeSelector
        variant="dropdown"
        value="md"
        onChange={() => {}}
        options={DEFAULT_SCALE_OPTIONS}
        label="Reading Scale"
        showIcon
      />
    );

    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain("Reading Scale");
    expect(html).toContain("Medium");
  });

  it("supports customLabels mapping override", () => {
    const html = renderToString(
      <FontSizeSelector
        value="compact"
        onChange={() => {}}
        options={DEFAULT_DENSITY_OPTIONS}
        labels={{
          customLabels: {
            compact: "Muito Compacto",
            normal: "Equilibrado",
            spacious: "Generoso",
          },
        }}
      />
    );

    expect(html).toContain("Muito Compacto");
    expect(html).toContain("Equilibrado");
    expect(html).toContain("Generoso");
  });

  it("verifies TextSizeSelector alias export is strictly equal to FontSizeSelector", () => {
    expect(TextSizeSelector).toBe(FontSizeSelector);
  });

  it("verifies formal font size tokens exist and have correct properties", () => {
    expect(FONT_SIZE_SCALES.xs.scaleFactor).toBe(0.85);
    expect(FONT_SIZE_SCALES.md.scaleFactor).toBe(1.0);
    expect(FONT_SIZE_SCALES.xl.scaleFactor).toBe(1.25);
    expect(DENSITY_SCALES.compact.id).toBe("compact");
    expect(DENSITY_SCALES.normal.id).toBe("normal");
    expect(DENSITY_SCALES.spacious.id).toBe("spacious");
  });
});
