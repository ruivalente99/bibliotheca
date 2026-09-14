# Bibliotheca — Architectura Vitae

> "Omnis ars imitatio naturae est." — Seneca

A unified, offline-first React 19 and Tailwind CSS v4 component library and document editor core powering dynamic document studios, publishing workbenches, and interactive canvas applications.

---

## Subpath Modules

Bibliotheca provides 6 modular subpath exports:

| Module | Purpose | Key Exports |
| :--- | :--- | :--- |
| **`@ruivalente99/bibliotheca/tokens`** | Formal design tokens & theme palettes | `ACCENT_THEMES`, `ACCENT_LIST`, `SPACING_TOKENS`, `RADIUS_TOKENS`, `SHADOW_TOKENS` |
| **`@ruivalente99/bibliotheca/ui`** | Design primitives & UI contexts | `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Switch`, `Modal`, `Drawer`, `Tabs`, `DropdownMenu`, `AccentSelector`, `ThemeSelector`, `ThemeProvider`, `ToastProvider`, `EmptyState`, `Tooltip`, `NanoBananaLogo`, `cn` |
| **`@ruivalente99/bibliotheca/editor`** | Builder layout & sync | `SplitEditorLayout`, `useSplitRatio`, `useSectionSync`, `BuilderHeader`, `SectionCard` |
| **`@ruivalente99/bibliotheca/preview`** | Canvas & viewport engine | `PreviewViewport`, `usePanZoom`, `DockableToolbar`, `GridOverlay`, `CanvasTooltip`, `ShortcutsLegendModal` |
| **`@ruivalente99/bibliotheca/export`** | Export & I/O helpers | `captureNodeToCanvas`, `capturePages`, `exportNodeToPdf`, `exportNodeToImage`, `exportToJson`, `importFromJson` |
| **`@ruivalente99/bibliotheca/styles.css`** | Tailwind CSS v4 variables & themes | Core design token variables, dark mode rules, and 7 accent palette classes |

---

## Quickstart

### 1. Installation

From GitHub Packages (`.npmrc`: `@ruivalente99:registry=https://npm.pkg.github.com`):

```bash
bun add @ruivalente99/bibliotheca
# or install directly from release tarball:
bun add https://github.com/ruivalente99/bibliotheca/releases/download/v0.3.1/ruivalente99-bibliotheca-0.3.1.tgz
# or link locally:
bun add @ruivalente99/bibliotheca@file:../bibliotheca
```

### 2. Configure Tailwind CSS v4

Add the stylesheet import and `@source` directive in your application's `globals.css`:

```css
@import "tailwindcss";
@import "@ruivalente99/bibliotheca/styles.css";

/* Scan Bibliotheca components for utility classes */
@source "../node_modules/@ruivalente99/bibliotheca";
```

### 3. Wrap Root Layout with Providers

```tsx
// app/layout.tsx
import { ThemeProvider, ToastProvider } from "@ruivalente99/bibliotheca/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" defaultAccent="amber">
          <ToastProvider autoDismissMs={4000}>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Signature Color Accent Themes

Bibliotheca provides 7 signature color palettes switchable via `data-accent="<theme>"` and `ThemeContext`:

1. **Amber Gold (`amber`)**: Warm editorial bronze and gold, default brand accent.
2. **Lateralis Teal (`teal`)**: Petroleum and sea green palette, designed for technical clarity.
3. **Classic Royal Blue (`blue`)**: Crisp academic and engineering blue, optimized for clean print documents.
4. **Executive Navy (`navy`)**: Deep structured corporate navy for executive portfolios and legal instruments.
5. **Forest Emerald (`emerald`)**: Natural organic emerald green, conveying growth and sustainability.
6. **Burgundy Rose (`rose`)**: Warm terracotta and vibrant burgundy for expressive creative design.
7. **Obsidian Slate (`slate`)**: High-contrast monochrome neutral slate for technical minimalism.

Use the `AccentSelector` component or pass `showAccentPicker` to `ThemeSelector` to allow users to switch color themes dynamically.

---

## Pure Business-Agnostic Component Architecture

All components in Bibliotheca adhere to strict design principles:
1. **100% Business Agnostic**: No hardcoded resume, CV, invoice, or persona-specific assumptions. All data models, callbacks, and slot elements are generic.
2. **Deterministic Design Tokens**: Margins, paddings, gaps, font sizes, and borders follow an 8-point modular scale.
3. **Complete Styling Overrides**: Every component accepts a root `className` and a fine-grained slot-based `classNames` dictionary for internal sub-element customization without fighting CSS specificity.
4. **Strict Accessibility**: Components are audited against WCAG 2.1 Level AA requirements with 100% pass rates.

---

## Storybook Development & Visual Testing

Bibliotheca includes Storybook 8 with dark/light mode switching, accent palette switching, accessibility auditing (`addon-a11y`), and interactive controls:

```bash
# Start Storybook dev server
bun run storybook

# Build static Storybook documentation
bun run build-storybook
```

---

## Testing & Quality Assurance

Bibliotheca is tested with Vitest unit tests, Playwright end-to-end flows, and automated Axe accessibility audits:

```bash
# Run Vitest unit test suite
bun run test

# Run Playwright E2E and WCAG 2.1 AA a11y test suite
bun run test:e2e

# Run TypeScript typecheck
bun run typecheck

# Build ESM & CJS distribution bundles with .d.ts
bun run build

# Package distribution tarball for release (.tgz)
bun run pack
```

---

## Documentation Guides

- [DESIGN.md](./DESIGN.md): Detailed specification of tokens, colors, spacing, typography, and accessibility.
- [ARCHITECTURE.md](./ARCHITECTURE.md): Architectural layout, subsystem boundaries, and state synchronization.
- [AGENTS.md](./AGENTS.md): Agent reference manual for automated maintenance and LLM interactions.

---

## License

MIT (c) [Rui Valente](https://github.com/ruivalente99)
