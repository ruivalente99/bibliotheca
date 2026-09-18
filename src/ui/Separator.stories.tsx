import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] flex flex-col gap-2">
      <div>Section 1</div>
      <Separator />
      <div>Section 2</div>
      <Separator label="OR" />
      <div>Section 3</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-2 text-sm">
      <span>Dashboard</span>
      <Separator orientation="vertical" />
      <span>Analytics</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  ),
};
