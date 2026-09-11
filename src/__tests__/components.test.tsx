import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { NanoBananaLogo } from "../ui/NanoBananaLogo";
import { Button } from "../ui/Button";
import { SegmentedControl } from "../ui/SegmentedControl";

describe("UI Components SSR rendering", () => {
  it("renders NanoBananaLogo with accessible attributes", () => {
    const html = renderToString(<NanoBananaLogo size="md" glow ariaLabel="Brand Logo" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Brand Logo"');
    expect(html).toContain("<svg");
  });

  it("renders Button with primary variant and text", () => {
    const html = renderToString(<Button variant="primary">Exportar Documento</Button>);
    expect(html).toContain("Exportar Documento");
    expect(html).toContain("bg-amber-600");
  });

  it("renders Button in loading state", () => {
    const html = renderToString(<Button loading>A carregar</Button>);
    expect(html).toContain("animate-spin");
  });

  it("renders SegmentedControl with options and active indicator", () => {
    const items = [
      { id: "tab1", label: "Geral" },
      { id: "tab2", label: "Avançado", badge: 5 },
    ];
    const html = renderToString(
      <SegmentedControl items={items} value="tab1" onChange={() => {}} />
    );
    expect(html).toContain("Geral");
    expect(html).toContain("Avançado");
    expect(html).toContain("5");
  });
});
