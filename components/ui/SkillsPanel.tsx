"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SkillEntry {
  name: string;
  icon: React.ReactNode;
  detail: string;
}

export interface SkillCategory {
  label: string;
  code: string;
  entries: SkillEntry[];
}

/**
 * A system-diagnostics-style tabbed panel: category rail on the left,
 * animated readout list on the right with a decorative signal bar per
 * entry. Distinct from a plain logo grid — surfaces one detail line per
 * skill instead of just an icon and a name.
 */
export function SkillsPanel({ categories }: { categories: SkillCategory[] }) {
  const [active, setActive] = useState(0);
  const category = categories[active];

  return (
    <div className="surface-raised grid overflow-hidden rounded-2xl md:grid-cols-[220px_1fr]">
      {/* Category rail */}
      <div className="flex overflow-x-auto border-b border-white/5 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActive(i)}
            data-interactive
            className={`relative shrink-0 whitespace-nowrap px-4 py-4 text-left text-sm transition-colors md:shrink md:whitespace-normal ${
              i === active ? "text-[var(--foreground)]" : "text-muted hover:text-[var(--foreground)]"
            }`}
          >
            {i === active && (
              <motion.div
                layoutId="skills-tab-indicator"
                className="absolute inset-0 bg-[var(--accent-primary)]/10 md:border-l-2 md:border-[var(--accent-primary)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 block">
              <span
                className="block text-[10px] tracking-[0.2em] text-[var(--accent-primary)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {cat.code}
              </span>
              <span className="mt-1 block font-medium">{cat.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Readout list */}
      <div className="p-6">
        <div
          className="mb-4 flex items-center gap-2 text-[10px] tracking-[0.2em] text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-primary)]" />
          SCANNING://{category.code}
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={category.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-2"
          >
            {category.entries.map((entry, i) => (
              <motion.li
                key={entry.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
                className="surface-pressed group flex items-center gap-4 rounded-xl px-4 py-3"
              >
                <span className="text-xl text-[var(--accent-primary)]">{entry.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">{entry.name}</p>
                  <p className="truncate text-xs text-muted">{entry.detail}</p>
                </div>
                {/* Decorative signal bar */}
                <span className="flex items-center gap-0.5">
                  {[0, 1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className="w-1 rounded-full bg-[var(--accent-primary)]/50 transition-all duration-300 group-hover:bg-[var(--accent-primary)]"
                      style={{ height: 6 + bar * 3 }}
                    />
                  ))}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
