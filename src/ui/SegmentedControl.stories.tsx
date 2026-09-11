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
    const [tab, setTab] = useState("editor");

    return (
      <SegmentedControl
        value={tab}
        onChange={setTab}
        items={[
          { id: "editor", label: "Ajustes", icon: Sliders },
          { id: "background", label: "Fundo", icon: Scissors },
          { id: "border", label: "Contorno", icon: Sparkles },
          { id: "text", label: "Texto", icon: Type },
          { id: "tray", label: "Galeria", icon: Layers, badge: 12 },
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
          { id: "edit", label: "Editar Formulário" },
          { id: "preview", label: "Pré-visualizar A4" },
        ]}
      />
    );
  },
};
