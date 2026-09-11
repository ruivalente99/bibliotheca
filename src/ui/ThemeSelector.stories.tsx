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

export const CustomLabels: Story = {
  args: {
    variant: "dropdown",
    labels: {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
    },
  },
};
