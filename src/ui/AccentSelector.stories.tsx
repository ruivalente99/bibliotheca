import type { Meta, StoryObj } from "@storybook/react";
import { AccentSelector } from "./AccentSelector";

const meta: Meta<typeof AccentSelector> = {
  title: "UI/AccentSelector",
  component: AccentSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccentSelector>;

export const SwatchesRow: Story = {
  args: {
    variant: "swatches",
    size: "md",
  },
};

export const SmallSwatches: Story = {
  args: {
    variant: "swatches",
    size: "sm",
  },
};

export const LargeSwatches: Story = {
  args: {
    variant: "swatches",
    size: "lg",
  },
};

export const DropdownVariant: Story = {
  args: {
    variant: "dropdown",
  },
};
