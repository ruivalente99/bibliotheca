import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "./Button";
import { MoreHorizontal, Copy, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const meta: Meta<typeof DropdownMenu> = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <div className="p-12">
      <DropdownMenu
        trigger={
          <Button variant="secondary" size="icon" aria-label="Item Options">
            <MoreHorizontal size={14} />
          </Button>
        }
        items={[
          { id: "up", label: "Move Up", icon: ArrowUp, shortcut: "Alt+U" },
          { id: "down", label: "Move Down", icon: ArrowDown, shortcut: "Alt+D" },
          { id: "duplicate", label: "Duplicate Entry", icon: Copy, shortcut: "Ctrl+D" },
          { id: "div1", label: "", divider: true },
          { id: "delete", label: "Delete Item", icon: Trash2, destructive: true },
        ]}
      />
    </div>
  ),
};
