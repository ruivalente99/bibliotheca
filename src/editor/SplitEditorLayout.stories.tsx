import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SplitEditorLayout } from "./SplitEditorLayout";
import { BuilderHeader } from "./BuilderHeader";
import { SectionCard } from "./SectionCard";
import { useSectionSync } from "./useSectionSync";
import { User, Briefcase, GraduationCap } from "lucide-react";

function FullEditorDemo() {
  const { highlightedSectionId, handleSelectSection } = useSectionSync();

  const form = (
    <div className="builder-form-pane p-6 space-y-4 max-w-2xl mx-auto">
      <SectionCard
        id="section-personal"
        title="1. Informações Pessoais"
        icon={<User size={16} />}
        highlighted={highlightedSectionId === "personal"}
      >
        <div className="space-y-3">
          <input
            className="w-full border border-stone-200 dark:border-[#30363d] rounded-xl px-3 py-2 text-xs bg-stone-50 dark:bg-[#0d1117] text-stone-900 dark:text-[#f0f3f6]"
            placeholder="Nome Completo"
            defaultValue="Dylan Valente"
          />
          <input
            className="w-full border border-stone-200 dark:border-[#30363d] rounded-xl px-3 py-2 text-xs bg-stone-50 dark:bg-[#0d1117] text-stone-900 dark:text-[#f0f3f6]"
            placeholder="Título Profissional"
            defaultValue="Lead Systems & Fullstack Architect"
          />
        </div>
      </SectionCard>

      <SectionCard
        id="section-experience"
        title="2. Experiência Profissional"
        icon={<Briefcase size={16} />}
        highlighted={highlightedSectionId === "experience"}
      >
        <p className="text-xs text-stone-500">Histórico de cargos e projetos chave.</p>
      </SectionCard>

      <SectionCard
        id="section-education"
        title="3. Formação Académica"
        icon={<GraduationCap size={16} />}
        highlighted={highlightedSectionId === "education"}
      >
        <p className="text-xs text-stone-500">Graus académicos e certificações.</p>
      </SectionCard>
    </div>
  );

  const preview = (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-sm aspect-[1/1.414] bg-white dark:bg-[#161b22] rounded-2xl shadow-2xl border border-stone-200 dark:border-[#30363d] p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div
            onClick={() => handleSelectSection("personal")}
            className="p-3 rounded-xl border border-transparent hover:border-amber-400/80 hover:bg-amber-500/5 cursor-pointer transition-all"
            title="Clica para focar e sincronizar com o formulário"
          >
            <h2 className="text-base font-bold text-stone-900 dark:text-[#f0f3f6]">
              Dylan Valente
            </h2>
            <p className="text-xs text-amber-600 font-mono">Lead Architect</p>
          </div>

          <div
            onClick={() => handleSelectSection("experience")}
            className="p-3 rounded-xl border border-transparent hover:border-amber-400/80 hover:bg-amber-500/5 cursor-pointer transition-all"
            title="Clica para focar e sincronizar com o formulário"
          >
            <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
              Experiência
            </h3>
            <p className="text-xs text-stone-700 dark:text-[#c9d1d9] mt-1">
              Senior Tech Lead — 2022–Presente
            </p>
          </div>

          <div
            onClick={() => handleSelectSection("education")}
            className="p-3 rounded-xl border border-transparent hover:border-amber-400/80 hover:bg-amber-500/5 cursor-pointer transition-all"
            title="Clica para focar e sincronizar com o formulário"
          >
            <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
              Formação
            </h3>
            <p className="text-xs text-stone-700 dark:text-[#c9d1d9] mt-1">
              Mestrado em Engenharia Informática
            </p>
          </div>
        </div>

        <p className="text-[10px] text-center text-stone-400 font-mono">
          Clica nas secções desta folha para focar e destacar os campos à esquerda.
        </p>
      </div>
    </div>
  );

  return (
    <SplitEditorLayout
      header={
        <BuilderHeader
          title="Papyrus Editor"
          subtitle="DEMO SINCRONIZADA COM SPLIT REDIMENSIONÁVEL"
        />
      }
      formPane={form}
      previewPane={preview}
    />
  );
}

const meta: Meta = {
  title: "Editor/SplitEditorLayout",
  component: FullEditorDemo,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const InteractiveSyncDemo: Story = {
  render: () => <FullEditorDemo />,
};
