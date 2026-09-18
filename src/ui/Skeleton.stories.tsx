import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: "100%",
    height: 48,
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-[320px] p-4 border border-stone-200 dark:border-[#30363d] rounded-2xl flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="40%" height={10} />
        </div>
      </div>
      <Skeleton variant="rounded" height={120} />
      <div className="flex gap-2 mt-2">
        <Skeleton variant="rounded" width={80} height={28} />
        <Skeleton variant="rounded" width={80} height={28} />
      </div>
    </div>
  ),
};
