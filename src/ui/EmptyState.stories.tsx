import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";
import { FolderOpen, Plus } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <FolderOpen size={22} />,
    title: "No Experience Items Added",
    description: "Add your career milestones, leadership positions, and key highlights.",
    action: (
      <Button variant="primary" size="sm" iconLeft={<Plus size={14} />}>
        Add First Position
      </Button>
    ),
    className: "w-96",
  },
};

export const PlainVariant: Story = {
  args: {
    variant: "plain",
    icon: <FolderOpen size={22} />,
    title: "No Search Results",
    description: "Try searching with different keywords or clearing active filters.",
    action: (
      <Button variant="secondary" size="sm">
        Clear Filters
      </Button>
    ),
    className: "w-96",
  },
};
