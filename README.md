# 🏛️ Bibliotheca — Architectura Vitae

> *"Omnis ars imitatio naturae est."* — Seneca

A unified, offline-first **React 19** & **Tailwind CSS v4** component library and document editor core powering **Papyrus** (`cvana`), **Sappientus** (`sappientus`), **Imaguncula** (`Imaguncula`), and next-generation document-crafting applications.

---

## 🧭 Subpath Modules

Bibliotheca provides 4 clean modular subpath exports:

| Module | Purpose | Key Exports |
| :--- | :--- | :--- |
| **`@valentium/bibliotheca/ui`** | Design system & contexts | `NanoBananaLogo`, `ThemeProvider`, `ThemeSelector`, `ToastProvider`, `useToast`, `SegmentedControl`, `Button`, `Tooltip`, `cn` |
| **`@valentium/bibliotheca/editor`** | Builder layout & sync | `SplitEditorLayout`, `useSplitRatio`, `useSectionSync`, `BuilderHeader`, `SectionCard` |
| **`@valentium/bibliotheca/preview`** | Canvas & viewport engine | `PreviewViewport`, `usePanZoom`, `DockableToolbar`, `GridOverlay`, `CanvasTooltip`, `ShortcutsLegendModal` |
| **`@valentium/bibliotheca/export`** | Export & I/O helpers | `captureElementToCanvas`, `capturePages`, `exportElementToPdf`, `exportElementToImage`, `downloadJson`, `promptUploadJson` |

---

## ⚡ Quickstart

### 1. Install

```bash
bun add @valentium/bibliotheca
# or link locally:
bun add @valentium/bibliotheca@file:../bibliotheca
```

### 2. Configure Tailwind CSS v4

Add the `@source` directive in your application's `globals.css`:

```css
@import "tailwindcss";

/* Scan Bibliotheca components for utility classes */
@source "../node_modules/@valentium/bibliotheca";
```

### 3. Wrap Root Layout with Providers

```tsx
// app/layout.tsx
import { ThemeProvider, ToastProvider } from "@valentium/bibliotheca/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
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

## 🎨 Pure Dumb Component Architecture

All components in Bibliotheca follow two core principles:
1. **Zero hardcoded labels**: Every user-facing string, tooltip, ARIA label, and button text is passed via props (with sensible fallback defaults where appropriate, but fully customizable). This ensures total internationalization (i18n) freedom across English, Portuguese, Latin, or any locale.
2. **Complete styling overrides**: Every component accepts a root `className` and fine-grained slot-based `classNames?: { [slot]: string }` prop, enabling consumers to customize headers, badges, actions, contents, pills, and dropdowns with Tailwind utilities without fighting internal CSS.

---

## 🛠️ Storybook Development & Visual Testing

Bibliotheca includes an interactive **Storybook 8** setup with live dark/light mode toggling, accessibility auditing (`addon-a11y`), and interactive component controls.

```bash
# Start Storybook dev server
bun run storybook

# Build static Storybook documentation
bun run build-storybook
```

---

## 🧪 Testing & Quality Assurance

Bibliotheca is tested with both Vitest unit tests and Playwright end-to-end + WCAG 2.1 AA accessibility audits via `@axe-core/playwright`.

```bash
# Run Vitest unit test suite
bun run test

# Run Playwright E2E and WCAG 2.1 AA a11y test suite
bun run test:e2e

# Run TypeScript typecheck
bun run typecheck

# Build ESM & CJS distribution bundles with .d.ts
bun run build
```

---

## 📜 License

MIT © [Rui Valente](https://github.com/ruivalente99)

