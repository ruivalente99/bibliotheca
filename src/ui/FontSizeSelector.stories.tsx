import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FontSizeSelector, DEFAULT_SCALE_OPTIONS, DEFAULT_DENSITY_OPTIONS } from "./FontSizeSelector";

const meta: Meta<typeof FontSizeSelector> = {
  title: "UI/FontSizeSelector",
  component: FontSizeSelector,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FontSizeSelector>;

export const SegmentedDensity: Story = {
  render: () => {
    const [size, setSize] = useState("normal");

    return (
      <div className="flex flex-col gap-4 items-center">
        <FontSizeSelector
          value={size}
          onChange={setSize}
          options={DEFAULT_DENSITY_OPTIONS}
          label="Document Density"
        />
        <p className="text-xs text-stone-500 font-mono">Selected: {size}</p>
      </div>
    );
  },
};

export const StepperCompact: Story = {
  render: () => {
    const [size, setSize] = useState("normal");

    return (
      <div className="flex flex-col gap-4 items-center">
        <FontSizeSelector
          variant="stepper"
          size="sm"
          value={size}
          onChange={setSize}
          options={DEFAULT_DENSITY_OPTIONS}
          showIcon
          labels={{
            decrease: "Decrease document font size",
            increase: "Increase document font size",
          }}
        />
        <p className="text-xs text-stone-500 font-mono">Selected: {size}</p>
      </div>
    );
  },
};

export const DropdownWithDescriptions: Story = {
  render: () => {
    const [scale, setScale] = useState("md");

    return (
      <div className="flex flex-col gap-4 items-start w-64">
        <FontSizeSelector
          variant="dropdown"
          value={scale}
          onChange={setScale}
          options={DEFAULT_SCALE_OPTIONS}
          label="Reading Scale"
          showIcon
        />
        <p className="text-xs text-stone-500 font-mono">Selected scale: {scale}</p>
      </div>
    );
  },
};

export const CustomPortugueseLabels: Story = {
  render: () => {
    const [density, setDensity] = useState("normal");

    return (
      <div className="flex flex-col gap-4 items-center">
        <FontSizeSelector
          value={density}
          onChange={setDensity}
          options={[
            { id: "compact", label: "Compacto", shortLabel: "A-", description: "Espaçamento reduzido" },
            { id: "normal", label: "Padrão", shortLabel: "A", description: "Equilíbrio editorial clássico" },
            { id: "spacious", label: "Espaçoso", shortLabel: "A+", description: "Tipografia ampla e arejada" },
          ]}
          label="Densidade de Texto"
        />
        <p className="text-xs text-stone-500 font-mono">Selecionado: {density}</p>
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: () => {
    const [val, setVal] = useState("md");

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 w-12">XS:</span>
          <FontSizeSelector size="xs" value={val} onChange={setVal} options={DEFAULT_SCALE_OPTIONS} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 w-12">SM:</span>
          <FontSizeSelector size="sm" value={val} onChange={setVal} options={DEFAULT_SCALE_OPTIONS} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 w-12">MD:</span>
          <FontSizeSelector size="md" value={val} onChange={setVal} options={DEFAULT_SCALE_OPTIONS} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 w-12">LG:</span>
          <FontSizeSelector size="lg" value={val} onChange={setVal} options={DEFAULT_SCALE_OPTIONS} />
        </div>
      </div>
    );
  },
};
