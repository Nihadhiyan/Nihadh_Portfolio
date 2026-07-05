"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * A thin animated SVG "circuit trace" path that runs behind the About →
 * Skills → Projects section flow. Draws itself in progressively as the
 * user scrolls, with pulsing node dots at key junctures.
 *
 * Also exports a small CornerBracket motif for use on hover states of
 * chips and tags (same visual language, miniature scale).
 */

const NODES = [
  { cx: 60, cy: 80 },
  { cx: 60, cy: 380 },
  { cx: 340, cy: 540 },
  { cx: 340, cy: 900 },
];

const PATH_D =
  "M 60,0 L 60,80 L 60,380 Q 60,430 110,460 L 290,540 Q 340,560 340,610 L 340,900 L 340,1100";

const PATH_LENGTH = 1600;

export function CircuitTrace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const dashOffset = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [PATH_LENGTH, 0]
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute left-4 top-0 hidden h-full w-[400px] md:block lg:left-12"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 1100"
        fill="none"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Main trace line */}
        <motion.path
          d={PATH_D}
          stroke="var(--accent-primary)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity={0.3}
          strokeDasharray={PATH_LENGTH}
          style={{ strokeDashoffset: dashOffset }}
        />

        {/* Pulsing node dots at key junctures */}
        {NODES.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r="4"
            fill="var(--accent-primary)"
            animate={
              prefersReducedMotion
                ? { opacity: 0.6 }
                : {
                    scale: [1, 1.08, 1],
                    opacity: [0.6, 1, 0.6],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * A tiny corner-bracket motif (1px lines) that draws in on hover.
 * Used on skill chips and project tag pills for the same visual system.
 */
export function CornerBracket({
  size = 8,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      className={`absolute opacity-0 transition-opacity duration-150 group-hover:opacity-60 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 0,3 L 0,0 L 3,0"
        stroke="var(--accent-primary)"
        strokeWidth="1"
      />
    </svg>
  );
}
