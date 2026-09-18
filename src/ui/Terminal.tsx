"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Modal } from "./Modal";
import { cn } from "./utils";

export type TerminalLineType = "input" | "info" | "success" | "warning" | "error";

export interface TerminalLine {
  id?: string | number;
  content: React.ReactNode;
  type?: TerminalLineType;
  timestamp?: number;
}

export interface TerminalContext {
  clear: () => void;
  print: (line: React.ReactNode, type?: TerminalLineType) => void;
  getHistory: () => string[];
}

export type TerminalOutput = string | React.ReactNode | TerminalLine[] | void;

export interface TerminalCommand {
  name: string;
  description: string;
  aliases?: string[];
  subcommands?: string[];
  execute: (args: string[], ctx: TerminalContext) => TerminalOutput | Promise<TerminalOutput>;
}

export interface TerminalClassNames {
  root?: string;
  header?: string;
  windowControls?: string;
  title?: string;
  outputArea?: string;
  line?: string;
  prompt?: string;
  input?: string;
  suggestions?: string;
  suggestionItem?: string;
}

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of available commands */
  commands?: TerminalCommand[];
  /** Welcome banner or initial message lines */
  welcomeMessage?: React.ReactNode | string[];
  /** Prompt symbol. Default: "$" */
  prompt?: string;
  /** Terminal window title. Default: "terminal" */
  title?: string;
  /** Whether to show macOS style window dots (close, min, max). Default: true */
  showWindowControls?: boolean;
  /** Explicit terminal height. Default: 320 */
  height?: string | number;
  /** Maximum number of history entries remembered. Default: 100 */
  historyLimit?: number;
  classNames?: TerminalClassNames;
}

export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      commands = [],
      welcomeMessage = ["Type 'help' for available commands."],
      prompt = "$",
      title = "terminal",
      showWindowControls = true,
      height = 320,
      historyLimit = 100,
      className = "",
      classNames = {},
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const [lines, setLines] = useState<TerminalLine[]>(() => {
      const initial: TerminalLine[] = [];
      if (Array.isArray(welcomeMessage)) {
        welcomeMessage.forEach((msg, idx) => {
          initial.push({ id: `init-${idx}`, content: msg, type: "info", timestamp: Date.now() });
        });
      } else if (welcomeMessage) {
        initial.push({ id: "init-0", content: welcomeMessage, type: "info", timestamp: Date.now() });
      }
      return initial;
    });

    const [input, setInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll on new output
    useEffect(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, [lines]);

    // Built-in commands merged with user commands
    const allCommands: TerminalCommand[] = [
      ...commands,
      {
        name: "help",
        description: "List available commands",
        execute: () => {
          return [
            { id: "help-title", content: "Available commands:", type: "info" },
            ...allCommands.map((c) => ({
              id: `help-${c.name}`,
              content: `${c.name.padEnd(12)} - ${c.description}`,
              type: "success" as TerminalLineType,
            })),
          ];
        },
      },
      {
        name: "clear",
        description: "Clear terminal screen",
        execute: (_, ctx) => {
          ctx.clear();
        },
      },
      {
        name: "history",
        description: "Show command history",
        execute: (_, ctx) => {
          const hist = ctx.getHistory();
          return hist.map((cmd, i) => ({
            id: `hist-${i}`,
            content: `${(i + 1).toString().padStart(3)}  ${cmd}`,
            type: "info" as TerminalLineType,
          }));
        },
      },
    ];

    // Compute autocomplete suggestions
    useEffect(() => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      const parts = input.split(" ");
      const cmdName = parts[0].toLowerCase();
      const args = parts.slice(1);

      if (parts.length <= 1) {
        const matches = allCommands
          .map((c) => c.name)
          .filter((name) => name.startsWith(cmdName));
        setSuggestions(matches);
      } else {
        const found = allCommands.find(
          (c) => c.name === cmdName || c.aliases?.includes(cmdName)
        );
        if (found?.subcommands) {
          const argPrefix = args[0].toLowerCase();
          const matches = found.subcommands.filter((sub) =>
            sub.toLowerCase().startsWith(argPrefix)
          );
          setSuggestions(matches);
        } else {
          setSuggestions([]);
        }
      }
      setSelectedSuggestion(-1);
    }, [input]);

    const handleRunCommand = async (rawInput: string) => {
      const trimmed = rawInput.trim();
      const timestamp = Date.now();

      if (!trimmed) {
        setLines((prev) => [...prev, { id: timestamp, content: "", type: "input", timestamp }]);
        return;
      }

      // Add to command history
      setCommandHistory((prev) => [...prev.slice(-historyLimit + 1), trimmed]);
      setHistoryIndex(-1);

      // Append input line
      setLines((prev) => [
        ...prev,
        { id: `in-${timestamp}`, content: `${prompt} ${trimmed}`, type: "input", timestamp },
      ]);

      const parts = trimmed.split(/\s+/);
      const cmdName = parts[0].toLowerCase();
      const args = parts.slice(1);

      const targetCmd = allCommands.find(
        (c) => c.name === cmdName || c.aliases?.includes(cmdName)
      );

      const context: TerminalContext = {
        clear: () => setLines([]),
        print: (content, type = "info") =>
          setLines((prev) => [...prev, { id: Math.random(), content, type, timestamp: Date.now() }]),
        getHistory: () => commandHistory,
      };

      if (!targetCmd) {
        setLines((prev) => [
          ...prev,
          {
            id: `err-${timestamp}`,
            content: `Command not found: "${cmdName}". Type 'help' for a list of commands.`,
            type: "error",
            timestamp,
          },
        ]);
        return;
      }

      try {
        const result = await targetCmd.execute(args, context);
        if (!result) return;

        if (Array.isArray(result)) {
          setLines((prev) => [
            ...prev,
            ...result.map((lineItem, i) =>
              typeof lineItem === "string"
                ? { id: `out-${timestamp}-${i}`, content: lineItem, type: "info" as const, timestamp }
                : lineItem
            ),
          ]);
        } else if (typeof result === "string" || React.isValidElement(result)) {
          setLines((prev) => [
            ...prev,
            { id: `out-${timestamp}`, content: result, type: "info", timestamp },
          ]);
        }
      } catch (err: any) {
        setLines((prev) => [
          ...prev,
          {
            id: `err-${timestamp}`,
            content: `Error executing ${cmdName}: ${err?.message || "Unknown error"}`,
            type: "error",
            timestamp,
          },
        ]);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = input;
        setInput("");
        setSuggestions([]);
        handleRunCommand(value);
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (suggestions.length > 0) {
          const chosen = suggestions[selectedSuggestion === -1 ? 0 : selectedSuggestion];
          const parts = input.split(" ");
          if (parts.length > 1) {
            setInput(`${parts[0]} ${chosen}`);
          } else {
            setInput(chosen);
          }
          setSuggestions([]);
          setSelectedSuggestion(-1);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (suggestions.length > 0) {
          setSelectedSuggestion((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        } else if (commandHistory.length > 0) {
          const newIdx = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIdx);
          setInput(commandHistory[commandHistory.length - 1 - newIdx] || "");
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (suggestions.length > 0) {
          setSelectedSuggestion((prev) => (prev >= suggestions.length - 1 ? 0 : prev + 1));
        } else if (historyIndex > -1) {
          const newIdx = historyIndex > 0 ? historyIndex - 1 : -1;
          setHistoryIndex(newIdx);
          setInput(newIdx === -1 ? "" : commandHistory[commandHistory.length - 1 - newIdx] || "");
        }
      }
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Interactive Terminal"
        className={cn(
          "w-full rounded-2xl border border-stone-800 bg-[#0d1117] text-stone-200 font-mono text-xs shadow-lg overflow-hidden flex flex-col relative",
          className,
          classNames.root
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        {/* Title Bar */}
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-stone-800 select-none",
            classNames.header
          )}
        >
          {showWindowControls && (
            <div className={cn("flex items-center gap-1.5", classNames.windowControls)}>
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
          )}
          <span className={cn("text-[11px] text-stone-400 font-sans tracking-wide", classNames.title)}>
            {title}
          </span>
          <div className="w-10" />
        </div>

        {/* Scrollable output area */}
        <div
          ref={scrollAreaRef}
          aria-live="polite"
          className={cn("p-4 overflow-y-auto space-y-1.5 font-mono", classNames.outputArea)}
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          {lines.map((line, idx) => (
            <div
              key={line.id || idx}
              className={cn(
                "leading-relaxed break-all",
                line.type === "error" && "text-rose-400",
                line.type === "success" && "text-emerald-400",
                line.type === "warning" && "text-amber-400",
                line.type === "info" && "text-stone-300",
                line.type === "input" && "text-stone-100 font-bold",
                classNames.line
              )}
            >
              {line.content}
            </div>
          ))}

          {/* Active Prompt Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className={cn("text-[var(--brand)] font-bold select-none", classNames.prompt)}>
              {prompt}
            </span>
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              className={cn(
                "flex-1 bg-transparent border-none outline-none text-stone-100 placeholder-stone-600 focus:ring-0 p-0 m-0",
                classNames.input
              )}
            />
          </div>
        </div>

        {/* Autocomplete suggestions popup */}
        {suggestions.length > 0 && (
          <div
            className={cn(
              "absolute left-4 right-4 bottom-14 bg-[#161b22] border border-stone-700 rounded-xl shadow-xl overflow-hidden z-20 max-h-36 overflow-y-auto",
              classNames.suggestions
            )}
          >
            {suggestions.map((item, idx) => (
              <div
                key={item}
                className={cn(
                  "px-3 py-1.5 cursor-pointer transition-colors text-xs font-mono",
                  idx === selectedSuggestion
                    ? "bg-[var(--brand)] text-white"
                    : "text-stone-300 hover:bg-stone-800",
                  classNames.suggestionItem
                )}
                onClick={() => {
                  const parts = input.split(" ");
                  if (parts.length > 1) {
                    setInput(`${parts[0]} ${item}`);
                  } else {
                    setInput(item);
                  }
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
Terminal.displayName = "Terminal";

export interface TerminalModalProps extends Omit<TerminalProps, "className"> {
  isOpen: boolean;
  onClose: () => void;
  modalSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TerminalModal({
  isOpen,
  onClose,
  modalSize = "lg",
  className = "",
  ...terminalProps
}: TerminalModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalSize}
      className={cn("p-0 overflow-hidden border-none bg-transparent max-w-2xl", className)}
    >
      <Terminal {...terminalProps} height={380} />
    </Modal>
  );
}
