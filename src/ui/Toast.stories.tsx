import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useToast } from "./ToastContext";
import { Button } from "./Button";

function ToastDemo() {
  const { showToast, confirmAction } = useToast();

  const handleConfirm = async () => {
    const ok = await confirmAction({
      title: "Delete Document?",
      message: "This action cannot be undone and will permanently remove all sections.",
      confirmText: "Yes, delete",
      cancelText: "Go back",
      danger: true,
    });

    if (ok) {
      showToast("Document deleted successfully.", "error");
    } else {
      showToast("Action cancelled by user.", "info");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md p-6 bg-white dark:bg-[#161b22] rounded-3xl border border-stone-200 dark:border-[#30363d] shadow-xl">
      <h3 className="text-sm font-bold text-stone-800 dark:text-[#f0f3f6]">
        Interactive Notification Dispatcher
      </h3>
      <p className="text-xs text-stone-500 dark:text-[#8b949e]">
        Test floating toast alerts and the asynchronous confirmation dialog with Escape key dismissal.
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="secondary"
          onClick={() => showToast("Changes saved automatically.", "success")}
        >
          Success Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast("Failed to compile document to vector PDF.", "error")}
        >
          Error Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast("New version of profile loaded.", "info")}
        >
          Info Toast
        </Button>
      </div>

      <div className="pt-2 border-t border-stone-100 dark:border-[#21262d]">
        <Button variant="danger" onClick={handleConfirm} className="w-full">
          Open Asynchronous Confirmation
        </Button>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "UI/Toast & ConfirmDialog",
  component: ToastDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDemo />,
};
