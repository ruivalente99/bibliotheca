import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Timeline, TimelineItem } from "./Timeline";
import { Badge } from "./Badge";
import { Briefcase, GraduationCap } from "lucide-react";

const meta: Meta<typeof Timeline> = {
  title: "UI/Timeline",
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md p-6 bg-white dark:bg-[#161b22] rounded-2xl border border-stone-200 dark:border-[#30363d]">
      <Timeline>
        <TimelineItem
          active
          icon={<Briefcase className="w-3 h-3" />}
          title="Lead Frontend Architect"
          subtitle="Acme Labs"
          date="2023 - Present"
          badge={<Badge variant="brand" size="sm">Current</Badge>}
        >
          Architecting design systems, document rendering pipelines, and WebGL canvas components.
        </TimelineItem>

        <TimelineItem
          icon={<Briefcase className="w-3 h-3" />}
          title="Senior Software Engineer"
          subtitle="Tech Corp"
          date="2020 - 2023"
        >
          Led migration from legacy monolith to Next.js and TypeScript micro-frontends.
        </TimelineItem>

        <TimelineItem
          isLast
          icon={<GraduationCap className="w-3 h-3" />}
          title="BSc in Computer Science"
          subtitle="University of Porto"
          date="2016 - 2020"
        />
      </Timeline>
    </div>
  ),
};
