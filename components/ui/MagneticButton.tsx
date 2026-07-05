"use client";

import { motion } from "framer-motion";

/**
 * A state-of-the-art interactive button with glassy cyan-blue glassmorphism,
 * shimmering light sweep, and pulsing cyber-glow effects — without mouse pulling.
 */
export function MagneticButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const isSolid = variant === "solid";

  return (
    <motion.a
      href={href}
      data-interactive
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] text-sm font-medium transition-all duration-300 ${
        isSolid
          ? "shadow-[0_0_25px_rgba(34,211,238,0.3),inset_0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_35px_rgba(34,211,238,0.55),0_0_15px_rgba(59,130,246,0.3)]"
          : "hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
      } ${className}`}
    >
      {/* Sleek Crystalline Glassy Border Layer */}
      <span
        className={`absolute inset-0 rounded-full border transition-all duration-300 ${
          isSolid
            ? "border-cyan-400/50 group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            : "border-transparent group-hover:border-cyan-400/40"
        }`}
      />

      {/* Glassy Button Interior (No Rainbow / Opaque Black Blocks) */}
      <span
        className={`relative z-10 inline-flex h-full w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 backdrop-blur-md transition-all duration-300 ${
          isSolid
            ? "text-cyan-900 dark:text-cyan-300 group-hover:text-cyan-950 dark:group-hover:text-white"
            : "bg-transparent text-[var(--foreground)] group-hover:text-cyan-900 dark:group-hover:text-cyan-300 dark:group-hover:text-white group-hover:bg-cyan-500/[0.08]"
        }`}
        style={
          isSolid
            ? {
                background:
                  "linear-gradient(135deg, rgba(34,211,238,0.22) 0%, rgba(59,130,246,0.22) 50%, rgba(99,102,241,0.22) 100%)",
              }
            : undefined
        }
      >
        {/* Shimmer Light Sweep on Hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

        <span className="relative z-10 inline-flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-0.5">
          {children}
        </span>
      </span>
    </motion.a>
  );
}


