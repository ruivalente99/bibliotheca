import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="experience" className="w-96">
      <TabsList>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>
      <TabsContent value="experience">
        <Card variant="subtle">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-stone-600 dark:text-[#c9d1d9]">
            3 verified professional positions listed in chronology.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="education">
        <Card variant="subtle">
          <CardHeader>
            <CardTitle>Academic Credentials</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-stone-600 dark:text-[#c9d1d9]">
            M.Sc. in Computer Science and Engineering.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="skills">
        <Card variant="subtle">
          <CardHeader>
            <CardTitle>Technical Competencies</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-stone-600 dark:text-[#c9d1d9]">
            TypeScript, React 19, Next.js, Tailwind CSS v4.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
