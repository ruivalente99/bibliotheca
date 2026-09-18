import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BentoGrid, BentoCard } from "./BentoGrid";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Sparkles, Terminal, Code, Cpu } from "lucide-react";

const meta: Meta<typeof BentoGrid> = {
  title: "UI/BentoGrid",
  component: BentoGrid,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof BentoGrid>;

export const Default: Story = {
  render: () => (
    <BentoGrid cols={4} gap="md">
      <BentoCard
        colSpan={3}
        icon={<Sparkles className="w-5 h-5" />}
        title="Featured Project"
        description="Next-generation document engine with high-DPI rendering"
        badge={<Badge variant="brand">Featured</Badge>}
        hoverable
      >
        <p className="text-sm text-stone-600 dark:text-[#8b949e]">
          Unified component library and design system for responsive documents.
        </p>
      </BentoCard>

      <BentoCard
        colSpan={1}
        icon={<Cpu className="w-5 h-5" />}
        title="Metrics"
        description="Real-time telemetry"
        variant="subtle"
        hoverable
      >
        <div className="text-2xl font-mono font-bold text-[var(--brand)]">99.8%</div>
      </BentoCard>

      <BentoCard
        colSpan={2}
        icon={<Code className="w-5 h-5" />}
        title="Architecture"
        description="Zero-runtime CSS variables"
        hoverable
      >
        <p className="text-xs text-stone-500 dark:text-[#8b949e]">
          Built with React 19 and Tailwind CSS v4.
        </p>
      </BentoCard>

      <BentoCard
        colSpan={2}
        icon={<Terminal className="w-5 h-5" />}
        title="Terminal Core"
        description="Embedded interactive console"
        footer={<Button size="sm" variant="outline">Launch</Button>}
        hoverable
      >
        <p className="text-xs text-stone-500 dark:text-[#8b949e]">
          Execute commands directly in the document canvas.
        </p>
      </BentoCard>
    </BentoGrid>
  ),
};
