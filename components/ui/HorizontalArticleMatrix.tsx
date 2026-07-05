"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  ExternalLink,
  Layers,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

/* ── Data Structure ── */

export interface ArticleMatrixItem {
  id: string;
  title: string;
  readTime: string;
  date: string;
  platform: string;
  platformIcon: "medium" | "devto" | "ieee";
  link: string;
  image: string;
  summary: string;
  abstract: string;
  tags: string[];
}

const ARTICLES: ArticleMatrixItem[] = [
  {
    id: "art-1",
    title: "Architecting Scalable ERP Systems with Next.js & TypeScript",
    readTime: "7 MIN READ",
    date: "JUN 2026",
    platform: "MEDIUM",
    platformIcon: "medium",
    link: "https://medium.com",
    image: "/images/zamzam-poster.png",
    summary:
      "A deep-dive into enterprise resource planning architectures using server components, edge functions, and type-safe data layers.",
    abstract:
      "Modern ERP systems require real-time synchronization, high-frequency transaction logging, and uncompromising type safety across distributed boundaries. In this architectural breakdown, we explore how Next.js App Router, React Server Components, and Edge SQL adapters unify to deliver sub-50ms latency for global supply chain workflows.",
    tags: ["Next.js", "TypeScript", "Architecture", "ERP", "Edge SQL"],
  },
  {
    id: "art-2",
    title: "Real-Time Audio Signal Processing & MFCC Feature Extraction",
    readTime: "12 MIN READ",
    date: "APR 2026",
    platform: "DEV.TO",
    platformIcon: "devto",
    link: "https://dev.to",
    image: "/images/Event/AZRAEL 6.0 Group.jpg",
    summary:
      "Exploring mel-frequency cepstral coefficients for speech recognition pipelines using Python, NumPy, and librosa.",
    abstract:
      "Extracting speech biomarkers in noisy environments demands robust digital filtering and real-time spectral analysis. We implement a custom fast Fourier transform (FFT) pipeline in Python, deriving MFCC feature vectors with zero-latency streaming buffers for neural audio classification.",
    tags: ["Python", "NumPy", "Librosa", "Signal Processing", "ML"],
  },
  {
    id: "art-3",
    title: "Chipless RFID & Graphene Sensors in Healthcare Systems",
    readTime: "15 MIN READ",
    date: "JAN 2026",
    platform: "IEEE XPLORE",
    platformIcon: "ieee",
    link: "https://ieeexplore.ieee.org",
    image: "/images/Event/IEEE Newbies .jpg",
    summary:
      "Investigating next-gen chipless RFID tracking paired with graphene-based biosensors for modern hospital informatics.",
    abstract:
      "Traditional RFID tags suffer from silicon cost and rigidity constraints in medical environments. By synthesizing printable graphene nanoparticle antennas on flexible substrates, we demonstrate chipless backscatter interrogation that simultaneously senses patient temperature and vital signs.",
    tags: ["RFID", "Graphene", "Healthcare", "IoT", "Biomedical"],
  },
  {
    id: "art-4",
    title: "Zero-CLS Theme Architecture & Pixel-Chip Flip Transitions",
    readTime: "9 MIN READ",
    date: "NOV 2025",
    platform: "MEDIUM",
    platformIcon: "medium",
    link: "https://medium.com",
    image: "/images/Event/AZRAEL 6.0 Ind.jpg",
    summary:
      "Building a zero cumulative layout shift theme system with GPU-accelerated 3D tile flip transitions in Next.js.",
    abstract:
      "Theme switching in complex web applications often induces layout thrashing and jarring flash-of-unstyled-content (FOUC). We detail a hardware-accelerated CSS Grid tessellation technique that offloads 3D matrix transformations to the GPU while suppressing global CSS transitions.",
    tags: ["CSS Grid", "Framer Motion", "Performance", "WebGL", "60fps"],
  },
  {
    id: "art-5",
    title: "Net-Centric WebSockets & Event-Driven Microservices",
    readTime: "10 MIN READ",
    date: "SEP 2025",
    platform: "DEV.TO",
    platformIcon: "devto",
    link: "https://dev.to",
    image: "/images/Event/IEEE Newbies  2.jpg",
    summary:
      "High-throughput real-time communication patterns using WebSocket clusters, Redis pub/sub, and event-driven service meshes.",
    abstract:
      "Scaling WebSocket connections across ephemeral container orchestration clusters requires distributed state coordination. This article outlines a resilient event-driven broker architecture utilizing Redis Pub/Sub channels and heartbeat backpressure mechanisms.",
    tags: ["WebSockets", "Microservices", "Redis", "Distributed Systems"],
  },
];

/**
 * Horizontal Expansion Matrix (Scroll-Driven + Interactive):
 * A Kinetic Horizontal Accordion for the Articles / Data Logs section.
 *
 * - Desktop (>= lg): The section acts as a 300vh scroll runway with a sticky viewport.
 *   As the user scrolls down, scrollYProgress automatically advances the active accordion card
 *   from Article 1 -> 5. Users can also click/hover cards directly.
 * - Uses an overflow-hidden clipping mask over a fixed-width (w-[740px]) inner container
 *   to ensure zero text reflow or squishing during spring width animations.
 * - Mobile (< lg): Gracefully degrades into a clean, fully-expanded vertical card stack.
 */
export function HorizontalArticleMatrix() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Capture scroll progress across the 300vh desktop runway
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Automatically advance the active accordion card as the user scrolls
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const idx = Math.min(
        ARTICLES.length - 1,
        Math.floor(latest * ARTICLES.length)
      );
      setActiveIndex(Math.max(0, idx));
    }
  });

  return (
    /* ── Desktop/Tablet: 300vh Scroll Runway. Mobile: Normal Auto Height ── */
    <section
      ref={sectionRef}
      className="relative select-none md:h-[300vh]"
    >
      {/* ── Desktop/Tablet: Sticky Viewport. Mobile: Normal Flow ── */}
      <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-center overflow-hidden py-16 md:py-0">
        {/* Section Instruction Badge */}
        <div className="mx-auto max-w-7xl xl:max-w-[1500px] w-full px-6 mb-6 relative z-10 flex justify-end">
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
            <span>SCROLL TO ADVANCE · HOVER · CLICK</span>
          </div>
        </div>

        {/* ── DESKTOP/TABLET: Horizontal Flex Accordion (>= md) ── */}
        <div className="hidden md:flex flex-row gap-4 h-[78vh] min-h-[600px] max-h-[900px] max-w-7xl xl:max-w-[1500px] w-full mx-auto px-6">
          {ARTICLES.map((article, idx) => {
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={article.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                animate={{
                  flex: isActive ? 6 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                  bounce: 0,
                }}
                className={`relative h-full rounded-3xl overflow-hidden border transition-colors duration-500 cursor-pointer ${isActive
                    ? "border-cyan-500/80 bg-[#050811] shadow-[0_0_40px_rgba(34,211,238,0.15)]"
                    : "border-white/10 bg-[#050811]/70 hover:border-white/20 hover:bg-[#050811]"
                  }`}
              >
                {/* Glassmorphic backdrop */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                {/* ── COLLAPSED STATE STRIP (Visible when inactive) ── */}
                <motion.div
                  animate={{
                    opacity: isActive ? 0 : 1,
                    pointerEvents: isActive ? "none" : "auto",
                  }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex flex-col justify-between items-center py-8 px-4 z-20"
                >
                  {/* Top: Platform Icon & Number */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white shadow-sm">
                      <PlatformIcon type={article.platformIcon} />
                    </span>
                    <span className="font-mono text-[11px] font-bold text-cyan-400/80">
                      {"//" + (idx + 1).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Middle: Rotated Title */}
                  <div className="flex-1 flex items-center justify-center py-6">
                    <span
                      className="font-bold text-base tracking-wider text-white/80 uppercase truncate max-w-[380px] select-none"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {article.title}
                    </span>
                  </div>

                  {/* Bottom: Read Time Badge */}
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                    {article.readTime.split(" ")[0]}
                  </div>
                </motion.div>

                {/* ── EXPANDED STATE (2-Column Reveal via Clipping Mask) ── */}
                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ duration: 0.3, delay: isActive ? 0.05 : 0 }}
                  className="absolute inset-0 w-[740px] h-full flex flex-row z-10"
                >
                  {/* Left Column: Article Metadata, Summary & Action */}
                  <div className="w-[360px] shrink-0 h-full p-8 flex flex-col justify-between border-r border-white/10 bg-[#050811]">
                    {/* Header: Platform & Date */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs mb-6">
                        <span className="flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 font-bold text-cyan-300">
                          <PlatformIcon type={article.platformIcon} />
                          {article.platform}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 text-cyan-400/60" />
                          {article.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-cyan-400/80">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="text-2xl font-black tracking-tight text-[var(--foreground)] leading-snug mb-4 line-clamp-3">
                        {article.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {article.summary}
                      </p>
                    </div>

                    {/* Footer: Tech Stack Pills & Button */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {article.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="group flex items-center justify-between w-full rounded-xl border border-cyan-400/50 bg-cyan-950/60 px-5 py-3.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300"
                      >
                        <span className="tracking-wider">ACCESS LOG</span>
                        <ExternalLink className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Parallax Cover Image & Deep Dive Abstract */}
                  <div className="flex-1 h-full relative overflow-hidden bg-black/80 p-6 flex flex-col justify-end group/img">
                    {/* Cover Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="400px"
                        className="object-cover transition-transform duration-700 scale-105 group-hover/img:scale-100 opacity-75"
                      />
                    </div>

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent dark:from-[#050811] dark:via-[#050811]/50 dark:to-transparent" />

                    {/* Floating Abstract Card */}
                    <div className="relative z-10 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md p-5 shadow-2xl transition-transform duration-300 group-hover/img:-translate-y-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>ABSTRACT // DEEP DIVE</span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400">
                          {"LOG #" + (idx + 1).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-sans line-clamp-4">
                        {article.abstract}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Progress Indicator (Desktop/Tablet) */}
        <div className="hidden md:flex items-center justify-center gap-3 mt-8">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/70">
            <span>SCROLL DOWN TO ADVANCE LOGS</span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>
          </div>
        </div>

        {/* ── MOBILE: Graceful Vertical Stack (< md) ── */}
        <div className="flex flex-col gap-8 md:hidden max-w-3xl mx-auto px-6">
          {ARTICLES.map((article, idx) => (
            <div
              key={article.id}
              className="rounded-3xl border border-white/15 bg-[#050811] overflow-hidden shadow-xl"
            >
              {/* Top Image Banner with Abstract Overlay */}
              <div className="relative h-[240px] w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent dark:from-[#050811] dark:via-[#050811]/60 dark:to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 font-mono text-[10px] font-bold text-cyan-400">
                    <PlatformIcon type={article.platformIcon} />
                    {article.platform}
                  </span>
                  <span className="font-mono text-xs font-bold text-white/80 bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full">
                    {"//" + (idx + 1).toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Mini Abstract Floating inside Image Banner */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-cyan-400 uppercase tracking-widest mb-1 font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>ABSTRACT</span>
                  </div>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {article.abstract}
                  </p>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="p-6">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <BookOpen className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400/60" />
                    {article.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)] leading-snug mb-3">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {article.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full rounded-xl border border-cyan-400/50 bg-cyan-950/60 px-5 py-3.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-900/80 transition-colors"
                >
                  <span className="tracking-wider">ACCESS LOG</span>
                  <ExternalLink className="h-4 w-4 text-cyan-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Platform Icon Helper ── */

function PlatformIcon({ type }: { type: "medium" | "devto" | "ieee" }) {
  const cls = "h-3.5 w-3.5";
  switch (type) {
    case "medium":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${cls} text-white`}>
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42S14.2 15.54 14.2 12s1.52-6.42 3.38-6.42 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75S21.62 15.17 21.62 12s.54-5.75 1.19-5.75S24 8.83 24 12z" />
        </svg>
      );
    case "devto":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${cls} text-white`}>
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .67-.08.84-.23.17-.16.27-.45.27-.95v-2c0-.5-.1-.79-.27-.95zm13.5-7.05H3.08C1.93 3 1 3.93 1 5.08v13.84C1 20.07 1.93 21 3.08 21h17.84c1.15 0 2.08-.93 2.08-2.08V5.08C23 3.93 22.07 3 20.92 3zm-12.7 13H7.56c0 .02-2.17 0-2.17 0V8h1.76c1.57 0 2.27.88 2.27 2.45v3.1c0 1.57-.7 2.45-2.27 2.45h-.43zm5.41-1.86c0 .5-.45.95-.95.95H11.2V12h1.98v1.14H11.2v-.86h1.98c.5 0 .95.45.95.95v.96zm4.83-.94c-.33.67-1.06 1.04-1.84 1.04-.84 0-1.57-.4-1.88-1.1l1.03-.45c.15.34.46.55.84.55s.63-.1.8-.36c.14-.22.14-.48 0-.7-.17-.26-.46-.36-.84-.36h-.43v-1.04h.38c.32 0 .56-.08.73-.3.13-.18.13-.42 0-.6-.14-.22-.37-.33-.73-.33-.32 0-.58.16-.73.42l-.95-.55c.33-.6.95-.97 1.68-.97.73 0 1.4.34 1.73.95.26.48.26 1.06 0 1.54-.13.24-.33.42-.56.55.27.14.5.34.64.6.26.5.26 1.1-.02 1.6h.15z" />
        </svg>
      );
    case "ieee":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${cls} text-cyan-400`}>
          <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="12" y="14.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor">
            IEEE
          </text>
        </svg>
      );
  }
}
