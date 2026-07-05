"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Layers, Sparkles, Terminal } from "lucide-react";

export interface ArticleMatrixItem {
  id: string;
  title: string;
  readTime: string;
  date: string;
  platform: string;
  link: string;
  image: string;
}

const ARTICLES: ArticleMatrixItem[] = [
  {
    id: "art-1",
    title: "Architecting Scalable ERP Systems with Next.js & TypeScript",
    readTime: "7 MIN READ",
    date: "JUN 2026",
    platform: "MEDIUM",
    link: "https://medium.com",
    image: "/images/zamzam-poster.png",
  },
  {
    id: "art-2",
    title: "Real-Time Audio Signal Processing & MFCC Feature Extraction in Python",
    readTime: "12 MIN READ",
    date: "APR 2026",
    platform: "DEV.TO",
    link: "https://dev.to",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "art-3",
    title: "Chipless RFID Tracking & Graphene Sensors in Modern Healthcare",
    readTime: "15 MIN READ",
    date: "JAN 2026",
    platform: "IEEE XPLORE",
    link: "https://ieeexplore.ieee.org",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "art-4",
    title: "Zero-CLS Theme Adaptive Architecture & Pixel-Chip Flip Transitions",
    readTime: "9 MIN READ",
    date: "NOV 2025",
    platform: "MEDIUM",
    link: "https://medium.com",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "art-5",
    title: "Net-Centric High-Throughput WebSockets & Event-Driven Microservices",
    readTime: "10 MIN READ",
    date: "SEP 2025",
    platform: "DEV.TO",
    link: "https://dev.to",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  },
];

export function ExpansionArticleMatrix() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="articles" className="relative overflow-hidden py-32 select-none">
      {/* Section Header */}
      <div className="mx-auto max-w-6xl px-6 mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
            <span>{"// 05 — ARTICLES & DATA LOGS"}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-6xl text-[var(--foreground)]">
            Expansion Matrix
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Technical treatises, systems engineering breakthroughs, and architectural deep-dives structured in an interactive parallax flex matrix.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
          <span>HOVER SLAB TO ENGAGE PARALLAX TERMINAL</span>
        </div>
      </div>

      {/* ── DESKTOP & TABLET: Parallax Flex Accordion (hidden on mobile) ── */}
      <div className="hidden md:block mx-auto max-w-6xl px-6">
        <div
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative w-full h-[75vh] min-h-[580px] max-h-[800px] flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#03060c]/80 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden"
        >
          {ARTICLES.map((article, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            const targetFlex = isHovered ? 3.5 : isAnyHovered ? 0.75 : 1;
            const targetOpacity = isHovered ? 1 : isAnyHovered ? 0.45 : 0.9;

            return (
              <motion.div
                key={article.id}
                role="link"
                tabIndex={0}
                onClick={() => window.open(article.link, "_blank")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.open(article.link, "_blank");
                  }
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
                animate={{
                  flex: targetFlex,
                  opacity: targetOpacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className={`group relative w-full overflow-hidden rounded-2xl border cursor-pointer transition-colors duration-300 flex flex-col justify-between p-6 ${
                  isHovered
                    ? "border-cyan-400/60 bg-[#080e1a] shadow-[0_0_35px_rgba(34,211,238,0.2)]"
                    : "border-white/10 bg-[#050811]/90 hover:border-white/25"
                }`}
              >
                {/* ── Parallax Background Image Reveal ── */}
                <div
                  className={`absolute inset-0 -z-10 transition-opacity duration-500 pointer-events-none overflow-hidden ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <motion.div
                    animate={{ scale: isHovered ? 1.05 : 1.0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="1200px"
                      className="object-cover object-center scale-105"
                      priority={idx <= 1}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                </div>

                {/* ── Top Bar: Terminal Index & Date ── */}
                <div className="w-full flex items-center justify-between z-10 font-mono text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/10 text-cyan-400 font-bold">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span
                      className={`font-bold tracking-wider uppercase transition-colors ${
                        isHovered ? "text-cyan-300" : "text-muted-foreground"
                      }`}
                    >
                      {article.platform}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold transition-colors ${
                        isHovered ? "text-white bg-black/60 px-2.5 py-1 rounded-md border border-white/15" : "text-muted-foreground"
                      }`}
                    >
                      {article.date}
                    </span>
                    <Terminal className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "text-cyan-400 rotate-12" : "text-muted-foreground/40"}`} />
                  </div>
                </div>

                {/* ── Center / Main Slab Typography ── */}
                <div className="my-auto z-10 max-w-4xl py-2">
                  <h3
                    className={`font-black tracking-tight uppercase transition-all duration-300 leading-tight ${
                      isHovered
                        ? "text-2xl lg:text-4xl text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
                        : "text-lg lg:text-2xl text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {article.title}
                  </h3>
                </div>

                {/* ── Bottom Bar Reveal ── */}
                <div className="w-full h-8 flex items-end justify-between z-10 font-mono text-xs overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isHovered ? (
                      <motion.div
                        key="expanded-footer"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="w-full flex items-center justify-between border-t border-white/15 pt-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 px-3 py-1 font-bold text-cyan-300 backdrop-blur-md shadow-sm">
                            <BookOpen className="h-3.5 w-3.5" />
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 font-bold text-gray-200">
                            <Layers className="h-3.5 w-3.5 text-cyan-400" />
                            SYSTEM LOG
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 font-bold text-cyan-300 group-hover:translate-x-1 transition-transform bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                          <span>READ ARTICLE</span>
                          <ArrowUpRight className="h-4 w-4 text-cyan-400" />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="compressed-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex items-center justify-between text-muted-foreground text-[11px]"
                      >
                        <span>{"// CLICK TO ENGAGE NODE"}</span>
                        <span>{article.readTime}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE FALLBACK: Clean Vertical Stack (< md) ── */}
      <div className="block md:hidden mx-auto max-w-xl px-6 space-y-6">
        {ARTICLES.map((article, idx) => (
          <motion.a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="surface-raised group block overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-5 shadow-xl transition-all duration-300 hover:border-cyan-400/50"
          >
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 mb-4">
              <div className="absolute inset-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white">
                <span className="rounded-full bg-cyan-500/30 border border-cyan-400/50 px-2.5 py-0.5 text-cyan-300 font-bold">
                  {article.platform}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-black/60 border border-white/15 px-2.5 py-0.5 text-gray-200 font-bold">
                  <BookOpen className="h-3 w-3 text-cyan-400" />
                  {article.readTime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-2">
              <span className="text-cyan-400 font-bold">{"//" + (idx + 1).toString().padStart(2, "0")}</span>
              <span>{article.date}</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-gray-400">
                <Layers className="h-3.5 w-3.5 text-cyan-400" /> SYSTEM LOG
              </span>
              <span className="flex items-center gap-1 font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                READ UPLINK <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
