"use client";

import React from "react";
import { cn } from "./utils";
import type { AccentColor } from "../tokens";

export interface ProjectPreviewTag {
  label: string;
  accent?: AccentColor;
  className?: string;
}

export interface ProjectPreviewClassNames {
  root?: string;
  glow?: string;
  grid?: string;
  window?: string;
  header?: string;
  windowControls?: string;
  windowTitle?: string;
  content?: string;
  info?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: string;
  tag?: string;
  previewPane?: string;
  actions?: string;
}

export interface ProjectPreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Project, system, or artifact title */
  title?: React.ReactNode;
  /** Category, architecture role, or badge headline */
  subtitle?: React.ReactNode;
  /** Concise descriptive summary */
  description?: React.ReactNode;
  /** Tech stack tags or feature chips */
  tags?: Array<string | ProjectPreviewTag>;
  /** Window bar title or package identifier. Default: "preview" */
  windowTitle?: string;
  /** Whether to show macOS style traffic light window controls. Default: true */
  showWindowControls?: boolean;
  /** One of the 7 signature Bibliotheca accent themes. Default: "amber" */
  accent?: AccentColor;
  /** Visual background canvas pattern. Default: "dots" */
  gridPattern?: "dots" | "lines" | "none";
  /** Right-hand or main visual preview slot */
  preview?: React.ReactNode;
  /** Action buttons slot (e.g., links, source code, demo) */
  actions?: React.ReactNode;
  /** Aspect ratio container style. Default: "16/9" */
  aspectRatio?: "16/9" | "4/3" | "auto";
  /** Granular slot styling classes */
  classNames?: ProjectPreviewClassNames;
}

const ACCENT_GLOW_STYLES: Record<AccentColor, { glow: string; text: string; border: string; bgSoft: string; badgeText: string }> = {
  amber: {
    glow: "radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.28) 0%, transparent 65%)",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    bgSoft: "bg-amber-500/10",
    badgeText: "text-amber-700 dark:text-amber-300",
  },
  teal: {
    glow: "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.28) 0%, transparent 65%)",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    bgSoft: "bg-teal-500/10",
    badgeText: "text-teal-700 dark:text-teal-300",
  },
  blue: {
    glow: "radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.28) 0%, transparent 65%)",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    bgSoft: "bg-sky-500/10",
    badgeText: "text-sky-700 dark:text-sky-300",
  },
  navy: {
    glow: "radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.28) 0%, transparent 65%)",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    bgSoft: "bg-blue-500/10",
    badgeText: "text-blue-700 dark:text-blue-300",
  },
  emerald: {
    glow: "radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.28) 0%, transparent 65%)",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    bgSoft: "bg-emerald-500/10",
    badgeText: "text-emerald-700 dark:text-emerald-300",
  },
  rose: {
    glow: "radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.28) 0%, transparent 65%)",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
    bgSoft: "bg-rose-500/10",
    badgeText: "text-rose-700 dark:text-rose-300",
  },
  slate: {
    glow: "radial-gradient(circle at 80% 20%, rgba(148, 163, 184, 0.25) 0%, transparent 65%)",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
    bgSoft: "bg-slate-500/10",
    badgeText: "text-slate-700 dark:text-slate-300",
  },
};

export const ProjectPreview = React.forwardRef<HTMLDivElement, ProjectPreviewProps>(
  (
    {
      title,
      subtitle,
      description,
      tags = [],
      windowTitle = "preview",
      showWindowControls = true,
      accent = "amber",
      gridPattern = "dots",
      preview,
      actions,
      aspectRatio = "16/9",
      classNames = {},
      className,
      children,
      ...props
    },
    ref
  ) => {
    const accentStyle = ACCENT_GLOW_STYLES[accent] || ACCENT_GLOW_STYLES.amber;

    const ratioClass =
      aspectRatio === "16/9"
        ? "aspect-[16/9]"
        : aspectRatio === "4/3"
        ? "aspect-[4/3]"
        : "aspect-auto";

    return (
      <article
        ref={ref}
        role="region"
        aria-label={typeof title === "string" ? `${title} project preview` : "project preview"}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-stone-950 text-stone-100 shadow-xl border border-stone-800/80 select-none",
          ratioClass,
          classNames.root,
          className
        )}
        {...props}
      >
        {/* Atmospheric Accent Glow */}
        <div
          className={cn("pointer-events-none absolute inset-0 transition-opacity duration-300", classNames.glow)}
          style={{ background: accentStyle.glow }}
          aria-hidden="true"
        />

        {/* Background Grid Pattern */}
        {gridPattern === "dots" && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]",
              classNames.grid
            )}
            aria-hidden="true"
          />
        )}
        {gridPattern === "lines" && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:32px_32px]",
              classNames.grid
            )}
            aria-hidden="true"
          />
        )}

        {/* Centered macOS Window Frame */}
        <div className="absolute inset-4 sm:inset-6 md:inset-8 flex flex-col">
          <div
            className={cn(
              "relative flex-1 flex flex-col rounded-xl overflow-hidden bg-stone-900/90 backdrop-blur-md border border-stone-700/60 shadow-2xl",
              classNames.window
            )}
          >
            {/* Window Header Bar */}
            <header
              className={cn(
                "h-10 px-4 flex items-center justify-between border-b border-stone-800 bg-stone-900/95 shrink-0",
                classNames.header
              )}
            >
              <div className="flex items-center gap-3">
                {showWindowControls && (
                  <div className={cn("flex items-center gap-1.5", classNames.windowControls)} aria-hidden="true">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-2xs inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-2xs inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-2xs inline-block" />
                  </div>
                )}
                <span
                  className={cn(
                    "text-xs font-mono text-stone-400 font-medium truncate max-w-[240px] sm:max-w-[360px]",
                    classNames.windowTitle
                  )}
                >
                  {windowTitle}
                </span>
              </div>

              {actions && (
                <div className={cn("flex items-center gap-2", classNames.actions)}>
                  {actions}
                </div>
              )}
            </header>

            {/* Window Content Body */}
            <div
              className={cn(
                "flex-1 p-5 sm:p-6 overflow-hidden flex flex-col md:flex-row gap-6 items-stretch",
                classNames.content
              )}
            >
              {/* Left Column: Metadata & Details */}
              <div
                className={cn(
                  "flex-1 flex flex-col justify-between min-w-0 space-y-4",
                  classNames.info
                )}
              >
                <div className="space-y-2">
                  {subtitle && (
                    <div
                      className={cn(
                        "text-[11px] font-mono font-semibold tracking-wider uppercase",
                        accentStyle.text,
                        classNames.subtitle
                      )}
                    >
                      {subtitle}
                    </div>
                  )}

                  {title && (
                    <h3
                      className={cn(
                        "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white",
                        classNames.title
                      )}
                    >
                      {title}
                    </h3>
                  )}

                  {description && (
                    <p
                      className={cn(
                        "text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl",
                        classNames.description
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>

                {/* Tech Stack / Skill Tags */}
                {tags && tags.length > 0 && (
                  <div
                    className={cn("flex flex-wrap gap-1.5 pt-2", classNames.tags)}
                    aria-label="technologies and features"
                  >
                    {tags.map((tag, index) => {
                      const isObj = typeof tag === "object" && tag !== null;
                      const label = isObj ? tag.label : tag;
                      const tagAccent = isObj && tag.accent ? ACCENT_GLOW_STYLES[tag.accent] : accentStyle;
                      const customClass = isObj ? tag.className : undefined;

                      return (
                        <span
                          key={index}
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border transition-colors",
                            tagAccent.bgSoft,
                            tagAccent.border,
                            tagAccent.badgeText,
                            classNames.tag,
                            customClass
                          )}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Preview Slot or Custom Children */}
              {(preview || children) && (
                <div
                  className={cn(
                    "flex-1 min-w-0 flex items-center justify-center rounded-xl bg-stone-950/70 border border-stone-800/80 p-3 sm:p-4 overflow-hidden shadow-inner",
                    classNames.previewPane
                  )}
                >
                  {preview || children}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }
);

ProjectPreview.displayName = "ProjectPreview";

/**
 * Options for generating standalone 16:9 vector SVG previews for projects.
 */
export interface GenerateProjectSvgOptions {
  title: string;
  subtitle: string;
  description: string[];
  tags: Array<{ label: string; color?: string }>;
  accentColor?: string;
  windowTitle?: string;
  codeSnippet?: {
    filename?: string;
    lines: string[];
  };
}

/**
 * Helper function to generate clean, scalable 16:9 standalone SVG markup matching the design system standard.
 */
export function generateProjectPreviewSvg(options: GenerateProjectSvgOptions): string {
  const {
    title,
    subtitle,
    description,
    tags,
    accentColor = "#14b8a6",
    windowTitle = `${title.toLowerCase()} — v1.0.0`,
    codeSnippet,
  } = options;

  const descLines = description
    .slice(0, 2)
    .map((line, idx) => `<text x="0" y="${105 + idx * 20}" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">${escapeXml(line)}</text>`)
    .join("\n      ");

  let tagOffset = 0;
  const tagElements = tags
    .slice(0, 5)
    .map((t) => {
      const width = Math.max(60, t.label.length * 9 + 20);
      const x = tagOffset;
      tagOffset += width + 10;
      const color = t.color || accentColor;

      return `
        <rect x="${x}" width="${width}" height="26" rx="6" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1" />
        <text x="${x + width / 2}" y="17" fill="${color}" font-family="monospace" font-size="11" font-weight="600" text-anchor="middle">${escapeXml(t.label)}</text>`;
    })
    .join("\n");

  const snippetContent = codeSnippet
    ? `
      <!-- Code Editor Mockup Pane -->
      <g transform="translate(520, 60)">
        <rect width="420" height="360" rx="10" fill="#090d16" stroke="#1e293b" stroke-width="1" />
        <rect width="420" height="32" rx="10" fill="#0f172a" />
        <text x="16" y="21" fill="#64748b" font-family="monospace" font-size="11">${escapeXml(codeSnippet.filename || "index.ts")}</text>
        <g transform="translate(16, 52)">
          ${codeSnippet.lines
            .slice(0, 10)
            .map((l, i) => `<text x="0" y="${i * 24}" fill="#94a3b8" font-family="monospace" font-size="11">${escapeXml(l)}</text>`)
            .join("\n          ")}
        </g>
      </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a12" />
      <stop offset="50%" stop-color="#0d1322" />
      <stop offset="100%" stop-color="#080c16" />
    </linearGradient>
    <linearGradient id="accent-glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.32" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
    </linearGradient>
    <pattern id="dot-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${accentColor}" fill-opacity="0.16" />
    </pattern>
  </defs>

  <rect width="1200" height="675" fill="url(#bg-grad)" />
  <rect width="1200" height="675" fill="url(#dot-pattern)" />
  <circle cx="940" cy="200" r="320" fill="url(#accent-glow)" />

  <!-- macOS Window Mockup Frame -->
  <g transform="translate(100, 100)">
    <rect width="1000" height="480" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />
    <rect width="1000" height="44" rx="16" fill="#141e33" />
    <circle cx="28" cy="22" r="5" fill="#f43f5e" opacity="0.8" />
    <circle cx="44" cy="22" r="5" fill="#fbbf24" opacity="0.8" />
    <circle cx="60" cy="22" r="5" fill="#10b981" opacity="0.8" />
    <text x="100" y="27" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" letter-spacing="1">${escapeXml(windowTitle)}</text>

    <!-- Info Column -->
    <g transform="translate(48, 70)">
      <text x="0" y="38" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800">${escapeXml(title)}</text>
      <text x="0" y="66" fill="${accentColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">${escapeXml(subtitle.toUpperCase())}</text>
      ${descLines}

      <!-- Token Chips -->
      <g transform="translate(0, 160)">
        ${tagElements}
      </g>
    </g>

    ${snippetContent}
  </g>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
