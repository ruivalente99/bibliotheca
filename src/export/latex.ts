/**
 * LaTeX Export Utilities
 *
 * Provides business-agnostic helpers for generating, escaping, and exporting
 * compilable LaTeX documents.
 */

export interface LatexPreambleOptions {
  /** Document class, e.g. 'article', 'report'. Default: 'article' */
  documentClass?: string;
  /** Font size option, e.g. '10pt', '11pt', '12pt'. Default: '10pt' */
  fontSize?: string;
  /** Paper size option, e.g. 'a4paper', 'letterpaper'. Default: 'a4paper' */
  paperSize?: string;
  /** Margin definition for geometry package, e.g. '1.5cm' or 'top=2cm,bottom=2cm'. Default: '1.5cm' */
  margins?: string;
  /** Babel language definition, e.g. 'portuguese', 'english'. Default: 'english' */
  language?: string;
  /** Additional LaTeX packages to include */
  packages?: string[];
  /** Extra preamble directives, macros, or style definitions */
  extraPreamble?: string;
}

/**
 * Escapes LaTeX reserved characters in plain text strings.
 */
export function escapeLatex(text: string | undefined | null): string {
  if (!text) return "";
  return text.replace(/[\\&%$#_{}~^]/g, (match) => {
    switch (match) {
      case "\\":
        return "\\textbackslash{}";
      case "&":
        return "\\&";
      case "%":
        return "\\%";
      case "$":
        return "\\$";
      case "#":
        return "\\#";
      case "_":
        return "\\_";
      case "{":
        return "\\{";
      case "}":
        return "\\}";
      case "~":
        return "\\textasciitilde{}";
      case "^":
        return "\\textasciicircum{}";
      default:
        return match;
    }
  });
}

/**
 * Strips unsupported control characters and normalizes whitespace for LaTeX inclusion.
 */
export function sanitizeLatex(text: string | undefined | null): string {
  if (!text) return "";
  // eslint-disable-next-line no-control-regex
  return text
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Builds a standard compilable LaTeX document preamble.
 */
export function buildLatexPreamble(options: LatexPreambleOptions = {}): string {
  const {
    documentClass = "article",
    fontSize = "10pt",
    paperSize = "a4paper",
    margins = "1.5cm",
    language = "english",
    packages = [],
    extraPreamble = "",
  } = options;

  const defaultPackages = [
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage[T1]{fontenc}",
    `\\usepackage[${language}]{babel}`,
    `\\usepackage[margin=${margins}]{geometry}`,
    "\\usepackage{hyperref}",
    "\\usepackage{xcolor}",
    "\\usepackage{enumitem}",
    "\\usepackage{parskip}",
  ];

  const customPackages = packages.map((pkg) =>
    pkg.startsWith("\\usepackage") ? pkg : `\\usepackage{${pkg}}`
  );

  const allPackages = [...defaultPackages, ...customPackages].join("\n");

  let out = `\\documentclass[${fontSize},${paperSize}]{${documentClass}}\n`;
  out += `${allPackages}\n`;

  if (extraPreamble.trim()) {
    out += `\n${extraPreamble.trim()}\n`;
  }

  return out;
}

/**
 * Downloads LaTeX code as a .tex file in browser environments.
 */
export function downloadLatexFile(content: string, filename = "document.tex"): void {
  if (typeof document === "undefined") return;

  const cleanFilename = filename.endsWith(".tex") ? filename : `${filename}.tex`;
  const blob = new Blob([content], { type: "text/x-tex;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cleanFilename;
  a.click();
  URL.revokeObjectURL(url);
}
