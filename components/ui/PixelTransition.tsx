"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface PixelTransitionProps {
  children: React.ReactNode;
  /** Grid dimensions for the unmask effect */
  cols?: number;
  rows?: number;
}

/**
 * Cinematic Intro: Bold typography floats in the foreground while a
 * pixel-grid unmask dissolves behind it. When the grid starts, the
 * text simultaneously fades/scales out in sync with the tile animation.
 */
export function PixelTransition({
  children,
  cols = 12,
  rows = 8,
}: PixelTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"splash" | "reveal" | "done">(
    prefersReducedMotion ? "done" : "splash"
  );

  // After a brief pause showing only text, start both the pixel grid AND text exit together.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      setPhase("reveal");
    }, 1200);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const handleSkip = () => {
    if (phase === "splash") {
      setPhase("reveal");
    } else if (phase === "reveal") {
      setPhase("done");
    }
  };

  const tiles = Array.from({ length: cols * rows });

  // Total grid animation duration: stagger * count + tile duration
  const totalGridDuration = 0.012 * (cols * rows) + 0.05 + 0.35;

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.012,
        delayChildren: 0.05,
      },
    },
  };

  const tile = {
    hidden: { opacity: 1, scale: 1 },
    visible: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.35, ease: "easeIn" as const },
    },
  };

  return (
    <div className="relative">
      {children}

      {/* Pixel Grid Unmask — z-[999], runs BEHIND the text */}
      {phase !== "done" && !prefersReducedMotion && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[999] grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
          variants={container}
          initial="hidden"
          animate={phase === "reveal" ? "visible" : "hidden"}
          onAnimationComplete={() => {
            if (phase === "reveal") setPhase("done");
          }}
        >
          {tiles.map((_, i) => (
            <motion.div
              key={i}
              variants={tile}
              className="bg-[var(--background)]"
            />
          ))}
        </motion.div>
      )}

      {/* Bold Quote Typography — z-[1000], IN FRONT.
          When phase="reveal", the text exits IN SYNC with the pixel grid. */}
      <AnimatePresence>
        {phase !== "done" && !prefersReducedMotion && (
          <motion.div
            key="intro-text"
            onClick={handleSkip}
            initial={{ opacity: 1 }}
            animate={
              phase === "reveal"
                ? { opacity: 0, scale: 1.12, y: -30 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{
              duration: totalGridDuration * 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center px-4 text-center select-none cursor-pointer"
          >
            {/* Monospace Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={
                phase === "reveal"
                  ? { opacity: 0, y: -30, scale: 0.85 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{ duration: 0.5, delay: phase === "reveal" ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent-primary)]"
            >
              {"// NIHAD NILABDEEN • PORTFOLIO"}
            </motion.p>

            {/* Bold Quote — 3D Perspective Exit syncs with tiles */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.85, rotateX: 20, y: 30 }}
              animate={
                phase === "reveal"
                  ? { opacity: 0, scale: 1.15, rotateX: -10, y: -40 }
                  : { opacity: 1, scale: 1, rotateX: 0, y: 0 }
              }
              transition={{
                duration: phase === "reveal" ? totalGridDuration * 0.8 : 0.7,
                delay: phase === "reveal" ? 0 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-[var(--foreground)] max-w-5xl leading-none sm:leading-tight"
            >
              {'"LET\'S BUILD SOMETHING EXTRAORDINARY."'}
            </motion.h1>

            {/* Subtitle / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={
                phase === "reveal"
                  ? { opacity: 0, y: 20 }
                  : { opacity: 0.8, y: 0 }
              }
              transition={{
                duration: phase === "reveal" ? totalGridDuration * 0.6 : 0.5,
                delay: phase === "reveal" ? 0.05 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 font-mono text-xs sm:text-sm text-muted tracking-widest uppercase max-w-md leading-relaxed"
            >
              — ENGINEERING SCALABLE SYSTEMS &amp; MODERN INTERFACES
            </motion.p>

            {/* Skip Hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={
                phase === "reveal"
                  ? { opacity: 0 }
                  : { opacity: 0.5 }
              }
              transition={{ delay: phase === "reveal" ? 0 : 0.8, duration: 0.3 }}
              className="absolute bottom-8 right-8 font-mono text-[11px] text-muted tracking-wider uppercase"
            >
              [Click anywhere to skip]
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
