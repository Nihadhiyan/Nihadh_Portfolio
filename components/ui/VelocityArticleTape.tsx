"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { BookOpen, Sparkles, Zap, ExternalLink } from "lucide-react";

/* ── Data ── */

export interface ArticleTapeItem {
  id: string;
  shortTitle: string;
  fullTitle: string;
  platform: string;
  date: string;
  readTime: string;
  link: string;
  image: string;
}

const ARTICLES: ArticleTapeItem[] = [
  {
    id: "tape-1",
    shortTitle: "SCALABLE ERP ARCHITECTURE",
    fullTitle: "Architecting Scalable ERP Systems with Next.js & TypeScript",
    platform: "MEDIUM",
    date: "JUN 2026",
    readTime: "7 MIN READ",
    link: "https://medium.com",
    image: "/images/zamzam-poster.png",
  },
  {
    id: "tape-2",
    shortTitle: "AUDIO SIGNAL PROCESSING",
    fullTitle: "Real-Time Audio Signal Processing & MFCC Feature Extraction",
    platform: "DEV.TO",
    date: "APR 2026",
    readTime: "12 MIN READ",
    link: "https://dev.to",
    image: "/images/Event/AZRAEL 6.0 Group.jpg",
  },
  {
    id: "tape-3",
    shortTitle: "CHIPLESS RFID SENSORS",
    fullTitle: "Chipless RFID & Graphene Sensors in Healthcare Systems",
    platform: "IEEE XPLORE",
    date: "JAN 2026",
    readTime: "15 MIN READ",
    link: "https://ieeexplore.ieee.org",
    image: "/images/Event/IEEE Newbies .jpg",
  },
  {
    id: "tape-4",
    shortTitle: "ZERO-CLS THEME SYSTEMS",
    fullTitle: "Zero-CLS Theme Architecture & Pixel-Chip Flip Transitions",
    platform: "MEDIUM",
    date: "NOV 2025",
    readTime: "9 MIN READ",
    link: "https://medium.com",
    image: "/images/Event/AZRAEL 6.0 Ind.jpg",
  },
  {
    id: "tape-5",
    shortTitle: "EVENT-DRIVEN WEBSOCKETS",
    fullTitle: "Net-Centric WebSockets & Event-Driven Microservices",
    platform: "DEV.TO",
    date: "SEP 2025",
    readTime: "10 MIN READ",
    link: "https://dev.to",
    image: "/images/Event/IEEE Newbies  2.jpg",
  },
];

// Duplicate 4× for seamless infinite loop across any screen width
const DUPLICATED_ARTICLES = [...ARTICLES, ...ARTICLES, ...ARTICLES, ...ARTICLES];

/** Wrap a value within [min, max) for seamless looping */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Velocity Article Tape:
 * An ultra-premium infinite marquee for technical publications & articles.
 */
export function VelocityArticleTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeArticle, setActiveArticle] = useState<ArticleTapeItem | null>(null);
  const isPaused = useRef(false);

  /* ── 1. Infinite Marquee Loop (Steady Drift) ── */
  const baseX = useMotionValue(0);
  const xPercentage = useTransform(baseX, (v) => `${v}%`);

  useAnimationFrame((_t, delta) => {
    if (isPaused.current) return;

    const speed = -2.2; // Steady leftward drift (% per second)
    const moveBy = speed * (delta / 1000);

    const nextX = baseX.get() + moveBy;
    baseX.set(wrap(-50, -25, nextX));
  });

  /* ── 2. Mouse-Tracking Spring Physics ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 20, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20, mass: 0.2 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 160);
    mouseY.set(e.clientY - rect.top - 140);
  };

  return (
    <section className="relative overflow-hidden py-24 select-none">
      {/* Section Header */}
      <div className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
            <span>{"// PUBLICATION WIREFRAMES — LIVE FEED"}</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight md:text-5xl text-[var(--foreground)]">
            Technical Chronicles
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            High-velocity architectural deep-dives and engineering research papers.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
          <span>HOVER TITLE TO ENGAGE HOLOGRAPHIC PREVIEW</span>
        </div>
      </div>

      {/* ── DESKTOP & TABLET: Velocity Marquee (hidden on mobile) ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setActiveArticle(null);
          isPaused.current = false;
        }}
        className="hidden md:flex relative w-full min-h-[420px] items-center overflow-hidden py-16 no-theme-transition"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-[var(--background)] z-10" />

        <motion.div
          style={{ x: xPercentage }}
          className="flex items-center gap-14 whitespace-nowrap"
        >
          {DUPLICATED_ARTICLES.map((art, idx) => {
            const isHovered =
              activeArticle?.id === art.id &&
              activeArticle?.shortTitle === art.shortTitle;

            return (
              <div
                key={`${art.id}-${idx}`}
                onMouseEnter={() => {
                  setActiveArticle(art);
                  isPaused.current = true;
                }}
                onMouseLeave={() => {
                  setActiveArticle(null);
                  isPaused.current = false;
                }}
                onFocus={() => {
                  setActiveArticle(art);
                  isPaused.current = true;
                }}
                onBlur={() => {
                  setActiveArticle(null);
                  isPaused.current = false;
                }}
                tabIndex={0}
                className="group relative flex items-center gap-5 cursor-pointer py-4 transition-all duration-300"
                onClick={() => window.open(art.link, "_blank")}
              >
                <div className="flex flex-col items-start gap-1 font-mono text-xs text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-cyan-400 font-bold">
                    {"//" +
                      (idx % ARTICLES.length + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-gray-300 group-hover:border-cyan-400/50 group-hover:text-cyan-300 transition-colors">
                    {art.date}
                  </span>
                </div>

                <span
                  style={{
                    WebkitTextStroke: isHovered
                      ? "0px transparent"
                      : "1.5px rgba(6, 182, 212, 0.5)",
                    color: isHovered ? "var(--foreground)" : "transparent",
                    textShadow: isHovered
                      ? "0 0 40px rgba(34, 211, 238, 0.8), 0 0 18px rgba(124, 58, 237, 0.5)"
                      : "none",
                  }}
                  className="text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black tracking-tight uppercase transition-all duration-300 font-sans select-none"
                >
                  {art.shortTitle}
                </span>

                <span className="text-cyan-400/40 text-3xl font-mono mx-4 animate-pulse select-none">
                  <BookOpen className="h-8 w-8" />
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* ── Holographic Mouse-Tracking Photo Card ── */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-none absolute top-0 left-0 z-50 w-80 sm:w-96 overflow-hidden rounded-[1.75rem] border border-cyan-400/50 bg-black/60 shadow-[0_25px_80px_rgba(34,211,238,0.35)] backdrop-blur-xl no-theme-transition"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeArticle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="relative flex flex-col"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={activeArticle.image}
                      alt={activeArticle.shortTitle}
                      fill
                      sizes="384px"
                      className="object-cover scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                      <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/25 border border-cyan-400/50 px-3 py-1 font-mono text-[11px] font-bold text-cyan-300 backdrop-blur-md shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                        <BookOpen className="h-3.5 w-3.5" />
                        {activeArticle.platform}
                      </span>
                      <span className="font-mono text-xs font-bold text-white/90 bg-black/50 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                        {activeArticle.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#050811]/95 border-t border-white/15 px-4 py-3 flex items-center justify-between font-mono text-xs font-bold backdrop-blur-md">
                    <span className="tracking-wider uppercase text-white truncate max-w-[60%]">
                      {activeArticle.fullTitle}
                    </span>
                    <span className="text-cyan-400 tracking-wider flex items-center gap-1">
                      READ ↗
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE FALLBACK: Vertical Glassmorphic Cards (< md) ── */}
      <div className="block md:hidden mx-auto max-w-xl px-6 space-y-6">
        {ARTICLES.map((art, idx) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => window.open(art.link, "_blank")}
            className="surface-raised group block overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-0 shadow-xl transition-all duration-300 hover:border-cyan-400/50 cursor-pointer"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src={art.image}
                  alt={art.shortTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white">
                <span className="rounded-full bg-cyan-500/30 border border-cyan-400/50 px-2.5 py-0.5 text-cyan-300 font-bold flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {art.platform}
                </span>
                <span className="text-gray-300 bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
                  {art.readTime}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-2">
                <span className="text-cyan-400 font-bold">
                  {"//" + (idx + 1).toString().padStart(2, "0")}
                </span>
                <span>{art.date}</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-cyan-400 transition-colors leading-snug">
                {art.fullTitle}
              </h3>

              <div className="mt-4 flex items-center justify-end border-t border-white/10 pt-3 font-mono text-xs">
                <span className="flex items-center gap-1 font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  READ ARTICLE <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
