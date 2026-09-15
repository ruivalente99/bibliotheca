import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { DockableToolbar } from "./DockableToolbar";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";

function ToolbarDemo() {
  const [zoom, setZoom] = useState(1.0);
  const [toolMode, setToolMode] = useState<"pointer" | "hand">("pointer");
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="relative w-full max-w-4xl h-[450px] bg-stone-100 dark:bg-[#0d1117] rounded-3xl border border-stone-200 dark:border-[#30363d] flex items-center justify-center p-2 sm:p-8">
      <div className="text-center space-y-2">
        <p className="text-sm font-bold text-stone-700 dark:text-[#f0f3f6]">
          Barra de Ferramentas com Ancoragem em 4 Cantos
        </p>
        <p className="text-xs text-stone-500 max-w-sm">
          Arrasta o puxador à esquerda ou faz duplo clique nele para alternar a posição entre inferior, direita, topo e esquerda.
        </p>
      </div>

      <DockableToolbar
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(3, z + 0.1))}
        onZoomOut={() => setZoom((z) => Math.max(0.2, z - 0.1))}
        onResetView={() => setZoom(1.0)}
        onFitToScreen={() => setZoom(0.85)}
        toolMode={toolMode}
        onToolModeChange={setToolMode}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        extraActions={
          <Button variant="primary" size="sm" iconLeft={<Download size={12} />} className="hidden sm:inline-flex">
            Exportar
          </Button>
        }
      />
    </div>
  );
}

const meta: Meta = {
  title: "Preview/DockableToolbar",
  component: ToolbarDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const InteractiveDocking: Story = {
  render: () => <ToolbarDemo />,
};
