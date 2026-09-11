import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BuilderHeader } from "./BuilderHeader";
import { Button } from "../ui/Button";
import { FileJson, Download } from "lucide-react";

const meta: Meta<typeof BuilderHeader> = {
  title: "Editor/BuilderHeader",
  component: BuilderHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BuilderHeader>;

export const PapyrusResume: Story = {
  args: {
    title: "Papyrus — Architectura Vitae",
    subtitle: "CURRICULUM VITAE & PROFILES",
    statusText: "Auto-saved",
    actions: (
      <>
        <Button variant="pill" size="sm" iconLeft={<FileJson size={13} />}>
          JSON
        </Button>
        <Button variant="primary" size="sm" iconLeft={<Download size={13} />}>
          Exportar
        </Button>
      </>
    ),
  },
};

export const SappientusLegalActa: Story = {
  args: {
    title: "Acta Conventus",
    subtitle: "VERBA VOLANT, SCRIPTA MANENT",
    statusText: "Rascunho",
    actions: (
      <Button variant="pill" size="sm" iconLeft={<FileJson size={13} />}>
        JSON Import/Export
      </Button>
    ),
  },
};
