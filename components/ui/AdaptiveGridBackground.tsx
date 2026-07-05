"use client";

import { motion } from "framer-motion";

/**
 * Performant, theme-adaptive background grid & glowing ambient orbs.
 * - CSS linear-gradient 1px grid mapped to `var(--grid-line)` (changes instantly on theme swap).
 * - Radial mask-image creates a smooth spotlight effect fading out toward screen edges.
 * - Three massive blurred ambient orbs mapped to `var(--orb-primary)`, `var(--orb-secondary)`, and `var(--orb-tertiary)`.
 */
export function AdaptiveGridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* ── Ambient Orbs (Mapped to theme variables for instant color swap) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full blur-[100px] sm:h-[32rem] sm:w-[32rem] sm:blur-[120px]"
        style={{
          background: "var(--orb-primary)",
          transform: "translateZ(0)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.15, ease: "easeOut" }}
        className="absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full blur-[100px] sm:h-[36rem] sm:w-[36rem] sm:blur-[120px]"
        style={{
          background: "var(--orb-secondary)",
          transform: "translateZ(0)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-10 left-1/3 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full blur-[100px] sm:h-[30rem] sm:w-[30rem] sm:blur-[120px]"
        style={{
          background: "var(--orb-tertiary)",
          transform: "translateZ(0)",
        }}
      />

      {/* ── 1px CSS Grid with Radial Spotlight Mask ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 45%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 45%, transparent 85%)",
        }}
      />
    </div>
  );
}
