import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Terminal, TerminalModal, type TerminalCommand } from "./Terminal";
import { Button } from "./Button";

const meta: Meta<typeof Terminal> = {
  title: "UI/Terminal",
  component: Terminal,
};

export default meta;
type Story = StoryObj<typeof Terminal>;

const mockCommands: TerminalCommand[] = [
  {
    name: "status",
    description: "Display editor system status",
    execute: () => "All document pipelines operational (PDF, SVG, HTML).",
  },
  {
    name: "export",
    description: "Export current document canvas",
    subcommands: ["pdf", "png", "json"],
    execute: (args) => {
      const format = args[0] || "pdf";
      return `Triggering document compilation for [${format.toUpperCase()}]... Complete!`;
    },
  },
];

export const Embedded: Story = {
  args: {
    commands: mockCommands,
    title: "document-terminal",
    height: 300,
  },
};

export const InModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Open Terminal Modal</Button>
        <TerminalModal
          isOpen={open}
          onClose={() => setOpen(false)}
          commands={mockCommands}
          title="console"
        />
      </div>
    );
  },
};
