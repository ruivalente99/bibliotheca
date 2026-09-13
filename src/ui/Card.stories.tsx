import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Document Settings</CardTitle>
          <Badge variant="brand">A4 Standard</Badge>
        </div>
        <CardDescription>Configure page margins, grid alignment, and typography.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-stone-600 dark:text-[#c9d1d9] space-y-2">
          <p>Strict dimensions: 794px by 1123px at 96 DPI.</p>
          <p>Export modes: Vector PDF, PNG raster, and JSON backup.</p>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="ghost" size="sm">Reset</Button>
        <Button variant="primary" size="sm">Apply Changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card className="w-80" hoverable interactive>
      <CardHeader>
        <CardTitle>Interactive Template</CardTitle>
        <CardDescription>Click to select this document layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-24 bg-stone-100 dark:bg-[#0d1117] rounded-xl flex items-center justify-center text-xs font-mono text-stone-400">
          Layout Blueprint
        </div>
      </CardContent>
    </Card>
  ),
};
