"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate,
  PanInfo,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowRight, BookOpen, Calendar, ExternalLink, Sparkles } from "lucide-react";

/* ── Data ── */

export interface ArcArticle {
  id: string;
  title: string;
  summary: string;
  platform: string;
  platformIcon: "medium" | "devto" | "ieee";
  link: string;
  date: string;
  readTime: string;
  tags: string[];
}

const ARTICLES: ArcArticle[] = [
  {
    id: "arc-1",
    title: "Architecting Scalable ERP Systems with Next.js & TypeScript",
    summary:
      "A deep-dive into enterprise resource planning architectures using server components, edge functions, and type-safe data layers.",
    platform: "MEDIUM",
    platformIcon: "medium",
    link: "https://medium.com",
    date: "JUN 2026",
    readTime: "7 MIN",
    tags: ["Next.js", "TypeScript", "Architecture"],
  },
  {
    id: "arc-2",
    title: "Real-Time Audio Signal Processing & MFCC Feature Extraction",
    summary:
      "Exploring mel-frequency cepstral coefficients for speech recognition pipelines using Python, NumPy, and librosa.",
    platform: "DEV.TO",
    platformIcon: "devto",
    link: "https://dev.to",
    date: "APR 2026",
    readTime: "12 MIN",
    tags: ["Python", "ML", "Signal Processing"],
  },
  {
    id: "arc-3",
    title: "Chipless RFID & Graphene Sensors in Healthcare Systems",
    summary:
      "Investigating next-gen chipless RFID tracking paired with graphene-based biosensors for modern hospital informatics.",
    platform: "IEEE XPLORE",
    platformIcon: "ieee",
    link: "https://ieeexplore.ieee.org",
    date: "JAN 2026",
    readTime: "15 MIN",
    tags: ["RFID", "Healthcare", "IoT"],
  },
  {
    id: "arc-4",
    title: "Zero-CLS Theme Architecture & Pixel-Chip Flip Transitions",
    summary:
      "Building a zero cumulative layout shift theme system with GPU-accelerated 3D tile flip transitions in Next.js.",
    platform: "MEDIUM",
    platformIcon: "medium",
    link: "https://medium.com",
    date: "NOV 2025",
    readTime: "9 MIN",
    tags: ["CSS", "Framer Motion", "Performance"],
  },
  {
    id: "arc-5",
    title: "Net-Centric WebSockets & Event-Driven Microservices",
    summary:
      "High-throughput real-time communication patterns using WebSocket clusters, Redis pub/sub, and event-driven service meshes.",
    platform: "DEV.TO",
    platformIcon: "devto",
    link: "https://dev.to",
    date: "SEP 2025",
    readTime: "10 MIN",
    tags: ["WebSockets", "Microservices", "Redis"],
  },
];

const CARD_WIDTH = 320;
const CARD_GAP = 40;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
// Total scrollable arc range in pixels (from card 0 centered to last card centered)
const MAX_OFFSET = (ARTICLES.length - 1) * CARD_STEP;

/**
 * Spatial Arc Carousel (Scroll-Scrubbed + Drag):
 *
 * A VisionOS-inspired 3D curved carousel driven by BOTH vertical scroll
 * and horizontal drag. The section uses a tall scroll runway (h-[300vh])
 * with a sticky inner viewport so the user's mouse wheel scrubs through
 * the 3D arc, while drag remains available as an alternative input.
 *
 * Scroll Down → carousel advances forward (right cards come to center)
 * Scroll Up   → carousel reverses (left cards come to center)
 */
export function SpatialArcCarousel() {
  /* ── Refs ── */
  const sectionRef = useRef<HTMLDivElement>(null); // The tall scroll runway
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── 1. Scroll-Driven Physics ── */
  // scrollYProgress goes 0→1 as the user scrolls through the 300vh runway
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
  });

  // Map scroll progress [0, 1] to carousel offset [0, -MAX_OFFSET]
  // scrollYProgress=0 → first card centered, scrollYProgress=1 → last card centered
  const scrollOffset = useTransform(smoothScroll, [0, 1], [0, -MAX_OFFSET]);

  /* ── 2. Combined Offset (Scroll + Drag) ── */
  // dragDelta captures temporary drag displacement on top of the scroll position
  const dragDelta = useMotionValue(0);

  // The final composited x value that drives ALL 3D math
  const compositeX = useMotionValue(0);

  // Smoothed version for silky rendering
  const smoothX = useSpring(compositeX, { stiffness: 300, damping: 35, mass: 0.8 });

  // Merge scroll offset and drag delta into compositeX every frame
  useMotionValueEvent(scrollOffset, "change", (latest) => {
    compositeX.set(latest + dragDelta.get());
  });
  useMotionValueEvent(dragDelta, "change", (latest) => {
    compositeX.set(scrollOffset.get() + latest);
  });

  /* ── 3. Active Index Tracking ── */
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(smoothX, "change", (latest) => {
    const idx = Math.round(-latest / CARD_STEP);
    const clamped = Math.max(0, Math.min(ARTICLES.length - 1, idx));
    setActiveIndex(clamped);
  });

  /* ── 4. Drag End → Snap + Reset Delta ── */
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const projected = dragDelta.get() + info.velocity.x * 0.3;
    // Compute snap relative to current scroll position
    const total = scrollOffset.get() + projected;
    let snapIdx = Math.round(-total / CARD_STEP);
    snapIdx = Math.max(0, Math.min(ARTICLES.length - 1, snapIdx));

    // Animate dragDelta to the value that, combined with scrollOffset, centers snapIdx
    const targetTotal = -snapIdx * CARD_STEP;
    const targetDelta = targetTotal - scrollOffset.get();

    animate(dragDelta, targetDelta, {
      type: "spring",
      stiffness: 300,
      damping: 35,
    });
  };

  /* ── 5. Arrow / Dot Navigation ── */
  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(ARTICLES.length - 1, index));
    const targetTotal = -clamped * CARD_STEP;
    const targetDelta = targetTotal - scrollOffset.get();
    animate(dragDelta, targetDelta, {
      type: "spring",
      stiffness: 300,
      damping: 35,
    });
  };

  // 3D intensity (reduced on mobile)
  const rotateIntensity = isMobile ? 20 : 35;
  const translateZNear = isMobile ? 25 : 50;
  const translateZFar = isMobile ? -100 : -200;
  const scaleMin = isMobile ? 0.85 : 0.8;

  return (
    /* ── Tall Scroll Runway (300vh) — user scrolls through this to scrub the arc ── */
    <section
      ref={sectionRef}
      id="articles"
      className="relative select-none"
      style={{ height: "300vh" }}
    >
      {/* ── Sticky Viewport — pins the carousel to the screen while scrolling ── */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Section Header */}
        <div className="mx-auto max-w-6xl w-full px-6 mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
              <span>{"// 05 — ARTICLES & DATA LOGS"}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight md:text-6xl text-[var(--foreground)]">
              Spatial Archive
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              Technical treatises and engineering deep-dives rendered in an
              immersive 3D spatial arc. Scroll or drag to explore.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
            <span>SCROLL · DRAG · ARROW KEYS</span>
          </div>
        </div>

        {/* ── 3D Carousel Stage ── */}
        <div className="relative w-full flex-1 min-h-0 flex items-center" style={{ perspective: "1200px" }}>
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-30">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Previous article"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
          </div>
          <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-30">
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === ARTICLES.length - 1}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Next article"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Draggable Track (drag adds to scroll-driven offset) */}
          <motion.div
            drag="x"
            dragElastic={0.15}
            dragMomentum={false}
            onDrag={(_e, info) => {
              dragDelta.set(dragDelta.get() + info.delta.x);
            }}
            onDragEnd={handleDragEnd}
            style={{ x: smoothX }}
            className="flex items-center justify-start cursor-grab active:cursor-grabbing touch-pan-y"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") goTo(activeIndex - 1);
              if (e.key === "ArrowRight") goTo(activeIndex + 1);
            }}
            tabIndex={0}
          >
            {/* Left spacer to center first card */}
            <div
              className="flex-shrink-0"
              style={{ width: `calc(50vw - ${CARD_WIDTH / 2}px)` }}
            />

            {ARTICLES.map((article, idx) => (
              <ArcCard
                key={article.id}
                article={article}
                index={idx}
                compositeX={smoothX}
                rotateIntensity={rotateIntensity}
                translateZNear={translateZNear}
                translateZFar={translateZFar}
                scaleMin={scaleMin}
                isActive={activeIndex === idx}
              />
            ))}

            {/* Right spacer to center last card */}
            <div
              className="flex-shrink-0"
              style={{ width: `calc(50vw - ${CARD_WIDTH / 2}px)` }}
            />
          </motion.div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2.5 py-8">
          {ARTICLES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                  ? "w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              aria-label={`Go to article ${idx + 1}`}
            />
          ))}
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-cyan-400/60 rounded-full"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </motion.div>
          <span>SCROLL TO EXPLORE</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Individual Arc Card with 3D Transform Interpolation ── */

function ArcCard({
  article,
  index,
  compositeX,
  rotateIntensity,
  translateZNear,
  translateZFar,
  scaleMin,
  isActive,
}: {
  article: ArcArticle;
  index: number;
  compositeX: ReturnType<typeof useSpring>;
  rotateIntensity: number;
  translateZNear: number;
  translateZFar: number;
  scaleMin: number;
  isActive: boolean;
}) {
  const cardCenter = index * CARD_STEP;

  // Distance of this card from viewport center
  const distance = useTransform(compositeX, (latest) => latest + cardCenter);

  // Normalize to [-1, 1]
  const normalizedDistance = useTransform(
    distance,
    [-CARD_STEP * 2, 0, CARD_STEP * 2],
    [-1, 0, 1]
  );

  // 3D Arc Transforms
  const rotateY = useTransform(normalizedDistance, [-1, 0, 1], [rotateIntensity, 0, -rotateIntensity]);
  const translateZ = useTransform(normalizedDistance, [-1, 0, 1], [translateZFar, translateZNear, translateZFar]);
  const scale = useTransform(normalizedDistance, [-1, 0, 1], [scaleMin, 1, scaleMin]);
  const opacity = useTransform(normalizedDistance, [-1, -0.5, 0, 0.5, 1], [0.35, 0.55, 1, 0.55, 0.35]);
  const blur = useTransform(normalizedDistance, [-1, -0.3, 0, 0.3, 1], [4, 2, 0, 2, 4]);
  const filterStr = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="flex-shrink-0"
      style={{
        width: CARD_WIDTH,
        marginRight: CARD_GAP,
        rotateY,
        translateZ,
        scale,
        opacity,
        filter: filterStr,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`relative flex flex-col justify-between w-full h-[480px] rounded-3xl overflow-hidden border-t-2 transition-colors duration-500 ${isActive
            ? "border-t-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
            : "border-t-white/10"
          }`}
      >
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 -z-10 bg-[#0a0f1d]/90 backdrop-blur-xl border border-white/10 rounded-3xl" />

        {/* ── Top: Platform & Date ── */}
        <div className="p-6 pb-0 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10">
              <PlatformIcon type={article.platformIcon} />
            </span>
            <span className="font-bold tracking-wider text-muted-foreground uppercase">
              {article.platform}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-cyan-400/60" />
            {article.date}
          </span>
        </div>

        {/* ── Middle: Title & Summary ── */}
        <div className="px-6 py-4 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-cyan-400/80">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{article.readTime} READ</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight leading-snug text-[var(--foreground)] mb-3">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        </div>

        {/* ── Bottom: Tags & Action ── */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-500/10 border border-cyan-400/25 px-3 py-1 font-mono text-[10px] font-bold text-cyan-300 tracking-wider uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isActive) e.preventDefault();
            }}
            className={`group flex items-center justify-between w-full rounded-xl border px-4 py-3 font-mono text-xs font-bold transition-all duration-300 ${isActive
                ? "border-cyan-400/50 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
                : "border-white/10 bg-white/[0.02] text-white/30 cursor-default pointer-events-none"
              }`}
          >
            <span className="tracking-wider">ACCESS LOG</span>
            <ExternalLink
              className={`h-4 w-4 transition-transform duration-300 ${isActive ? "text-cyan-400 group-hover:translate-x-1" : "text-white/20"
                }`}
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Platform Icon Mini Component ── */

function PlatformIcon({ type }: { type: "medium" | "devto" | "ieee" }) {
  const cls = "h-4 w-4";
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
