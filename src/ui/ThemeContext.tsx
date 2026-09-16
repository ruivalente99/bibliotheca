"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type AccentColor, type ThemeMode } from "../tokens";

export type { ThemeMode, AccentColor };

export interface ThemeContextType {
  /** The currently configured theme mode */
  theme: ThemeMode;
  /** The currently resolved effective theme ('light' or 'dark') */
  resolvedTheme: "light" | "dark";
  /** Explicitly set the theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Toggle between light and dark modes */
  toggleTheme: () => void;
  /** The currently active color accent */
  accent: AccentColor;
  /** Explicitly set the color accent */
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** LocalStorage key for persisting theme mode. Default: 'bibliotheca_theme_mode' */
  storageKey?: string;
  /** Initial fallback theme mode. Default: 'system' */
  defaultTheme?: ThemeMode;
  /** LocalStorage key for persisting accent color. Default: 'bibliotheca_theme_accent' */
  storageKeyAccent?: string;
  /** Initial fallback color accent. Default: 'amber' */
  defaultAccent?: AccentColor;
}

function applyThemeToDom(target: "light" | "dark", accent: AccentColor) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;

  if (target === "dark") {
    root.classList.add("dark");
    if (body) body.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    if (body) body.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }

  root.setAttribute("data-accent", accent);
  if (body) body.setAttribute("data-accent", accent);
}

export function ThemeProvider({
  children,
  storageKey = "bibliotheca_theme_mode",
  defaultTheme = "system",
  storageKeyAccent = "bibliotheca_theme_accent",
  defaultAccent = "amber",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [accent, setAccentState] = useState<AccentColor>(defaultAccent);

  // Initialize theme mode and accent from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as ThemeMode | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setThemeState(savedTheme);
      } else {
        setThemeState(defaultTheme);
      }
    } catch {
      setThemeState(defaultTheme);
    }

    try {
      const savedAccent = localStorage.getItem(storageKeyAccent) as AccentColor | null;
      if (
        savedAccent &&
        (savedAccent === "amber" ||
          savedAccent === "teal" ||
          savedAccent === "blue" ||
          savedAccent === "navy" ||
          savedAccent === "emerald" ||
          savedAccent === "rose" ||
          savedAccent === "slate")
      ) {
        setAccentState(savedAccent);
      } else {
        setAccentState(defaultAccent);
      }
    } catch {
      setAccentState(defaultAccent);
    }
  }, [storageKey, defaultTheme, storageKeyAccent, defaultAccent]);

  // Synchronize active mode, accent and DOM
  useEffect(() => {
    if (typeof window === "undefined") return;

    let target: "light" | "dark";
    if (theme === "system") {
      target = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      target = theme;
    }

    setResolvedTheme(target);
    applyThemeToDom(target, accent);

    try {
      localStorage.setItem(storageKey, theme);
      localStorage.setItem(storageKeyAccent, accent);
    } catch {
      // Storage unavailable or blocked
    }
  }, [theme, accent, storageKey, storageKeyAccent]);

  // Listen to OS-level system dark/light changes when in system mode
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      const target = e.matches ? "dark" : "light";
      setResolvedTheme(target);
      applyThemeToDom(target, accent);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme, accent]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const currentEffective =
        prev === "system"
          ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : prev;
      return currentEffective === "dark" ? "light" : "dark";
    });
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        accent,
        setAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useOptionalTheme(): ThemeContextType | undefined {
  return useContext(ThemeContext);
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider from @ruivalente99/bibliotheca/ui");
  }
  return context;
}
