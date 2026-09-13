import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "Professional Executive Summary",
    placeholder: "Summarize your architectural experience, leadership impact, and technical accomplishments...",
    helperText: "Keep it under 3-4 concise sentences for optimal ATS parsing.",
    rows: 4,
    className: "w-96",
  },
};

export const AutoResizeWithCharacterLimit: Story = {
  args: {
    label: "Cover Letter Body Paragraph",
    defaultValue: "I am writing to express my strong enthusiasm for the Staff Platform Engineer role...",
    autoResize: true,
    maxLength: 300,
    showCount: true,
    className: "w-96",
  },
};
