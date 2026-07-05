"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Terminal, Cpu, ExternalLink, Code, Sparkles, Layers, Activity, Radio, Compass } from "lucide-react";

/* ── Project Archive Data ── */

export interface ProjectVaultItem {
  id: string;
  index: string;
  title: string;
  status: string;
  description: string;
  tags: string[];
  theme: {
    accent: string;
    border: string;
    glow: string;
    badgeBg: string;
    gradient: string;
  };
  hudStats: { label: string; val: string }[];
}

const PROJECT_VAULT: ProjectVaultItem[] = [
  {
    id: "zamzam-pos",
    index: "01",
    title: "ZAM ZAM Super POS Automation",
    status: "PRODUCTION // V2.0",
    description:
      "A modern retail Point of Sale system engineered with real-time inventory tracking, multi-register synchronization, and an intuitive, futuristic UI designed for ultra-fast checkout workflows.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    theme: {
      accent: "text-cyan-400",
      border: "border-cyan-400/40 hover:border-cyan-400/80",
      glow: "shadow-[0_0_35px_rgba(34,211,238,0.25)]",
      badgeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40",
      gradient: "from-cyan-500/30 via-blue-600/10 to-transparent",
    },
    hudStats: [
      { label: "LATENCY", val: "< 12ms" },
      { label: "SYNC", val: "REALTIME" },
      { label: "UPTIME", val: "99.99%" },
    ],
  },
  {
    id: "audio-analyzer",
    index: "02",
    title: "Audio Signal Analyzer",
    status: "RESEARCH // DSP",
    description:
      "A high-performance Python system for extracting and analyzing complex audio features—including real-time MFCC extraction, harmonic pitch detection, and Fourier wave transformations for signal processing research.",
    tags: ["Python", "Signal Processing", "NumPy", "MATLAB"],
    theme: {
      accent: "text-violet-400",
      border: "border-violet-400/40 hover:border-violet-400/80",
      glow: "shadow-[0_0_35px_rgba(139,92,246,0.25)]",
      badgeBg: "bg-violet-500/15 text-violet-300 border-violet-400/40",
      gradient: "from-violet-500/30 via-purple-600/10 to-transparent",
    },
    hudStats: [
      { label: "FFT_SIZE", val: "4096 PTS" },
      { label: "MFCC_COEFF", val: "13 BANDS" },
      { label: "ACCURACY", val: "99.4%" },
    ],
  },
  {
    id: "rfid-automation",
    index: "03",
    title: "Hardware Automation & RFID Tracking",
    status: "PROTOTYPE // HW",
    description:
      "Advanced research and embedded prototyping of ultra-low-cost inventory tracking tags utilizing chipless RFID and graphene-based metamaterials, bridging physical electromagnetics with digital automation.",
    tags: ["Hardware", "C", "RFID", "Physics"],
    theme: {
      accent: "text-emerald-400",
      border: "border-emerald-400/40 hover:border-emerald-400/80",
      glow: "shadow-[0_0_35px_rgba(16,185,129,0.25)]",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40",
      gradient: "from-emerald-500/30 via-teal-600/10 to-transparent",
    },
    hudStats: [
      { label: "FREQ_RANGE", val: "2.4 - 5.8 GHz" },
      { label: "SUBSTRATE", val: "GRAPHENE" },
      { label: "RANGE", val: "12 METERS" },
    ],
  },
  {
    id: "larmora-suite",
    index: "04",
    title: "Larmora Enterprise Suite",
    status: "ARCHITECTING // SUITE",
    description:
      "Developing an ultra-scale unified business automation and ERP product architecture comprising three core autonomous engines: Opus (Workflow), Cantor (Analytics), and Torque (Resource Orchestration).",
    tags: ["Enterprise Architecture", "AI Integration", "Next.js"],
    theme: {
      accent: "text-amber-400",
      border: "border-amber-400/40 hover:border-amber-400/80",
      glow: "shadow-[0_0_35px_rgba(245,158,11,0.25)]",
      badgeBg: "bg-amber-500/15 text-amber-300 border-amber-400/40",
      gradient: "from-amber-500/30 via-rose-600/10 to-transparent",
    },
    hudStats: [
      { label: "ENGINES", val: "3 AUTONOMOUS" },
      { label: "TELEMETRY", val: "AI_GRAPH" },
      { label: "SCALE", val: "MULTI-TENANT" },
    ],
  },
];

/* ── Holographic Media Window Component with Internal Parallax ── */

interface CardMediaWindowProps {
  project: ProjectVaultItem;
  cardIndex: number;
  scrollYProgress: MotionValue<number>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function CardMediaWindow({
  project,
  cardIndex,
  scrollYProgress,
  onMouseEnter,
  onMouseLeave,
}: CardMediaWindowProps) {
  // Calculate internal parallax: each card shifts horizontally inside its window as we scroll
  const parallaxRange = [-100, 100];
  const innerX = useTransform(
    scrollYProgress,
    [Math.max(0, (cardIndex - 1) * 0.33), Math.min(1, (cardIndex + 1) * 0.33)],
    cardIndex % 2 === 0 ? parallaxRange : [100, -100]
  );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-t-[2.2rem] border-b border-white/10 bg-[#050811] cursor-none group"
    >
      {/* Parallax Background Grid & Holographic Gradient */}
      <motion.div
        style={{ x: innerX }}
        className="absolute -inset-10 flex items-center justify-center pointer-events-none"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${project.theme.gradient} opacity-70`} />

        {/* Animated Radar/Scanner Grid Lines */}
        <div className="absolute inset-0 grid-noise-overlay opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Center Geometric Wireframe/Logo simulation */}
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className={`h-32 w-32 sm:h-40 sm:w-40 rounded-full border-2 border-dashed ${project.theme.border} flex items-center justify-center animate-[spin_30s_linear_infinite] opacity-40`} />
          <div className="absolute flex flex-col items-center">
            <Layers className={`h-12 w-12 sm:h-16 sm:w-16 ${project.theme.accent} animate-pulse`} />
            <span className="mt-3 font-mono text-xs tracking-[0.3em] text-white/80 font-bold uppercase">
              {project.id.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Holographic HUD Overlay (Top & Bottom Bars) */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none z-10">

        {/* Top HUD Bar */}
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-white/70">
          <span className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 border border-white/15 backdrop-blur-md">
            <Radio className={`h-3 w-3 ${project.theme.accent} animate-ping`} />
            <span>SYS_NODE // {project.index}</span>
          </span>
          <span className={`rounded-full px-3 py-1 border font-bold ${project.theme.badgeBg} backdrop-blur-md`}>
            {project.status}
          </span>
        </div>

        {/* Bottom HUD Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-black/70 p-3 border border-white/10 backdrop-blur-md">
          {project.hudStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col text-center border-r last:border-r-0 border-white/10">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <span className={`font-mono text-xs sm:text-sm font-bold ${project.theme.accent}`}>
                {stat.val}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Subtle Scanner Line sweeping across window */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-[scan_4s_ease-in-out_infinite] opacity-60" />
      </div>
    </div>
  );
}

/* ── Single Blueprint Project Card ── */

interface ProjectCardProps {
  project: ProjectVaultItem;
  cardIndex: number;
  scrollYProgress: MotionValue<number>;
  onMouseEnterMedia: () => void;
  onMouseLeaveMedia: () => void;
}

function ProjectCard({
  project,
  cardIndex,
  scrollYProgress,
  onMouseEnterMedia,
  onMouseLeaveMedia,
}: ProjectCardProps) {
  return (
    <div className={`surface-raised flex flex-col justify-between w-[85vw] sm:w-[680px] lg:w-[840px] shrink-0 rounded-[2.5rem] border ${project.theme.border} bg-[#0a0f1d]/90 ${project.theme.glow} backdrop-blur-2xl transition-all duration-500 overflow-hidden`}>

      {/* Top 60%: Holographic Media Window with Parallax */}
      <CardMediaWindow
        project={project}
        cardIndex={cardIndex}
        scrollYProgress={scrollYProgress}
        onMouseEnter={onMouseEnterMedia}
        onMouseLeave={onMouseLeaveMedia}
      />

      {/* Bottom 40%: Architecture Description & Tech Stack Pills */}
      <div className="flex flex-col justify-between flex-1 p-6 sm:p-8 lg:p-10 space-y-6">

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-muted-foreground">
              {"//"} PROJECT_ARCHIVE_{project.index}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills Row */}
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 font-mono text-[11px] text-white/90 font-medium tracking-wide shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Initialize Sequence Button (GitHub / Source) */}
            <a
              href="https://github.com/Nihadh"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/15 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95"
            >
              <Code className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
              <span>INITIALIZE SEQUENCE</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
            </a>

            {/* Deploy Terminal Button (Live Demo) */}
            <a
              href="#"
              className="group relative flex items-center gap-2.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:from-cyan-500/30 hover:to-violet-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95"
            >
              <Terminal className="h-4 w-4 text-cyan-300 animate-pulse" />
              <span>DEPLOY TERMINAL</span>
              <Sparkles className="h-3.5 w-3.5 opacity-70 group-hover:rotate-45 transition-transform" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

/* ── Main Cinematic Horizontal Parallax Vault Component ── */

export function HorizontalProjectVault() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  /* Custom Cursor State */
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHoveringMedia, setIsHoveringMedia] = useState(false);

  /* Track Window Resizing & Calculate Exact Horizontal Translate Range */
  useEffect(() => {
    const updateRange = () => {
      if (trackRef.current) {
        // Calculate total width reliably: either from scrollWidth or from exact card count math
        const cardWidth = window.innerWidth >= 1024 ? 904 : 728;
        const totalWidth = Math.max(
          trackRef.current.scrollWidth,
          PROJECT_VAULT.length * cardWidth
        );
        const viewportWidth = window.innerWidth;
        setScrollRange(Math.max(0, totalWidth - viewportWidth + 120));
      }
    };

    updateRange();
    window.addEventListener("resize", updateRange);
    window.addEventListener("load", updateRange);

    const t1 = setTimeout(updateRange, 150);
    const t2 = setTimeout(updateRange, 600);
    const t3 = setTimeout(updateRange, 1500);

    let observer: ResizeObserver | null = null;
    if (trackRef.current && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateRange);
      observer.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateRange);
      window.removeEventListener("load", updateRange);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
    };
  }, []);

  /* Global Mouse Move Listener for Custom Cursor */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* Framer Motion Scroll Progress for Pinned Section */
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const xTranslate = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  return (
    <section className="relative">

      {/* ── DESKTOP & TABLET: Pinned Horizontal Parallax Vault (h-[350vh]) ── */}
      <div ref={targetRef} className="hidden md:block relative h-[350vh] w-full bg-[var(--background)] transition-colors duration-500">

        {/* Sticky Container (h-screen top-0) */}
        <div className="sticky top-0 flex h-screen items-center overflow-hidden px-12 lg:px-24">

          <div className="absolute right-12 top-12 z-20 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Compass className="h-4 w-4 text-cyan-400 animate-spin" />
            <span>SCROLL TO NAVIGATE VAULT</span>
          </div>

          {/* Horizontal Track Gliding Across X-Axis */}
          <motion.div
            ref={trackRef}
            style={{ x: xTranslate }}
            className="flex items-center gap-12 lg:gap-16 pt-16"
          >
            {PROJECT_VAULT.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                cardIndex={idx}
                scrollYProgress={scrollYProgress}
                onMouseEnterMedia={() => setIsHoveringMedia(true)}
                onMouseLeaveMedia={() => setIsHoveringMedia(false)}
              />
            ))}
          </motion.div>

          {/* Scroll Progress Bar at Bottom of Vault */}
          <div className="absolute bottom-8 left-12 right-12 z-20 flex items-center gap-4">
            <span className="font-mono text-[10px] text-cyan-400 font-bold">01</span>
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full origin-left bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400 shadow-[0_0_12px_#22d3ee]"
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground font-bold">04</span>
          </div>

        </div>

      </div>

      {/* ── MOBILE FALLBACK: Beautiful Vertical Stack (md:hidden) ── */}
      <div className="block md:hidden mx-auto max-w-xl px-6 py-10 bg-[var(--background)] transition-colors duration-500">

        <div className="space-y-12">
          {PROJECT_VAULT.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`surface-raised rounded-3xl border ${project.theme.border} bg-[#0a0f1d]/90 p-6 shadow-xl space-y-6`}
            >
              {/* Mobile Media Window */}
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050811] flex items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.theme.gradient} opacity-60`} />
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <Layers className={`h-10 w-10 ${project.theme.accent} animate-pulse`} />
                  <span className="mt-2 font-mono text-xs font-bold text-white tracking-widest uppercase">
                    {project.id.toUpperCase()}
                  </span>
                  <span className={`mt-2 rounded-full px-2.5 py-0.5 border font-mono text-[9px] font-bold ${project.theme.badgeBg}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Mobile Description & Tags */}
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground border-b border-white/10 pb-2">
                  <span>SYS_NODE // {project.index}</span>
                  <span className={project.theme.accent}>ONLINE</span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {project.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  <a
                    href="https://github.com/Nihadh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 font-mono text-xs font-bold text-white uppercase"
                  >
                    <Code className="h-4 w-4 text-cyan-400" />
                    <span>INITIALIZE SEQUENCE</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/20 py-2.5 font-mono text-xs font-bold text-cyan-300 uppercase"
                  >
                    <Terminal className="h-4 w-4 text-cyan-300" />
                    <span>DEPLOY TERMINAL</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* ── CUSTOM CURSOR (VIEW PROJECT) ── */}
      <motion.div
        animate={{
          x: cursorPos.x,
          y: cursorPos.y,
          scale: isHoveringMedia ? 1 : 0,
          opacity: isHoveringMedia ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.5 }}
        className="pointer-events-none fixed left-0 top-0 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400 bg-cyan-500/20 text-cyan-300 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.8)] font-mono text-xs font-bold tracking-widest"
      >
        <span className="animate-pulse">{"// VIEW"}</span>
      </motion.div>

    </section>
  );
}
