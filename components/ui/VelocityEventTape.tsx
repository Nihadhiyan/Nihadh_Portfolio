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
import { Sparkles, Zap } from "lucide-react";

/* ── Data ── */

export interface EventItem {
  id: string;
  eventName: string;
  role: string;
  year: string;
  image: string;
}

const EVENTS: EventItem[] = [
  {
    id: "evt-1",
    eventName: "AZRAEL 6.0",
    role: "Core Organizer",
    year: "2025",
    image: "/images/event/AZRAEL 6.0 Group.jpg",
  },
  {
    id: "evt-2",
    eventName: "IEEE NEW BEES",
    role: "Design Team Member",
    year: "2025",
    image: "/images/event/IEEE Newbies .jpg",
  },
  {
    id: "evt-3",
    eventName: "AZRAEL 6.0 IND",
    role: "Solo Competitor",
    year: "2025",
    image: "/images/event/AZRAEL 6.0 Ind.jpg",
  },
  {
    id: "evt-4",
    eventName: "IEEE ONBOARDING",
    role: "Technical Lead",
    year: "2025",
    image: "/images/event/IEEE Newbies  2.jpg",
  },
  {
    id: "evt-5",
    eventName: "TECH SUMMIT",
    role: "Speaker & Panelist",
    year: "2026",
    image: "/images/event/IEEE Newbies  id.jpg",
  },
];

// Duplicate 4× for seamless infinite loop across any screen width
const DUPLICATED_EVENTS = [...EVENTS, ...EVENTS, ...EVENTS, ...EVENTS];

/** Wrap a value within [min, max) for seamless looping */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Velocity Event Tape:
 * An ultra-premium, scroll-velocity-tied infinite marquee for the
 * Engagements/Events section. Features:
 * - Scroll Velocity Physics: Horizontal speed is mathematically tied to
 *   vertical scroll velocity via useScroll → useVelocity → useSpring → useTransform.
 * - Hollow Wireframe Typography: Massive -webkit-text-stroke titles that
 *   fill in on hover.
 * - Holographic Mouse-Tracking Photo Reveal: When hovering an event name,
 *   a glassmorphic polaroid card materializes and trails the cursor via
 *   Framer Motion spring physics.
 */
export function VelocityEventTape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const isPaused = useRef(false);

  /* ── 1. Infinite Marquee Loop (Steady Drift) ── */
  const baseX = useMotionValue(0);
  const xPercentage = useTransform(baseX, (v) => `${v}%`);

  useAnimationFrame((_t, delta) => {
    if (isPaused.current) return;

    const speed = -2.5; // Steady leftward drift (% per second)
    const moveBy = speed * (delta / 1000);

    const nextX = baseX.get() + moveBy;
    baseX.set(wrap(-50, -25, nextX));
  });

  /* ── 3. Mouse-Tracking Spring Physics (Zero React Re-renders) ── */
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
    <section className="relative overflow-hidden pb-16 select-none">
      {/* Section Instruction Badge */}
      <div className="mx-auto max-w-6xl px-6 mb-8 relative z-10 flex justify-end">
        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" />
          <span>HOVER EVENT TO ENGAGE HOLOGRAPHIC UPLINK</span>
        </div>
      </div>

      {/* ── DESKTOP & TABLET: Velocity Marquee (hidden on mobile) ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setActiveEvent(null);
          isPaused.current = false;
        }}
        className="hidden md:flex relative w-full min-h-[420px] items-center overflow-hidden py-16 no-theme-transition"
      >
        {/* Background Ambient Edge Fade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-[var(--background)] z-10" />

        <motion.div
          style={{ x: xPercentage }}
          className="flex items-center gap-14 whitespace-nowrap"
        >
          {DUPLICATED_EVENTS.map((event, idx) => {
            const isHovered =
              activeEvent?.id === event.id &&
              activeEvent?.eventName === event.eventName;

            return (
              <div
                key={`${event.id}-${idx}`}
                onMouseEnter={() => {
                  setActiveEvent(event);
                  isPaused.current = true;
                }}
                onMouseLeave={() => {
                  setActiveEvent(null);
                  isPaused.current = false;
                }}
                onFocus={() => {
                  setActiveEvent(event);
                  isPaused.current = true;
                }}
                onBlur={() => {
                  setActiveEvent(null);
                  isPaused.current = false;
                }}
                tabIndex={0}
                className="group relative flex items-center gap-5 cursor-default py-4 transition-all duration-300"
              >
                {/* Event Index & Year Badge */}
                <div className="flex flex-col items-start gap-1 font-mono text-xs text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-cyan-400 font-bold">
                    {"//" +
                      (idx % EVENTS.length + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-gray-300 group-hover:border-cyan-400/50 group-hover:text-cyan-300 transition-colors">
                    {event.year}
                  </span>
                </div>

                {/* Giant Hollow Wireframe Event Name */}
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
                  {event.eventName}
                </span>

                {/* Separator Glyph */}
                <span className="text-cyan-400/40 text-3xl font-mono mx-4 animate-pulse select-none">
                  <Zap className="h-8 w-8" />
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* ── Holographic Mouse-Tracking Photo Card ── */}
        <AnimatePresence>
          {activeEvent && (
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
                  key={activeEvent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="relative flex flex-col"
                >
                  {/* Event Photo (4:3 Aspect Ratio) */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={activeEvent.image}
                      alt={activeEvent.eventName}
                      fill
                      sizes="384px"
                      className="object-cover scale-105"
                      priority
                    />
                    {/* Bottom gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Badges overlaid on the image bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                      {/* Role Pill — bottom left */}
                      <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/25 border border-cyan-400/50 px-3 py-1 font-mono text-[11px] font-bold text-cyan-300 backdrop-blur-md shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                        <Zap className="h-3.5 w-3.5" />
                        {activeEvent.role.toUpperCase()}
                      </span>
                      {/* Year — bottom right */}
                      <span className="font-mono text-xs font-bold text-white/90 bg-black/50 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                        {activeEvent.year}
                      </span>
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="w-full bg-[#050811]/95 border-t border-white/15 px-4 py-3 flex items-center justify-between font-mono text-xs font-bold backdrop-blur-md">
                    <span className="tracking-wider uppercase text-white truncate max-w-[60%]">
                      {activeEvent.eventName}
                    </span>
                    <span className="text-cyan-400 tracking-wider">
                      FIELD LOG ↗
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
        {EVENTS.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="surface-raised group block overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-0 shadow-xl transition-all duration-300 hover:border-cyan-400/50"
          >
            {/* Event Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src={event.image}
                  alt={event.eventName}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white">
                <span className="rounded-full bg-cyan-500/30 border border-cyan-400/50 px-2.5 py-0.5 text-cyan-300 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {event.role.toUpperCase()}
                </span>
                <span className="text-gray-300 bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
                  {event.year}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground mb-2">
                <span className="text-cyan-400 font-bold">
                  {"//" + (idx + 1).toString().padStart(2, "0")}
                </span>
                <span>{event.year}</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-cyan-400 transition-colors leading-snug">
                {event.eventName}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {event.role}
              </p>

              <div className="mt-4 flex items-center justify-end border-t border-white/10 pt-3 font-mono text-xs">
                <span className="flex items-center gap-1 font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  FIELD LOG ↗
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
