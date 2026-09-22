/**
 * Dark Mode Canvas Filter & DOM Preparation
 *
 * Inverts canvas colors for high-contrast dark theme exports while preserving
 * natural hues for photographs, vector QR codes, and media assets tagged with
 * `data-preserve-color="true"`.
 */

export const DARK_CANVAS_BG_DEFAULT = "#0d1117";
export const DARK_CANVAS_STYLE_ID = "bibliotheca-dark-export-styles";

export interface DarkModeFilterOptions {
  /** Background color applied during dark inversion */
  backgroundColor?: string;
  /** Custom CSS class attached to the target root */
  className?: string;
}

/**
 * Prepares a DOM container for dark mode export rasterization.
 * Returns an idempotent cleanup callback that restores original DOM classes and styles.
 */
export function prepareDarkModeElement(
  element: HTMLElement,
  options: DarkModeFilterOptions = {}
): () => void {
  if (typeof document === "undefined" || !element) {
    return () => {};
  }

  const bgColor = options.backgroundColor || DARK_CANVAS_BG_DEFAULT;
  const targetClass = options.className || "bibliotheca-dark-export";

  let styleEl = document.getElementById(DARK_CANVAS_STYLE_ID) as HTMLStyleElement | null;
  let createdStyle = false;

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = DARK_CANVAS_STYLE_ID;
    styleEl.textContent = `
      .${targetClass} {
        filter: invert(0.93) hue-rotate(180deg) !important;
        background-color: ${bgColor} !important;
      }
      .${targetClass} img,
      .${targetClass} video,
      .${targetClass} [data-preserve-color="true"],
      .${targetClass} [data-qr-code="true"],
      .${targetClass} [role="img"] {
        filter: invert(1) hue-rotate(180deg) contrast(1.06) !important;
      }
    `;
    document.head.appendChild(styleEl);
    createdStyle = true;
  }

  element.classList.add(targetClass);

  return () => {
    try {
      element.classList.remove(targetClass);
      if (createdStyle && styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    } catch {
      // Graceful fallback
    }
  };
}
