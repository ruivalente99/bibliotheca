import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Interactive: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(true);

    return (
      <div className="w-80 p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-stone-200 dark:border-[#30363d]">
        <Switch
          checked={enabled}
          onChange={setEnabled}
          label="Display Photo"
          description="Render circular headshot in sidebar column."
        />
      </div>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);

    return (
      <div className="w-80 p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-stone-200 dark:border-[#30363d]">
        <Switch
          size="sm"
          checked={enabled}
          onChange={setEnabled}
          label="Compact Density"
          description="Tighten line height and item padding for 1-page fit."
        />
      </div>
    );
  },
};
