import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar, AvatarGroup } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: "Rui Valente",
    size: "lg",
    status: "online",
  },
};

export const SizesAndShapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar name="Rui Valente" size="xs" />
        <Avatar name="Rui Valente" size="sm" />
        <Avatar name="Rui Valente" size="md" status="online" />
        <Avatar name="Rui Valente" size="lg" status="busy" />
        <Avatar name="Rui Valente" size="xl" status="away" />
      </div>
      <div className="flex items-center gap-3">
        <Avatar name="Rui Valente" shape="circle" size="lg" />
        <Avatar name="Rui Valente" shape="rounded" size="lg" />
        <Avatar name="Rui Valente" shape="square" size="lg" />
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3} size="md">
      <Avatar name="Alice Walker" />
      <Avatar name="Bob Vance" />
      <Avatar name="Charlie Chaplin" />
      <Avatar name="David Gilmour" />
      <Avatar name="Eva Green" />
    </AvatarGroup>
  ),
};
