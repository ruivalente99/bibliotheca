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
npm install @valentium/bibliotheca
# or link locally:
npm install @valentium/bibliotheca@file:../bibliotheca
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

## 🛠️ Storybook Development & Visual Testing

Bibliotheca includes an interactive **Storybook 8** setup with live dark/light mode toggling, accessibility auditing (`addon-a11y`), and interactive component controls.

```bash
# Start Storybook dev server
npm run storybook

# Build static Storybook documentation
npm run build-storybook
```

---

## 🧪 Testing & Build

```bash
# Run Vitest test suite
npm run test

# Run TypeScript typecheck
npm run typecheck

# Build ESM & CJS distribution bundles with .d.ts
npm run build
```

---

## 📜 License

MIT © [Rui Valente](https://github.com/ruivalente99)
