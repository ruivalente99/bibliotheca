# Bibliotheca Design Guide

## 1. Overview and Core Philosophy

Bibliotheca is an offline-first, business-agnostic component system and document editor foundation built with React 19, TypeScript, and Tailwind CSS v4. It enforces strict separation of concerns:
- Zero Business Assumptions: Bibliotheca components contain no domain-specific resume, invoice, or slide logic. They operate as pure layout, editor, viewport, and utility primitives.
- Deterministic Token Hierarchy: Every component adheres to an 8-point modular grid, strict typographic scales, and semantic CSS variables.
- Dual-Mode Accessibility: Light and dark modes are treated with equal typographic clarity, targeting WCAG 2.1 Level AA compliance.
- Granular Customization: Every component exposes a `classNames` slot dictionary alongside standard `className` for targeted styling without CSS specificity wars.

---

## 2. Color System and Palette Architecture

Bibliotheca implements a dual-layer color system: an immutable neutral surface foundation combined with a dynamic semantic accent layer.

### 2.1 Neutral Surfaces (Light and Dark)

The neutral foundation provides calibrated contrast for long editing sessions:

| Token | Light Mode | Dark Mode | Semantic Role |
| :--- | :--- | :--- | :--- |
| `--page` | `#f7f7f5` | `#0d1117` | Canvas and background root |
| `--surface-1` | `#ffffff` | `#161b22` | Navigation, toolbars, elevated drawers |
| `--card` | `#ffffff` | `#21262d` | Content sections and editor cards |
| `--card-soft` | `#fbfaf9` | `#1c2128` | Nested blocks, code zones, grouped inputs |
| `--control-fill`| `#f5f4f1` | `#0d1117` | Segmented controls, input fill layers |
| `--heading` | `#1c1917` | `#f0f3f6` | Primary headers and high-emphasis text |
| `--body` | `#57534e` | `#c9d1d9` | Main copy and form input values |
| `--body-subtle` | `#78716c` | `#8b949e` | Metadata, helpers, placeholders, timestamps |
| `--border` | `#e7e5e4` | `#363d47` | Structural dividers and card outlines |
| `--border-subtle`| `#f5f5f4` | `#21262d` | Internal item separators |

### 2.2 Signature Accent Palettes

The theme accent is controlled via `data-accent="<theme>"` and `ThemeContext`:

1. Amber Gold (`amber`)
   - Default warm editorial brand.
   - Light: Brand `#d97706`, Hover `#b45309`, Light `#f59e0b`, Soft `rgba(245, 158, 11, 0.12)`.
   - Dark: Brand `#f59e0b`, Hover `#fbbf24`, Light `#fde047`, Soft `rgba(245, 158, 11, 0.18)`.

2. Lateralis Teal (`teal`)
   - Petroleum and sea green palette, designed for technical clarity and balance.
   - Light: Brand `#0f766e`, Hover `#115e59`, Light `#14b8a6`, Soft `rgba(20, 184, 166, 0.12)`.
   - Dark: Brand `#14b8a6`, Hover `#2dd4bf`, Light `#5eead4`, Soft `rgba(20, 184, 166, 0.18)`.

3. Classic Royal Blue (`blue`)
   - Clean engineering blue, optimized for academic and ATS-parsed documents.
   - Light: Brand `#0284c7`, Hover `#0369a1`, Light `#38bdf8`, Soft `rgba(56, 189, 248, 0.12)`.
   - Dark: Brand `#38bdf8`, Hover `#7dd3fc`, Light `#bae6fd`, Soft `rgba(56, 189, 248, 0.18)`.

4. Executive Navy (`navy`)
   - Deep corporate navy for executive CVs, contracts, and proposals.
   - Light: Brand `#1e3a8a`, Hover `#172554`, Light `#3b82f6`, Soft `rgba(59, 130, 246, 0.12)`.
   - Dark: Brand `#60a5fa`, Hover `#93c5fd`, Light `#bfdbfe`, Soft `rgba(96, 165, 250, 0.18)`.

5. Forest Emerald (`emerald`)
   - Natural organic emerald green, conveying vitality and verified achievements.
   - Light: Brand `#059669`, Hover `#047857`, Light `#10b981`, Soft `rgba(16, 185, 129, 0.12)`.
   - Dark: Brand `#10b981`, Hover `#34d399`, Light `#6ee7b7`, Soft `rgba(16, 185, 129, 0.18)`.

6. Burgundy Rose (`rose`)
   - Warm terracotta and deep rose for expressive creative portfolios and studio documents.
   - Light: Brand `#e11d48`, Hover `#be123c`, Light `#f43f5e`, Soft `rgba(244, 63, 94, 0.12)`.
   - Dark: Brand `#fb7185`, Hover `#fda4af`, Light `#fecdd3`, Soft `rgba(251, 113, 133, 0.18)`.

7. Obsidian Slate (`slate`)
   - High-contrast monochromatic slate for technical minimalism and terminal aesthetics.
   - Light: Brand `#475569`, Hover `#334155`, Light `#64748b`, Soft `rgba(100, 116, 139, 0.12)`.
   - Dark: Brand `#94a3b8`, Hover `#cbd5e1`, Light `#e2e8f0`, Soft `rgba(148, 163, 184, 0.18)`.

---

## 3. Spacing System

All margins, paddings, gaps, and component heights adhere strictly to the 4px/8px modular scale:

| Token Step | CSS Rem | Pixels | Common Application |
| :--- | :--- | :--- | :--- |
| `0.5` | `0.125rem` | `2px` | Divider thickness, minimal offset |
| `1` | `0.25rem` | `4px` | Segmented control interior padding, icon gap |
| `1.5` | `0.375rem` | `6px` | Compact button gap, toolbar gap |
| `2` | `0.5rem` | `8px` | Badge padding, grid gutter, compact input padding |
| `2.5` | `0.625rem` | `10px` | Small button horizontal padding |
| `3` | `0.75rem` | `12px` | Standard input internal padding, card item gap |
| `3.5` | `0.875rem` | `14px` | Standard button horizontal padding |
| `4` | `1.0rem` | `16px` | Section card padding, modal content padding |
| `5` | `1.25rem` | `20px` | Header padding, large card content spacing |
| `6` | `1.5rem` | `24px` | Drawer and dialog padding, section margins |
| `8` | `2.0rem` | `32px` | Empty state padding, large layout gaps |
| `12` | `3.0rem` | `48px` | Hero viewport margins |

---

## 4. Typography Scale

Text sizes and line-height pairings ensure comfortable reading across editor panels and preview canvases:

| Token | Size | Line Height | Application |
| :--- | :--- | :--- | :--- |
| `2xs` | `11px (0.6875rem)` | `14px` | Badges, CEFR codes, keyboard shortcuts, tooltips |
| `xs` | `12px (0.75rem)` | `16px` | Form labels, input text, toolbar captions, body copy |
| `sm` | `14px (0.875rem)` | `20px` | Card headings, button labels (size lg), modal descriptions |
| `base` | `16px (1.0rem)` | `24px` | Modal titles, builder primary headers |
| `lg` | `18px (1.125rem)` | `28px` | Section headers in expansive layouts |
| `xl` | `20px (1.25rem)` | `28px` | Document titles in preview viewport |
| `2xl` | `24px (1.5rem)` | `32px` | Primary marketing or hero headlines |

---

## 5. Border Radii and Corner Shaping

Radii establish visual hierarchy and friendly, tactile ergonomics:

| Token | Pixels | Target Element |
| :--- | :--- | :--- |
| `rounded-lg` | `8px` | Small buttons, tooltips, keyboard badges, input sm |
| `rounded-xl` | `12px` | Standard buttons, form inputs, textarea, tab items |
| `rounded-2xl` | `16px` | Section cards, modal dialogs, empty states, dropdowns |
| `rounded-3xl` | `24px` | Floating dockable toolbar, bottom drawer sheet top |
| `rounded-full`| `9999px` | Segmented controls, status badges, avatar icons, pill buttons |

---

## 6. Depth and Elevation

Shadows provide natural separation without harsh border outlines:

| Token | Definition | Usage |
| :--- | :--- | :--- |
| `shadow-2xs` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, segmented controls, static cards |
| `shadow-xs` | `0 1px 3px rgba(0,0,0,0.1)` | Active tab buttons, primary button defaults |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Highlighted synchronized section cards, hover cards |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Dropdown menus, modal dialogs |
| `shadow-2xl` | `0 25px 50px rgba(0,0,0,0.25)` | Dockable floating toolbar, slide-out drawer panels |

---

## 7. Accessibility and Focus Conventions

All Bibliotheca components are audited against WCAG 2.1 AA requirements:
- Keyboard Trapping and Dismissal: Modals, Drawers, and DropdownMenus bind Escape to close, and return focus to the trigger on exit.
- WAI-ARIA Semantics:
  - Tabs and SegmentedControl use `role="tablist"`, `role="tab"`, `aria-selected`, and arrow-key navigation (Left/Right/Home/End).
  - Switch uses `role="switch"`, `aria-checked`, and toggles via Space/Enter.
  - Buttons and Inputs include `aria-busy`, `aria-invalid`, `aria-describedby` when errors or loaders are present.
- High-Visibility Focus Rings: Every interactive element features `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)] focus-visible:ring-offset-2`.
- Color Independence: Status states (success, warning, error) pair color with distinct icons (`CheckCircle2`, `AlertCircle`, `Info`) so meaning is never communicated solely by hue.
