import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "../src/styles.css";
import { ThemeProvider, type ThemeMode, type AccentColor } from "../src/ui/ThemeContext";
import { ToastProvider } from "../src/ui/ToastContext";

export const globalTypes = {
  theme: {
    name: "Theme Mode",
    description: "Toggle between light and dark theme mode",
    defaultValue: "dark",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", icon: "sun", title: "Light Mode" },
        { value: "dark", icon: "moon", title: "Dark Mode" },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
  accent: {
    name: "Accent Palette",
    description: "Choose signature color accent theme",
    defaultValue: "amber",
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: "amber", title: "Amber Gold" },
        { value: "teal", title: "Lateralis Teal" },
        { value: "blue", title: "Classic Royal Blue" },
        { value: "navy", title: "Executive Navy" },
        { value: "emerald", title: "Forest Emerald" },
        { value: "rose", title: "Burgundy Rose" },
        { value: "slate", title: "Obsidian Slate" },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#f7f7f5" },
        { name: "dark", value: "#0d1117" },
      ],
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) => {
      const mode = (context.globals.theme as ThemeMode) || "dark";
      const accent = (context.globals.accent as AccentColor) || "amber";

      useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        if (mode === "dark") {
          root.classList.add("dark");
          body.classList.add("dark");
          root.setAttribute("data-theme", "dark");
        } else {
          root.classList.remove("dark");
          body.classList.remove("dark");
          root.setAttribute("data-theme", "light");
        }
        root.setAttribute("data-accent", accent);
        body.setAttribute("data-accent", accent);
      }, [mode, accent]);

      return (
        <ThemeProvider defaultTheme={mode} defaultAccent={accent}>
          <ToastProvider>
            <div
              className={`min-h-screen p-6 bg-[var(--page)] text-[var(--heading)] transition-colors duration-200 ${
                mode === "dark" ? "dark" : ""
              }`}
              data-theme={mode}
              data-accent={accent}
            >
              <Story />
            </div>
          </ToastProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
