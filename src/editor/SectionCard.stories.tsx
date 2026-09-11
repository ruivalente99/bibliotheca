import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SectionCard } from "./SectionCard";
import { User, Plus } from "lucide-react";
import { Button } from "../ui/Button";

const meta: Meta<typeof SectionCard> = {
  title: "Editor/SectionCard",
  component: SectionCard,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    highlighted: {
      control: "boolean",
    },
    collapsible: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionCard>;

export const Default: Story = {
  args: {
    id: "section-personal",
    title: "Informações Pessoais",
    icon: <User size={16} />,
    badge: "Obrigatório",
    collapsible: true,
    children: (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 dark:text-[#c9d1d9] mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            className="w-full border border-stone-200 dark:border-[#30363d] rounded-xl px-3 py-2 text-xs bg-stone-50 dark:bg-[#0d1117] text-stone-900 dark:text-[#f0f3f6]"
            placeholder="Ex: Dylan Valente"
            defaultValue="Dylan Valente"
          />
        </div>
      </div>
    ),
  },
};

export const HighlightedByPreview: Story = {
  args: {
    title: "Experiência Profissional",
    highlighted: true,
    badge: 3,
    action: (
      <Button variant="pill" size="sm" iconLeft={<Plus size={12} />}>
        Adicionar
      </Button>
    ),
    children: (
      <p className="text-xs text-stone-600 dark:text-[#8b949e]">
        Esta secção está com o anel de destaque amber pulsante ativo, acionado após clique na folha de preview!
      </p>
    ),
  },
};
