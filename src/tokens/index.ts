/**
 * Bibliotheca Design Tokens
 * 
 * Formal design token constants and types defining the visual language of the design system.
 * Strictly adheres to 4px/8px modular scale, WCAG 2.1 AA contrast ratios, and semantic roles.
 */

export type ThemeMode = "light" | "dark" | "system";

export type AccentColor =
  | "amber"
  | "teal"
  | "blue"
  | "navy"
  | "emerald"
  | "rose"
  | "slate";

export interface AccentThemeDefinition {
  id: AccentColor;
  label: string;
  description: string;
  light: {
    brand: string;
    brandHover: string;
    brandLight: string;
    brandSoft: string;
    brandBorder: string;
    brandRing: string;
  };
  dark: {
    brand: string;
    brandHover: string;
    brandLight: string;
    brandSoft: string;
    brandBorder: string;
    brandRing: string;
  };
}

export const ACCENT_THEMES: Record<AccentColor, AccentThemeDefinition> = {
  amber: {
    id: "amber",
    label: "Amber Gold",
    description: "Warm amber and bronze palette, signature editorial default",
    light: {
      brand: "#d97706",
      brandHover: "#b45309",
      brandLight: "#f59e0b",
      brandSoft: "rgba(245, 158, 11, 0.12)",
      brandBorder: "#fcd34d",
      brandRing: "rgba(245, 158, 11, 0.35)",
    },
    dark: {
      brand: "#f59e0b",
      brandHover: "#fbbf24",
      brandLight: "#fde047",
      brandSoft: "rgba(245, 158, 11, 0.18)",
      brandBorder: "rgba(245, 158, 11, 0.4)",
      brandRing: "rgba(245, 158, 11, 0.45)",
    },
  },
  teal: {
    id: "teal",
    label: "Lateralis Teal",
    description: "Deep petroleum and vibrant teal, balanced technical clarity",
    light: {
      brand: "#0f766e",
      brandHover: "#115e59",
      brandLight: "#14b8a6",
      brandSoft: "rgba(20, 184, 166, 0.12)",
      brandBorder: "#5eead4",
      brandRing: "rgba(20, 184, 166, 0.35)",
    },
    dark: {
      brand: "#14b8a6",
      brandHover: "#2dd4bf",
      brandLight: "#5eead4",
      brandSoft: "rgba(20, 184, 166, 0.18)",
      brandBorder: "rgba(20, 184, 166, 0.4)",
      brandRing: "rgba(20, 184, 166, 0.45)",
    },
  },
  blue: {
    id: "blue",
    label: "Classic Royal Blue",
    description: "Crisp engineering blue, optimized for academic and ATS documents",
    light: {
      brand: "#0284c7",
      brandHover: "#0369a1",
      brandLight: "#38bdf8",
      brandSoft: "rgba(56, 189, 248, 0.12)",
      brandBorder: "#7dd3fc",
      brandRing: "rgba(56, 189, 248, 0.35)",
    },
    dark: {
      brand: "#38bdf8",
      brandHover: "#7dd3fc",
      brandLight: "#bae6fd",
      brandSoft: "rgba(56, 189, 248, 0.18)",
      brandBorder: "rgba(56, 189, 248, 0.4)",
      brandRing: "rgba(56, 189, 248, 0.45)",
    },
  },
  navy: {
    id: "navy",
    label: "Executive Navy",
    description: "Deep structured corporate navy for executive documents and portfolios",
    light: {
      brand: "#1e3a8a",
      brandHover: "#172554",
      brandLight: "#3b82f6",
      brandSoft: "rgba(59, 130, 246, 0.12)",
      brandBorder: "#93c5fd",
      brandRing: "rgba(59, 130, 246, 0.35)",
    },
    dark: {
      brand: "#60a5fa",
      brandHover: "#93c5fd",
      brandLight: "#bfdbfe",
      brandSoft: "rgba(96, 165, 250, 0.18)",
      brandBorder: "rgba(96, 165, 250, 0.4)",
      brandRing: "rgba(96, 165, 250, 0.45)",
    },
  },
  emerald: {
    id: "emerald",
    label: "Forest Emerald",
    description: "Natural organic emerald green, conveying growth and sustainability",
    light: {
      brand: "#059669",
      brandHover: "#047857",
      brandLight: "#10b981",
      brandSoft: "rgba(16, 185, 129, 0.12)",
      brandBorder: "#6ee7b7",
      brandRing: "rgba(16, 185, 129, 0.35)",
    },
    dark: {
      brand: "#10b981",
      brandHover: "#34d399",
      brandLight: "#6ee7b7",
      brandSoft: "rgba(16, 185, 129, 0.18)",
      brandBorder: "rgba(16, 185, 129, 0.4)",
      brandRing: "rgba(16, 185, 129, 0.45)",
    },
  },
  rose: {
    id: "rose",
    label: "Burgundy Rose",
    description: "Warm terracotta and vibrant burgundy for expressive creative applications",
    light: {
      brand: "#e11d48",
      brandHover: "#be123c",
      brandLight: "#f43f5e",
      brandSoft: "rgba(244, 63, 94, 0.12)",
      brandBorder: "#fda4af",
      brandRing: "rgba(244, 63, 94, 0.35)",
    },
    dark: {
      brand: "#fb7185",
      brandHover: "#fda4af",
      brandLight: "#fecdd3",
      brandSoft: "rgba(251, 113, 133, 0.18)",
      brandBorder: "rgba(251, 113, 133, 0.4)",
      brandRing: "rgba(251, 113, 133, 0.45)",
    },
  },
  slate: {
    id: "slate",
    label: "Obsidian Slate",
    description: "High-contrast monochrome neutral slate for technical minimalism",
    light: {
      brand: "#475569",
      brandHover: "#334155",
      brandLight: "#64748b",
      brandSoft: "rgba(100, 116, 139, 0.12)",
      brandBorder: "#cbd5e1",
      brandRing: "rgba(100, 116, 139, 0.35)",
    },
    dark: {
      brand: "#94a3b8",
      brandHover: "#cbd5e1",
      brandLight: "#e2e8f0",
      brandSoft: "rgba(148, 163, 184, 0.18)",
      brandBorder: "rgba(148, 163, 184, 0.4)",
      brandRing: "rgba(148, 163, 184, 0.45)",
    },
  },
};

export const ACCENT_LIST = Object.values(ACCENT_THEMES);

export const SPACING_TOKENS = {
  0: "0px",
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
} as const;

export const RADIUS_TOKENS = {
  none: "0px",
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const SHADOW_TOKENS = {
  none: "none",
  "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  xs: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  sm: "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
} as const;
