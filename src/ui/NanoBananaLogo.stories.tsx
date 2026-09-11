import type { Meta, StoryObj } from "@storybook/react";
import { NanoBananaLogo } from "./NanoBananaLogo";

const meta: Meta<typeof NanoBananaLogo> = {
  title: "UI/NanoBananaLogo",
  component: NanoBananaLogo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Size of the logo",
    },
    glow: {
      control: "boolean",
      description: "Amber glow shadow effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NanoBananaLogo>;

export const Default: Story = {
  args: {
    size: "md",
    glow: false,
  },
};

export const Glowing: Story = {
  args: {
    size: "lg",
    glow: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-8 bg-stone-100 dark:bg-[#161b22] rounded-3xl border border-stone-200 dark:border-[#30363d]">
      <div className="flex flex-col items-center gap-2">
        <NanoBananaLogo size="sm" />
        <span className="text-[10px] font-mono text-stone-500">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NanoBananaLogo size="md" />
        <span className="text-[10px] font-mono text-stone-500">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NanoBananaLogo size="lg" glow />
        <span className="text-[10px] font-mono text-stone-500">LG (Glow)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <NanoBananaLogo size="xl" glow />
        <span className="text-[10px] font-mono text-stone-500">XL (Glow)</span>
      </div>
    </div>
  ),
};
