import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Input } from "./Input";
import { Mail, Search } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Full Name",
    placeholder: "e.g. Jane Doe",
    helperText: "Your official name as shown on passport or credentials.",
    className: "w-80",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Email Address",
    placeholder: "jane@example.com",
    iconLeft: <Mail size={14} />,
    className: "w-80",
  },
};

export const SearchField: Story = {
  args: {
    placeholder: "Search components, templates or tokens...",
    iconLeft: <Search size={14} />,
    clearable: true,
    value: "SplitEditorLayout",
    className: "w-80",
  },
};

export const WithError: Story = {
  args: {
    label: "Document Identifier",
    value: "invalid id #",
    error: "Identifier must only contain lowercase alphanumeric characters and hyphens.",
    className: "w-80",
  },
};
