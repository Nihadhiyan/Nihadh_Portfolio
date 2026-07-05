"use client";

import { motion } from "framer-motion";
import { HeroCTACluster } from "@/components/ui/HeroCTACluster";
import { HeadHalo } from "@/components/ui/HeadHalo";
import { AdaptiveGridBackground } from "@/components/ui/AdaptiveGridBackground";

const NAME_LETTER_HOVER = {
  color: "var(--accent-primary)",
  textShadow: "0 0 30px rgba(34,211,238,0.9)",
  scale: 1.06,
  transition: { duration: 0.02, ease: "easeOut" as const },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.85, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
  exit: {
    opacity: 0,
    y: -35,
    scale: 0.85,
    filter: "blur(12px)",
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

/** Hero name — the dot of the "i" is a small glowing energy core. */
function InteractiveName() {
  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.2 }}
      className="text-[13vw] sm:text-7xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] 2xl:text-[13rem] font-black tracking-tight text-[var(--foreground)] drop-shadow-[0_0_25px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-none select-none"
    >
      <motion.span
        variants={letterVariants}
        className="inline-block cursor-default"
        whileHover={NAME_LETTER_HOVER}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        N
      </motion.span>
      <span className="relative inline-block">
        <motion.span
          variants={letterVariants}
          className="inline-block cursor-default"
          whileHover={NAME_LETTER_HOVER}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {"ı"}
        </motion.span>
        {/* Glowing energy core standing in for the dot of the "i" — aligned with "Nihadh" text color in each theme */}
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[62%] flex items-center justify-center pointer-events-none">
          <span className="absolute h-8 w-8 animate-ping rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-blue-500 opacity-40 blur-[2px] dark:from-cyan-400 dark:via-violet-500 dark:to-fuchsia-400 dark:opacity-60 sm:h-10 sm:w-10 md:h-12 md:w-12 xl:h-14 xl:w-14" />
          <span className="absolute h-6 w-6 animate-pulse rounded-full bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 shadow-[0_0_20px_rgba(2,132,199,0.5)] dark:from-cyan-300 dark:via-indigo-500 dark:to-purple-500 dark:shadow-[0_0_25px_rgba(34,211,238,0.9),0_0_15px_rgba(124,58,237,0.8)] sm:h-7 sm:w-7 md:h-8 md:w-8 xl:h-10 xl:w-10" />
          <span className="relative h-3 w-3 rounded-full bg-[var(--foreground)] shadow-[0_0_10px_rgba(2,132,199,0.8)] dark:shadow-[0_0_12px_#fff,0_0_24px_#22d3ee] sm:h-4 sm:w-4 md:h-5 md:w-5 xl:h-6 xl:w-6" />
        </span>
      </span>
      {"hadh".split("").map((letter, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          className="inline-block cursor-default"
          whileHover={NAME_LETTER_HOVER}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}

/**
 * The "Angel Ring" hero: a cutout portrait crowned with a glowing,
 * horizontally-rotating halo of tech-stack icons (see `HeadHalo`), the
 * wordmark, a cycling role badge, and primary calls to action.
 */
export function HeroAngelRing() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28"
    >
      <AdaptiveGridBackground />

      <HeadHalo />

      <div className="relative z-20 -mt-20 sm:-mt-20 md:-mt-20 lg:-mt-20 xl:-mt-20 text-center pointer-events-auto">
        <InteractiveName />
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 60, scale: 0.95 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring" as const,
              stiffness: 220,
              damping: 24,
              delay: 0.3,
            },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="relative z-10 -mt-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg md:text-xl"
        >
          &ldquo;I build scalable software systems, intelligent
          data-driven applications, and modern user-focused interfaces —
          bridging the gap between hardware systems and web
          architecture.&rdquo;
        </motion.p>

        <div className="mt-8 w-full flex justify-center">
          <HeroCTACluster />
        </div>
      </motion.div>
    </section>
  );
}
