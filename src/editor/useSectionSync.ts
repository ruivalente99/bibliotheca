"use client";

import { useState, useCallback, useRef } from "react";

export interface UseSectionSyncOptions {
  /** CSS selector for the scrollable form container. Default: '.builder-form-pane' */
  containerSelector?: string;
  /** HTML ID prefix for section elements. Default: 'section-' */
  idPrefix?: string;
  /** Duration in milliseconds to maintain the highlight pulse. Default: 2500 */
  highlightDurationMs?: number;
  /** Optional callback fired when a section is triggered */
  onSelect?: (sectionId: string) => void;
}

export interface UseSectionSyncReturn {
  /** Currently active highlighted section ID, or null */
  highlightedSectionId: string | null;
  /** Smoothly scrolls to section, focuses input, and triggers highlight pulse */
  handleSelectSection: (sectionId: string) => void;
  /** Immediately cancels current highlight state */
  clearHighlight: () => void;
}

export function useSectionSync({
  containerSelector = ".builder-form-pane",
  idPrefix = "section-",
  highlightDurationMs = 2500,
  onSelect,
}: UseSectionSyncOptions = {}): UseSectionSyncReturn {
  const [highlightedSectionId, setHighlightedSectionId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearHighlight = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHighlightedSectionId(null);
  }, []);

  const handleSelectSection = useCallback(
    (sectionId: string) => {
      setHighlightedSectionId(sectionId);
      onSelect?.(sectionId);

      const targetId = `${idPrefix}${sectionId}`;
      const element = document.getElementById(targetId);
      const container = document.querySelector(containerSelector);

      if (element) {
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elemRect = element.getBoundingClientRect();
          const currentScroll = container.scrollTop;
          const targetScroll = currentScroll + (elemRect.top - containerRect.top) - 16;
          container.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "smooth",
          });
        } else {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        element.focus?.({ preventScroll: true });

        // Auto-focus the first editable input or textarea inside the section
        setTimeout(() => {
          const focusable = element.querySelector<HTMLElement>(
            "input:not([disabled]):not([type='hidden']):not([type='file']), textarea:not([disabled])"
          );
          if (focusable) {
            focusable.focus?.({ preventScroll: true });
          }
        }, 120);
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setHighlightedSectionId((curr) => (curr === sectionId ? null : curr));
      }, highlightDurationMs);
    },
    [containerSelector, idPrefix, highlightDurationMs, onSelect]
  );

  return {
    highlightedSectionId,
    handleSelectSection,
    clearHighlight,
  };
}
