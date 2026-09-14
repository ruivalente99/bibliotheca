# Bibliotheca Architecture Guide

## 1. Architectural Philosophy and System Boundaries

Bibliotheca is an offline-first UI component library and document editor framework designed for web-based authoring platforms (such as resume builders, certificate creators, technical report studios, and publishing tools). 

The architecture is governed by four structural rules:
1. Zero Domain Knowledge: Components have no awareness of CVs, resumes, users, invoices, or business workflows. All models, labels, data structures, and callbacks are generic.
2. Headless Logic / Controlled Presentational Split: State management hooks (`usePanZoom`, `useSplitRatio`, `useSectionSync`, `useTheme`, `useToast`) are decoupled from their presentational shells (`PreviewViewport`, `SplitEditorLayout`, `SectionCard`).
3. Dual-Tier Customization: Every visual element accepts a root `className` for high-level styling and a `classNames` slot dictionary for granular element overrides without specificity hacks.
4. Deterministic Build Artifacts: Emits both ECMAScript Modules (ESM) and CommonJS (CJS) alongside TypeScript declarations (`.d.ts`), compiled via `tsup` targeting `es2022`.

---

## 2. Package Structure and Subpath Exports

The library is organized into six isolated subpath entrypoints defined in `package.json` and `tsup.config.ts`:

```
@valentium/bibliotheca
├── /tokens      -> Formal token maps (spacing, radii, typography, shadows, 7 accent definitions)
├── /ui          -> Dumb primitives (Button, Badge, Card, Input, Textarea, Switch, Modal, Drawer, etc.)
├── /editor      -> Editor workbench layouts, section cards, split panels, sync hooks
├── /preview     -> High-precision canvas viewport, pan/zoom engine, dockable toolbar, grid overlay
├── /export      -> High-DPI DOM capture, multi-page PDF generation, PNG/JPEG rasterization, JSON I/O
└── /styles.css  -> Tailwind CSS v4 variables, light/dark themes, and accent classes
```

### 2.1 Module Summary

| Module | Primary Exported Symbols | Purpose |
| :--- | :--- | :--- |
| `tokens` | `ACCENT_THEMES`, `SPACING_TOKENS`, `RADIUS_TOKENS`, `SHADOW_TOKENS` | Immutable design tokens and type contracts |
| `ui` | `Button`, `Badge`, `Card`, `Input`, `Textarea`, `Switch`, `Modal`, `Drawer`, `Tabs`, `DropdownMenu`, `AccentSelector`, `ThemeSelector`, `ToastProvider` | Reusable, accessible interface primitives |
| `editor` | `BuilderHeader`, `SectionCard`, `SplitEditorLayout`, `useSplitRatio`, `useSectionSync` | Document authoring workflow and pane synchronization |
| `preview` | `PreviewViewport`, `DockableToolbar`, `GridOverlay`, `CanvasTooltip`, `usePanZoom` | Interactive A4 canvas and spatial transformation |
| `export` | `exportNodeToPdf`, `captureNodeToCanvas`, `exportNodeToImage`, `exportToJson`, `importFromJson` | Offline vector and bitmap document rendering |

---

## 3. Design Tokens and Theme Architecture

Theme state is orchestrated via `ThemeProvider` (`src/ui/ThemeContext.tsx`). The theme engine manages two orthogonal dimensions:
1. Mode: `light` | `dark` | `system` (resolves system preference using `window.matchMedia("(prefers-color-scheme: dark)")`).
2. Accent: `amber` | `teal` | `blue` | `navy` | `emerald` | `rose` | `slate`.

```
                    +-----------------------------+
                    |        ThemeProvider        |
                    | (mode: light/dark/system)   |
                    | (accent: 7 color options)   |
                    +--------------+--------------+
                                   |
                   +---------------+---------------+
                   |                               |
                   v                               v
         [DOM Synchronization]          [Local Storage Persistence]
         - classList: .dark             - bibliotheca_theme_mode
         - data-theme: light|dark       - bibliotheca_theme_accent
         - data-accent: amber|...
                   |
                   v
         [CSS Custom Properties]
         - var(--page), var(--surface-1)
         - var(--brand), var(--brand-hover), var(--brand-ring)
```

DOM attributes are set on both `document.documentElement` and `document.body` so modals, portals, and nested frames inherit the active mode and accent palette synchronously.

---

## 4. Editor Layout and Section Synchronization

The editor pane architecture solves responsive two-column synchronization between form editing controls and visual canvas representations:

### 4.1 Split Ratio and Drag Engine (`useSplitRatio.ts`)
- Maintains desktop proportional split ratio (`defaultRatio: 45`% left pane, `55`% right pane).
- Bounds dragging between `minRatio: 25`% and `maxRatio: 75`%.
- Integrates pointer capture (`setPointerCapture`) for smooth dragging across iframes and canvas elements without cursor stutter.
- Automatically collapses to full width in mobile viewports (`< 768px`) with an integrated segmented switcher (`Edit` vs `Preview`).

### 4.2 Bi-directional Section Sync (`useSectionSync.ts`)
- Connects target IDs in the preview canvas (e.g., `experience-0`) to form section cards (`SectionCard`).
- Provides smooth scrolling with automatic scroll centering (`scrollIntoView({ behavior: 'smooth', block: 'center' })`).
- Activates `highlighted={true}` on the matching `SectionCard`, which renders an accent pulse ring (`highlight-pulse`) using `var(--brand-ring)`.

---

## 5. Preview Viewport and Spatial Engine

The preview subsystem (`src/preview/`) renders documents inside a virtual infinite canvas:

### 5.1 Transform Matrix and Pan/Zoom (`usePanZoom.ts`)
- Manages 2D coordinate state: `{ zoom: number, pan: { x: number, y: number } }`.
- Zoom boundaries: `minZoom: 0.2` (20%) to `maxZoom: 3.0` (300%).
- Zoom centering: Zooming via mouse wheel calculates pivot offset relative to pointer coordinates so the cursor remains fixed over the target document pixel.
- Mode switching: Supports `pointer` (select/interact) and `hand` (panning). Holding the `Space` key activates temporary hand panning from any mode.

### 5.2 Responsive Dockable Toolbar (`DockableToolbar.tsx`)
- Floats over the viewport with 4 edge positions: `bottom`, `top`, `left`, `right`.
- Features an interactive drag grip that determines the closest viewport perimeter edge based on pointer release coordinates.
- Double-clicking the grip cycles clockwise through all 4 edges.

---

## 6. High-DPI Capture and Export Pipeline

Document rendering is completely client-side and offline-safe:

1. DOM Cloning and Sanitization (`capture.ts`):
   - Uses `modern-screenshot` with custom scale factors (`scale: 2` or `scale: 3`) for crisp vector-grade bitmap rasterization.
   - Cleans font smoothing artifacts and applies target paper dimensions (standard A4: 794px x 1123px at 96 DPI).
2. Vector PDF Compilation (`pdfExport.ts`):
   - Computes millimeter bounding boxes from pixel coordinates (`mm = px * 25.4 / 96`).
   - Scans all `<a>` tags in the captured DOM node and embeds true clickable PDF link annotations using `jsPDF.link(x, y, w, h, { url })`.
3. Safe JSON Serialization (`jsonIO.ts`):
   - Exports formatted JSON with date-stamped file naming.
   - Validates schema structure on import with informative error throwing.

---

## 7. Quality Assurance and Testing Architecture

Quality gates run in continuous integration (`.github/workflows/ci.yml`) and pre-commit checks:
1. TypeScript Validation: `bun run typecheck` (`tsc --noEmit`).
2. Fast Unit Testing: `bun run test` (`vitest run` with Happy-DOM).
3. Storybook Build: `bun run build-storybook` (verifies all MDX docs and CSF3 stories).
4. Playwright End-to-End Suite: `bun run test:e2e` against live Storybook iframe builds.
5. Automated WCAG 2.1 AA Audits: Runs `@axe-core/playwright` across every component story in both light and dark modes.
