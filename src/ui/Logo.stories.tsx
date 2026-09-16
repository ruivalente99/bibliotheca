import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Logo } from "./Logo";
import { Sparkles, FileText, Code2, Layers } from "lucide-react";

const meta: Meta<typeof Logo> = {
  title: "UI/Logo",
  component: Logo,
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
      description: "Accent glow shadow effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

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

export const WithIcon: Story = {
  args: {
    size: "lg",
    glow: true,
    icon: <Sparkles size={24} />,
    ariaLabel: "AI Assistant",
  },
};

export const WithImageSource: Story = {
  args: {
    size: "lg",
    glow: true,
    src: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/file-text.svg",
    alt: "Document Editor",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-8 bg-stone-100 dark:bg-[#161b22] rounded-3xl border border-stone-200 dark:border-[#30363d]">
      <div className="flex flex-col items-center gap-2">
        <Logo size="sm" icon={<Layers size={14} />} />
        <span className="text-[10px] font-mono text-stone-500">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Logo size="md" icon={<Code2 size={18} />} />
        <span className="text-[10px] font-mono text-stone-500">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Logo size="lg" glow icon={<FileText size={22} />} />
        <span className="text-[10px] font-mono text-stone-500">LG (Glow)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Logo size="xl" glow icon={<Sparkles size={28} />} />
        <span className="text-[10px] font-mono text-stone-500">XL (Glow)</span>
      </div>
    </div>
  ),
};
