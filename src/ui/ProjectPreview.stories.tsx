import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ProjectPreview } from "./ProjectPreview";
import { Button } from "./Button";

const meta: Meta<typeof ProjectPreview> = {
  title: "UI/ProjectPreview",
  component: ProjectPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProjectPreview>;

export const Default: Story = {
  render: () => (
    <div className="w-[840px] max-w-full p-4">
      <ProjectPreview
        title="Bibliotheca"
        subtitle="Offline-First UI Library & Editor"
        description="Modular, business-agnostic component architecture with strict token discipline, 7 signature themes, and vector PDF compilation."
        windowTitle="@ruivalente99/bibliotheca — v0.8.0"
        accent="amber"
        tags={[
          { label: "React 19", accent: "amber" },
          { label: "Tailwind v4", accent: "blue" },
          { label: "Bun", accent: "emerald" },
          { label: "Storybook", accent: "navy" },
        ]}
        actions={
          <Button variant="ghost" size="sm" className="text-xs h-7 text-stone-400 hover:text-white">
            view repo
          </Button>
        }
        preview={
          <div className="w-full h-full p-4 font-mono text-xs text-stone-400 space-y-2">
            <div className="text-amber-400">// Modular design system</div>
            <div>import &#123; Button, Card &#125; from &quot;@ruivalente99/bibliotheca/ui&quot;;</div>
            <div className="pt-2 text-stone-500">// Zero business coupling</div>
            <div>export const Viewport = () =&gt; &lt;PreviewViewport /&gt;;</div>
          </div>
        }
      />
    </div>
  ),
};

export const LateralisTeal: Story = {
  render: () => (
    <div className="w-[840px] max-w-full p-4">
      <ProjectPreview
        title="PAPYRUS"
        subtitle="Dynamic Multilingual Resume & CV Engine"
        description="Offline-first resume management with live A4 preview, ATS scoring optimization, and bidirectional LaTeX synchronization."
        windowTitle="papyrus — architectura vitae · v2.4.0"
        accent="teal"
        gridPattern="dots"
        tags={[
          { label: "Next.js 15", accent: "teal" },
          { label: "React 19", accent: "blue" },
          { label: "LaTeX Sync", accent: "emerald" },
          { label: "jsPDF", accent: "amber" },
        ]}
        preview={
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
            <div className="w-32 h-44 rounded-sm bg-white text-stone-900 shadow-md p-2 flex flex-col justify-between text-[6px] font-sans">
              <div className="h-2 w-12 bg-teal-700 rounded-[1px]" />
              <div className="space-y-1">
                <div className="h-1 w-full bg-stone-200 rounded-[1px]" />
                <div className="h-1 w-4/5 bg-stone-200 rounded-[1px]" />
                <div className="h-1 w-full bg-stone-200 rounded-[1px]" />
              </div>
              <div className="h-1 w-1/2 bg-teal-600 rounded-[1px]" />
            </div>
            <span className="text-[10px] font-mono text-teal-400 mt-2">A4 Vector Document Preview</span>
          </div>
        }
      />
    </div>
  ),
};

export const ForestEmerald: Story = {
  render: () => (
    <div className="w-[840px] max-w-full p-4">
      <ProjectPreview
        title="Sappientus"
        subtitle="Cryptographic Credential & Diploma Issuance"
        description="Intelligent digital document workflow and certificate generation platform featuring LibSQL edge storage and automated delivery."
        windowTitle="sappientus — edge credential engine · v1.2.0"
        accent="emerald"
        gridPattern="lines"
        tags={[
          { label: "Next.js 16", accent: "emerald" },
          { label: "LibSQL", accent: "teal" },
          { label: "Better-Auth", accent: "blue" },
          { label: "PDF.js", accent: "rose" },
        ]}
        preview={
          <div className="w-full h-full p-3 font-mono text-xs text-emerald-400/90 space-y-1.5 flex flex-col justify-center">
            <div className="text-emerald-500 font-bold">$ edge-verify --cert 0x4f82</div>
            <div className="text-stone-400 text-[11px]">&gt; querying libsql distributed edge replicas...</div>
            <div className="text-emerald-300 text-[11px]">&gt; status: 200 OK (latency: 1.4ms)</div>
            <div className="text-stone-500 text-[10px]">&gt; SHA-256 verified authentic</div>
          </div>
        }
      />
    </div>
  ),
};
