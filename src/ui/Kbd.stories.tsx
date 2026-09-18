import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Kbd } from "./Kbd";

const meta: Meta<typeof Kbd> = {
  title: "UI/Kbd",
  component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: {
    keys: ["mod", "k"],
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Kbd variant="default" keys={["mod", "k"]} />
      <Kbd variant="outline" keys={["shift", "enter"]} />
      <Kbd variant="subtle" keys={["esc"]} />
      <Kbd size="md" keys={["ctrl", "alt", "del"]} />
    </div>
  ),
};
