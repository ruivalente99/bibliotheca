import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Download, FileJson, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger", "pill"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Descarregar PDF Oficial",
    iconLeft: <Download size={14} />,
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Exportar JSON",
    iconLeft: <FileJson size={14} />,
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Eliminar Secção",
    iconLeft: <Trash2 size={14} />,
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    children: "A processar...",
    loading: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-white dark:bg-[#161b22] rounded-2xl border border-stone-200 dark:border-[#30363d]">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="pill">Pill Action</Button>
      <Button variant="primary" loading>
        Loading
      </Button>
    </div>
  ),
};
