"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

interface AccordionContextValue {
  expandedValues: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  /** Mode: 'single' allows only one open item, 'multiple' allows multiple items */
  type?: "single" | "multiple";
  /** Controlled expanded value or values */
  value?: string | string[];
  /** Default expanded value or values */
  defaultValue?: string | string[];
  /** Callback fired when expanded state changes */
  onValueChange?: (value: string | string[]) => void;
  /** Child AccordionItem components */
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className = "",
}: AccordionProps) {
  const [internalValues, setInternalValues] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const activeValues = controlledValue !== undefined
    ? (Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : internalValues;

  const toggleItem = (itemValue: string) => {
    let next: string[];
    if (type === "single") {
      next = activeValues.includes(itemValue) ? [] : [itemValue];
      onValueChange?.(next[0] || "");
    } else {
      next = activeValues.includes(itemValue)
        ? activeValues.filter((v) => v !== itemValue)
        : [...activeValues, itemValue];
      onValueChange?.(next);
    }
    if (controlledValue === undefined) {
      setInternalValues(next);
    }
  };

  return (
    <AccordionContext.Provider value={{ expandedValues: activeValues, toggleItem, type }}>
      <div className={cn("w-full divide-y divide-[var(--border)] border-y border-[var(--border)]", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export interface AccordionItemProps {
  /** Unique value identifying this item */
  value: string;
  /** Whether this specific item is disabled */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({
  value,
  disabled = false,
  children,
  className = "",
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within an Accordion");

  const id = useId();
  const triggerId = `accordion-trigger-${id}`;
  const contentId = `accordion-content-${id}`;
  const isOpen = context.expandedValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
      <div
        className={cn(
          "w-full transition-colors",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  const item = useContext(AccordionItemContext);
  const root = useContext(AccordionContext);
  if (!item || !root) throw new Error("AccordionTrigger must be used within an AccordionItem");

  return (
    <button
      type="button"
      id={item.triggerId}
      aria-expanded={item.isOpen}
      aria-controls={item.contentId}
      onClick={() => root.toggleItem(item.value)}
      className={cn(
        "flex w-full items-center justify-between py-3.5 px-1 text-left text-xs font-semibold text-[var(--heading)]",
        "hover:text-[var(--brand)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)] focus-visible:ring-offset-1 rounded-lg",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "w-4 h-4 shrink-0 text-[var(--body-subtle)] transition-transform duration-200",
          item.isOpen && "rotate-180 text-[var(--brand)]"
        )}
      />
    </button>
  );
}

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className = "" }: AccordionContentProps) {
  const item = useContext(AccordionItemContext);
  if (!item) throw new Error("AccordionContent must be used within an AccordionItem");

  if (!item.isOpen) return null;

  return (
    <div
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      className={cn(
        "pb-4 pt-1 px-1 text-xs text-[var(--body)] leading-relaxed animate-in fade-in duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}
