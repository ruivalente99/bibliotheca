import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { PreviewViewport } from "./PreviewViewport";
import { Button } from "../ui/Button";
import { Download, FileJson } from "lucide-react";

function DocumentViewportDemo() {
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="w-full h-screen">
      <PreviewViewport
        docWidth={794}
        docHeight={1123}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        toolbarActions={
          <>
            <Button variant="secondary" size="sm" iconLeft={<FileJson size={13} />}>
              JSON
            </Button>
            <Button variant="primary" size="sm" iconLeft={<Download size={13} />}>
              PDF
            </Button>
          </>
        }
      >
        {/* Mock Printable A4 Page (794px × 1123px) */}
        <div className="w-[794px] h-[1123px] bg-white dark:bg-[#161b22] text-stone-900 dark:text-[#f0f3f6] shadow-2xl border border-stone-200 dark:border-[#30363d] p-16 flex flex-col justify-between rounded-sm">
          <div>
            <div className="border-b-2 border-stone-900 dark:border-stone-100 pb-4 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">DYLAN VALENTE</h1>
                <p className="text-sm text-amber-600 font-mono tracking-widest mt-1">
                  FULLSTACK ARCHITECT & LEAD DEVELOPER
                </p>
              </div>
              <div className="text-right text-xs font-mono text-stone-500">
                <p>ruivalente.com</p>
                <p>porto, portugal</p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Resumo Profissional
                </h2>
                <p className="text-xs text-stone-600 dark:text-[#c9d1d9] leading-relaxed">
                  Engenheiro de software e arquiteto de sistemas com mais de 8 anos de experiência na conceção de plataformas de alto débito, bibliotecas de componentes e ferramentas avançadas em TypeScript, React e Next.js.
                </p>
              </section>

              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Experiência
                </h2>
                <div className="space-y-3">
                  <div className="border-l-2 border-amber-500 pl-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Lead Architect — Acme Corp</span>
                      <span className="text-stone-400 font-mono">2022 — Presente</span>
                    </div>
                    <p className="text-[11.5px] text-stone-600 dark:text-[#c9d1d9] mt-1">
                      Desenho e implementação de infraestrutura de renderização offline e motores de documentos.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="border-t border-stone-200 dark:border-[#30363d] pt-4 text-center text-[10px] font-mono text-stone-400">
            PAPYRUS — ARCHITECTURA VITAE | A4 DOCUMENT PREVIEW ENGINE
          </div>
        </div>
      </PreviewViewport>
    </div>
  );
}

const meta: Meta = {
  title: "Preview/PreviewViewport",
  component: DocumentViewportDemo,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const A4DocumentPreview: Story = {
  render: () => <DocumentViewportDemo />,
};
