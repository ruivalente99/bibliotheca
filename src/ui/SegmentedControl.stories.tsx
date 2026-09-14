import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";
import { Sliders, Scissors, Sparkles, Type, Layers } from "lucide-react";

const meta: Meta<typeof SegmentedControl> = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const EditorTabs: Story = {
  render: () => {
    const [tab, setTab] = useState("settings");

    return (
      <SegmentedControl
        value={tab}
        onChange={setTab}
        items={[
          { id: "settings", label: "Settings", icon: Sliders },
          { id: "canvas", label: "Canvas", icon: Scissors },
          { id: "border", label: "Border", icon: Sparkles },
          { id: "typography", label: "Typography", icon: Type },
          { id: "layers", label: "Layers", icon: Layers, badge: 12 },
        ]}
      />
    );
  },
};

export const MobileModeSwitcher: Story = {
  render: () => {
    const [mode, setMode] = useState("edit");

    return (
      <SegmentedControl
        size="sm"
        value={mode}
        onChange={setMode}
        items={[
          { id: "edit", label: "Edit Form" },
          { id: "preview", label: "Preview A4" },
        ]}
      />
    );
  },
};
