import type { Preview } from "@storybook/react";
import React from "react";
import "../src/styles.css";
import { ThemeProvider } from "../src/ui/ThemeContext";
import { ToastProvider } from "../src/ui/ToastContext";

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
    (Story) => (
      <ThemeProvider defaultTheme="dark">
        <ToastProvider>
          <div className="min-h-screen p-6 bg-[var(--page)] text-[var(--heading)] transition-colors duration-200">
            <Story />
          </div>
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
