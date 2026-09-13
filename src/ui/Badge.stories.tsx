import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "brand", "secondary", "outline", "success", "warning", "danger"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Standard Badge",
    variant: "default",
  },
};

export const BrandAccent: Story = {
  args: {
    children: "Featured Skill",
    variant: "brand",
  },
};

export const WithDotIndicator: Story = {
  args: {
    children: "Live Status",
    variant: "success",
    dot: true,
  },
};

export const RemovableTag: Story = {
  args: {
    children: "TypeScript",
    variant: "outline",
    removable: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="brand">Brand Accent</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>Success</Badge>
      <Badge variant="warning" dot>Warning</Badge>
      <Badge variant="danger" dot>Danger</Badge>
    </div>
  ),
};
