"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface ConsoleField {
  label: string;
  value: string;
}

export interface WhoamiConsoleProps {
  fields: ConsoleField[];
  command?: string;
}

/**
 * A `whoami --verbose` styled console readout with interactive terminal typing animation.
 * Streams the command first, followed by line-by-line character typing of fields.
 */
export function WhoamiConsole({ fields, command = "whoami --verbose" }: WhoamiConsoleProps) {
  const [phase, setPhase] = useState<"COMMAND" | "OUTPUT" | "DONE">("COMMAND");
  const [typedCommand, setTypedCommand] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("COMMAND");
      setTypedCommand("");
      setCurrentRow(0);
      setCurrentCol(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [command]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "COMMAND") {
      if (typedCommand.length < command.length) {
        timer = setTimeout(() => {
          setTypedCommand(command.slice(0, typedCommand.length + 1));
        }, 18); // Fast, realistic command typing speed
      } else {
        timer = setTimeout(() => {
          setPhase("OUTPUT");
          setCurrentRow(0);
          setCurrentCol(0);
        }, 100); // Brief pause before executing command
      }
    } else if (phase === "OUTPUT") {
      if (currentRow < fields.length) {
        const currentField = fields[currentRow];
        const totalLen = currentField.label.length + currentField.value.length;

        if (currentCol < totalLen) {
          timer = setTimeout(() => {
            setCurrentCol((prev) => prev + 1);
          }, 6); // High-speed terminal output stream
        } else {
          timer = setTimeout(() => {
            setCurrentRow((prev) => prev + 1);
            setCurrentCol(0);
          }, 20); // Tiny pause between output lines
        }
      } else {
        timer = setTimeout(() => {
          setPhase("DONE");
        }, 0);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, typedCommand, currentRow, currentCol, command, fields]);

  const handleSkip = () => {
    if (phase !== "DONE") {
      setTypedCommand(command);
      setPhase("DONE");
      setCurrentRow(fields.length);
    }
  };

  const labelWidth = Math.max(...fields.map((f) => f.label.length)) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleSkip}
      className="surface-raised grid-noise-overlay overflow-hidden rounded-2xl border border-white/10 bg-[#060913] shadow-[0_8px_30px_rgba(0,0,0,0.6)] cursor-pointer transition-colors hover:border-cyan-500/30 min-h-[230px] sm:min-h-[250px] flex flex-col justify-start"
      style={{ fontFamily: "var(--font-mono)" }}
      title={phase !== "DONE" ? "Click to skip typing animation" : undefined}
    >
      {/* Terminal Title Bar / Prompt Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 text-xs font-mono sm:px-5">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 shrink-0 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-emerald-400 font-bold shrink-0">nihadh@kelaniya</span>
          <span className="text-muted shrink-0">:</span>
          <span className="text-violet-400 shrink-0">~</span>
          <span className="text-cyan-400 font-bold shrink-0">$</span>
          <span className="font-semibold text-white truncate">{typedCommand}</span>
          {phase === "COMMAND" && (
            <span className="inline-block h-3.5 w-1.5 shrink-0 bg-cyan-400 animate-pulse align-middle shadow-[0_0_8px_#22d3ee]" />
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2 opacity-60">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 border border-red-600/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 border border-yellow-600/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 border border-green-600/50" />
        </div>
      </div>

      {/* Terminal Output Stream Area */}
      <div className="space-y-2.5 px-5 py-5 text-sm sm:py-6 flex-1 flex flex-col justify-start">
        {fields.map((field, idx) => {
          if (phase === "COMMAND" || (phase === "OUTPUT" && idx > currentRow)) {
            return null;
          }

          const isCurrentlyTyping = phase === "OUTPUT" && idx === currentRow;

          let displayedLabel = field.label;
          let displayedValue = field.value;

          if (isCurrentlyTyping) {
            if (currentCol <= field.label.length) {
              displayedLabel = field.label.slice(0, currentCol);
              displayedValue = "";
            } else {
              displayedLabel = field.label;
              displayedValue = field.value.slice(0, currentCol - field.label.length);
            }
          }

          const showCursorOnLabel = isCurrentlyTyping && currentCol <= field.label.length;
          const showCursorOnValue = isCurrentlyTyping && currentCol > field.label.length;

          return (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap items-baseline gap-x-3 leading-relaxed"
            >
              <span
                className="shrink-0 font-bold text-cyan-300 font-mono"
                style={{ minWidth: `${labelWidth}ch` }}
              >
                {displayedLabel}
                {showCursorOnLabel && (
                  <span className="inline-block h-3.5 w-1.5 bg-cyan-400 animate-pulse align-middle ml-0.5 shadow-[0_0_8px_#22d3ee]" />
                )}
              </span>
              <span className="text-gray-200 font-mono">
                {displayedValue}
                {showCursorOnValue && (
                  <span className="inline-block h-3.5 w-1.5 bg-cyan-400 animate-pulse align-middle ml-0.5 shadow-[0_0_8px_#22d3ee]" />
                )}
              </span>
            </motion.div>
          );
        })}

        {/* Final Idle Prompt when output is complete */}
        {phase === "DONE" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pt-2 text-cyan-400 flex items-center gap-2 font-mono text-xs"
          >
            <span className="text-emerald-400 font-bold">nihadh@kelaniya</span>
            <span className="text-muted">:</span>
            <span className="text-violet-400">~</span>
            <span className="text-cyan-400 font-bold">$</span>
            <span className="inline-block h-3.5 w-1.5 bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

