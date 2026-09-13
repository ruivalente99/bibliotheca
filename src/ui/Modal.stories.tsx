import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "./Button";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const InteractiveExample: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Document Export Modal
        </Button>

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Export Document"
          description="Select format and security parameters for export."
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                Confirm & Download
              </Button>
            </>
          }
        >
          <div className="text-xs text-stone-600 dark:text-[#c9d1d9] space-y-2">
            <p>Your document will be compiled into high-resolution A4 vector PDF with embedded links.</p>
            <p>Target file: resume_en.pdf (124 KB)</p>
          </div>
        </Modal>
      </div>
    );
  },
};
