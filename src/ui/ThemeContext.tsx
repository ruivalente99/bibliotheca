"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  /** The currently configured theme mode */
  theme: ThemeMode;
  /** The currently resolved effective theme ('light' or 'dark') */
  resolvedTheme: "light" | "dark";
  /** Explicitly set the theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Toggle between light and dark modes */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** LocalStorage key for persisting theme selection. Default: 'bibliotheca_theme_mode' */
  storageKey?: string;
  /** Initial fallback theme mode. Default: 'system' */
  defaultTheme?: ThemeMode;
}

function applyThemeToDom(target: "light" | "dark") {
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
}

export function ThemeProvider({
  children,
  storageKey = "bibliotheca_theme_mode",
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Initialize from localStorage or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey) as ThemeMode | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
        setThemeState(saved);
      } else {
        setThemeState(defaultTheme);
      }
    } catch {
      setThemeState(defaultTheme);
    }
  }, [storageKey, defaultTheme]);

  // Synchronize active mode and DOM
  useEffect(() => {
    if (typeof window === "undefined") return;

    let target: "light" | "dark";
    if (theme === "system") {
      target = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      target = theme;
    }

    setResolvedTheme(target);
    applyThemeToDom(target);

    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Storage unavailable or blocked
    }
  }, [theme, storageKey]);

  // Listen to OS-level system dark/light changes when in system mode
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      const target = e.matches ? "dark" : "light";
      setResolvedTheme(target);
      applyThemeToDom(target);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

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

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider from @valentium/bibliotheca/ui");
  }
  return context;
}
