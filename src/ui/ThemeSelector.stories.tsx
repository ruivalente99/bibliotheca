import type { Meta, StoryObj } from "@storybook/react";
import { ThemeSelector } from "./ThemeSelector";

const meta: Meta<typeof ThemeSelector> = {
  title: "UI/ThemeSelector",
  component: ThemeSelector,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["dropdown", "toggle"],
    },
    showAccentPicker: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeSelector>;

export const Dropdown: Story = {
  args: {
    variant: "dropdown",
  },
};

export const ToggleButton: Story = {
  args: {
    variant: "toggle",
  },
};

export const WithAccentPicker: Story = {
  args: {
    variant: "dropdown",
    showAccentPicker: true,
  },
};

export const CustomLabels: Story = {
  args: {
    variant: "dropdown",
    showAccentPicker: true,
    labels: {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
      accentSection: "Paleta de Cores",
    },
  },
};
