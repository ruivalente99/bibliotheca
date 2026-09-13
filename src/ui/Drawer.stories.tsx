import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "./Button";
import { AccentSelector } from "./AccentSelector";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightInspector: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Inspector Drawer
        </Button>

        <Drawer
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="right"
          size="md"
          title="Document Inspector"
          description="Customize typography, grid system and accent palette."
          footer={
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-[#c9d1d9]">
                Accent Palette
              </label>
              <AccentSelector variant="swatches" size="md" />
            </div>
            <div className="p-3 bg-stone-50 dark:bg-[#0d1117] rounded-xl border border-stone-200 dark:border-[#30363d] text-xs text-stone-600 dark:text-[#8b949e]">
              Tokens automatically synchronize with all active editor panes and canvas elements.
            </div>
          </div>
        </Drawer>
      </div>
    );
  },
};
