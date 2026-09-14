# BIBLIOTHECA — Agent Reference & Developer Manual

This document serves as the technical guide for AI Agents, LLMs, and engineers operating on or extending the **@ruivalente99/bibliotheca** component system and document editor core.

---

## 1. System Identity & Core Tenets

Bibliotheca is an offline-first, business-agnostic component library and document editor framework designed with React 19, TypeScript, Tailwind CSS v4, and Bun.

All components, hooks, and utilities must follow these immutable principles:
- 100% Business Agnostic: Never hardcode resume, CV, invoice, slide, or persona-specific logic inside Bibliotheca. All labels, models, callbacks, and content slots must remain generic.
- Strict Token Discipline: Never invent arbitrary margins, paddings, gaps, font sizes, or color hex values. Always consume the formalized design tokens (`src/tokens/index.ts`) and CSS custom properties (`var(--page)`, `var(--brand)`, etc.).
- Dual-Tier Customization: Every visual component must accept both a top-level `className` and a granular `classNames` slot dictionary for internal element styling.
- Complete Accessibility: Components must achieve 100% pass rates in Playwright Axe WCAG 2.1 Level AA audits (`e2e/a11y.spec.ts`).
- Zero Emojis: All code, docstrings, markdown files, test descriptions, and commit messages must strictly avoid emojis.

---

## 2. Package Entrypoints & Subpaths

Bibliotheca exports six dedicated subpaths declared in `package.json` and bundled by `tsup`:

```
@ruivalente99/bibliotheca
├── /tokens      -> Formal token maps (spacing, radii, typography, shadows, 7 accent definitions)
├── /ui          -> Dumb interface primitives (Button, Badge, Card, Input, Textarea, Switch, Modal, Drawer, Tabs, etc.)
├── /editor      -> Editor workbench layout, header, section cards, split ratio, section sync
├── /preview     -> A4 document preview viewport, pan/zoom engine, dockable toolbar, grid overlay
├── /export      -> High-DPI DOM capture, vector PDF generation, PNG export, JSON serialization
└── /styles.css  -> Tailwind CSS v4 theme variables, dark mode styles, and accent palette definitions
```

### Import Examples:
```typescript
// Subpath import (recommended for bundle efficiency)
import { Button, Badge, Modal } from "@ruivalente99/bibliotheca/ui";
import { SplitEditorLayout, SectionCard } from "@ruivalente99/bibliotheca/editor";
import { PreviewViewport, DockableToolbar } from "@ruivalente99/bibliotheca/preview";
import { ACCENT_THEMES, type AccentColor } from "@ruivalente99/bibliotheca/tokens";

// Root barrel import (convenience)
import { Button, SplitEditorLayout, PreviewViewport } from "@ruivalente99/bibliotheca";
```

---

## 3. Color Theme System & The 7 Signature Accents

Bibliotheca supports dual-mode color schemes (`light`, `dark`, `system`) and seven signature color accents:

| Accent ID | Label | Light Brand | Dark Brand | Description |
| :--- | :--- | :--- | :--- | :--- |
| `amber` | Amber Gold | `#d97706` | `#f59e0b` | Warm editorial bronze, default brand |
| `teal` | Lateralis Teal | `#0f766e` | `#14b8a6` | Deep petroleum and sea green |
| `blue` | Classic Royal Blue | `#0284c7` | `#38bdf8` | Clean engineering and academic blue |
| `navy` | Executive Navy | `#1e3a8a` | `#60a5fa` | Deep structured corporate navy |
| `emerald` | Forest Emerald | `#059669` | `#10b981` | Natural organic emerald green |
| `rose` | Burgundy Rose | `#e11d48` | `#fb7185` | Warm terracotta and vibrant burgundy |
| `slate` | Obsidian Slate | `#475569` | `#94a3b8` | Monochromatic technical minimalism |

Themes are managed via `ThemeProvider` (`src/ui/ThemeContext.tsx`) and controlled visually using `ThemeSelector` or `AccentSelector`.

---

## 4. Component Inventory

### UI Primitives (`src/ui/`):
- `Button`: Primary, secondary, outline, ghost, danger, and pill styles with loading spinners and slot icons.
- `Badge`: Status tags, category labels, and removable chips with dot indicators.
- `Card`: Structured surface container with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.
- `Input`: Accessible form input with labels, helper text, error messages, prefix/suffix icons, and clear button.
- `Textarea`: Multi-line text field with optional `autoResize`, character counter, and token focus rings.
- `Switch`: Accessible toggle switch (`role="switch"`) with label and description.
- `Modal`: Accessible dialog with portal rendering, backdrop blur, ESC key dismiss, and focus trap.
- `Drawer`: Slide-over sheet panel (`right`, `left`, `bottom`) for properties, inspectors, and options.
- `Tabs`: WAI-ARIA tabbed container with `TabsList`, `TabsTrigger`, and `TabsContent`.
- `DropdownMenu`: Contextual popup menu for item actions (move, duplicate, delete).
- `EmptyState`: Placeholder for unconfigured sections or empty search results.
- `ThemeSelector`: Dropdown or toggle button for Light/Dark/System and optional accent picker.
- `AccentSelector`: Swatches row or dropdown for the 7 signature color palettes.
- `ToastContext`: Floating notification manager and asynchronous confirmation modal.
- `Tooltip`: Hover and focus popover with keyboard shortcut hints.
- `NanoBananaLogo`: Configurable geometric badge emblem with custom icon slot.

### Editor Subsystem (`src/editor/`):
- `BuilderHeader`: Top app bar with titles, subtitle, status badge, action buttons, and utility slots.
- `SectionCard`: Collapsible card with action button, badge, highlight pulse, and drag handle slot.
- `SplitEditorLayout`: Two-pane responsive split layout with draggable separator and mobile segment tabs.
- `useSplitRatio`: Hook managing proportional drag divider ratios with pointer capture.
- `useSectionSync`: Hook synchronizing preview element clicks with editor form section card scrolling and highlighting.

### Preview Subsystem (`src/preview/`):
- `PreviewViewport`: Infinite canvas wrapper with transform matrix, document backdrop, and scale indicator.
- `DockableToolbar`: Floating canvas toolbar dockable to any of the 4 screen edges (`bottom`, `top`, `left`, `right`).
- `GridOverlay`: Visual alignment grid (`dots`, `lines`, `crosses`).
- `ShortcutsLegendModal`: Keyboard shortcuts modal dialog.
- `usePanZoom`: Headless 2D spatial coordinate engine with mouse wheel zoom centering and spacebar pan.

### Export Subsystem (`src/export/`):
- `exportNodeToPdf`: Client-side multi-page A4 vector PDF compiler with interactive link annotation embedding.
- `captureNodeToCanvas`: High-DPI DOM rasterizer using `modern-screenshot`.
- `exportNodeToImage`: Client-side PNG/JPEG image downloader.
- `exportToJson` / `importFromJson`: Client-side JSON file serialization and parsing.

---

## 5. Development Commands & Quality Gates

Package management and script execution are powered by **Bun** (`bun@1.3.13`):

```bash
# Typecheck TypeScript definitions
bun run typecheck

# Run Vitest unit tests
bun run test

# Run Playwright E2E and WCAG 2.1 a11y audits
bun run test:e2e

# Build Storybook static documentation
bun run build-storybook

# Compile production package bundles (ESM, CJS, DTS)
bun run build

# Package distribution tarball (.tgz) for releases
bun run pack

# Start local Storybook development server
bun run storybook
```

---

## 6. Storybook & Testing Standards

Every new component must have:
1. A Storybook CSF3 story file (`ComponentName.stories.tsx`) covering key variants and states.
2. A unit test in `src/__tests__/components.test.tsx` verifying SSR render integrity and accessible attributes.
3. An automated Axe accessibility audit registered in `e2e/a11y.spec.ts`.
4. An interactive Playwright test in `e2e/ui.spec.ts` if the component contains interactive state.

---

## 7. Ponytail Code Review Principles

When refactoring or adding code, channel the **Ponytail** engineering discipline:
1. Question Need (YAGNI): Do not create speculative abstractions, wrapper components without added value, or premature configuration options.
2. Reach for Standard Library & Native Features: Prefer native CSS and HTML attributes (`input type="text"`, CSS variables, flexbox/grid) before custom JavaScript libraries.
3. Reuse Existing Utilities: Leverage `cn()` (`clsx` + `tailwind-merge`) and existing token structures in `src/tokens/index.ts`.
4. Keep Diffs Minimal: Shortest working implementation wins once the full problem and module boundaries are understood.
5. Zero Emojis: Maintain clean, professional documentation and commit logs.

---

## 8. Commit Conventions

Make atomic, conventional git commits:
- `feat: <description in English>`
- `fix: <description in English>`
- `refactor: <description in English>`
- `test: <description in English>`
- `docs: <description in English>`
- `chore: <description in English>`

Never include emojis in commit titles or commit descriptions.
