"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiPostgresql,
  SiTailwindcss,
  SiThreedotjs,
} from "react-icons/si";

/* ── Single Horizontal Ring Archive (8 Icons) ── */
const ORBIT_ICONS = [
  { icon: SiNextdotjs, name: "Next.js", category: "App Architecture", color: "text-white", borderColor: "border-white/60", glow: "shadow-[0_0_25px_rgba(255,255,255,0.7)]" },
  { icon: SiReact, name: "React", category: "Frontend UI", color: "text-[#61DAFB]", borderColor: "border-[#61DAFB]/60", glow: "shadow-[0_0_25px_rgba(97,218,251,0.8)]" },
  { icon: SiTypescript, name: "TypeScript", category: "Type Safety", color: "text-[#3178C6]", borderColor: "border-[#3178C6]/60", glow: "shadow-[0_0_25px_rgba(49,120,198,0.8)]" },
  { icon: SiPython, name: "Python", category: "AI & Signal Processing", color: "text-[#FFD43B]", borderColor: "border-[#FFD43B]/60", glow: "shadow-[0_0_25px_rgba(255,212,59,0.8)]" },
  { icon: SiNodedotjs, name: "Node.js", category: "Backend Runtime", color: "text-[#339933]", borderColor: "border-[#339933]/60", glow: "shadow-[0_0_25px_rgba(51,153,51,0.8)]" },
  { icon: SiPostgresql, name: "PostgreSQL", category: "Relational Systems", color: "text-[#336791]", borderColor: "border-[#336791]/60", glow: "shadow-[0_0_25px_rgba(51,103,145,0.8)]" },
  { icon: SiTailwindcss, name: "Tailwind CSS", category: "Design System", color: "text-[#38B2AC]", borderColor: "border-[#38B2AC]/60", glow: "shadow-[0_0_25px_rgba(56,178,172,0.8)]" },
  { icon: SiThreedotjs, name: "Three.js", category: "3D WebGL", color: "text-white", borderColor: "border-white/60", glow: "shadow-[0_0_25px_rgba(255,255,255,0.8)]" },
];

const IDLE_SPEED = 0.004; // radians/ms
const ENTRANCE_DURATION = 1000; // ms per icon flight
const STAGGER_DELAY = 150; // ms delay between sequential spawns

/** Easing function: Ease-Out Cubic for smooth snap-into-orbit lock-in */
const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

/**
 * Single Horizontal Orbit Hero Component:
 * - 8 icons rotating horizontally around the avatar at top-[68%].
 * - Staggered spawn-from-behind entrance math (angle = Math.PI, depth = -1, scale = 0).
 * - Zero-CLS CSS theme toggle for the avatar using side-by-side Next.js Image components.
 */
export function HeroSingleOrbit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rotation = useRef(0);
  const spinVelocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastMoveTime = useRef(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Hovered tech tooltip state
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Responsive radius calculation state
  const radiusRef = useRef({ x: 250, y: 70 });
  const [displayRadius, setDisplayRadius] = useState({ x: 250, y: 70 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateRadius = () => {
      const w = el.clientWidth || 440;
      // Fluidly scale horizontal ellipse dimensions based on container width
      const x = Math.min(Math.max(w * 0.38, 170), 310);
      const y = x * 0.28; // Flat horizontal ellipse ratio around waist/torso
      radiusRef.current = { x, y };
      setDisplayRadius({ x, y });
    };

    updateRadius();
    const observer = new ResizeObserver(updateRadius);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let last = performance.now();

    const applyPositions = (now: number) => {
      const { x: rx, y: ry } = radiusRef.current;
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      const elapsedTime = now - startTimeRef.current;

      ORBIT_ICONS.forEach((_, i) => {
        const el = iconRefs.current[i];
        if (!el) return;

        // 1. The Stagger: 150ms sequential delay per icon
        const delay = i * STAGGER_DELAY;
        const rawProgress = Math.max(0, Math.min(1, (elapsedTime - delay) / ENTRANCE_DURATION));
        const progress = prefersReducedMotion ? 1 : easeOutCubic(rawProgress);

        // 2. The Flight Path: Linear interpolation from back origin (Math.PI) to actively spinning targetAngle
        const targetAngle = rotation.current + (i / ORBIT_ICONS.length) * Math.PI * 2;
        const currentAngle = Math.PI + (targetAngle - Math.PI) * progress;

        // Flat horizontal ellipse math (no tilts or intersecting rings)
        const x = Math.sin(currentAngle) * rx;
        const y = Math.cos(currentAngle) * ry;
        const depth = Math.cos(currentAngle); // 1 = front, -1 = back

        const isHovered = hoveredIdx === i;

        // 3. The Lock-In: Scale and opacity multiply by progress to grow/fade in from 0 during flight
        const baseScale = 0.6 + 0.4 * ((depth + 1) / 2);
        const scale = (isHovered ? 1.25 : baseScale) * progress;
        const opacity = (isHovered ? 1 : 0.25 + 0.65 * ((depth + 1) / 2)) * progress;

        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        // Icons in back (depth < 0) get z-0 to pass cleanly behind the z-10 avatar image
        el.style.zIndex = isHovered ? "50" : depth > 0 ? "20" : "0";
      });
    };

    if (prefersReducedMotion) {
      applyPositions(performance.now());
      return;
    }

    const frame = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;

      if (!dragging.current) {
        if (Math.abs(spinVelocity.current) > 0.00005) {
          rotation.current += spinVelocity.current * dt;
          spinVelocity.current *= 0.94;
        } else if (hoveredIdx === null) {
          // Continuous 60fps idle rotation when not hovering an icon
          rotation.current += IDLE_SPEED * dt;
        }
      }

      applyPositions(now);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hoveredIdx]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    lastMoveTime.current = performance.now();
    spinVelocity.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastMoveTime.current, 1);
    const dx = e.clientX - lastX.current;
    const delta = dx * 0.006;
    rotation.current += delta;
    spinVelocity.current = delta / dt;
    lastX.current = e.clientX;
    lastMoveTime.current = now;
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[clamp(440px,65vh,700px)] w-[clamp(340px,60vw,640px)] max-w-full cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => {
        onPointerUp();
        setHoveredIdx(null);
      }}
      data-interactive
    >
      {/* Ambient glow aura behind the avatar */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.35, scale: 1, transition: { duration: 1.2, ease: "easeOut" } }}
        viewport={{ once: false, amount: 0.15 }}
        className="absolute left-1/2 top-[55%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-80 sm:w-80"
        style={{ background: "var(--accent-primary)" }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.2, scale: 1, transition: { duration: 1.4, delay: 0.1, ease: "easeOut" } }}
        viewport={{ once: false, amount: 0.15 }}
        className="absolute left-1/2 top-[55%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-96 sm:w-96"
        style={{ background: "var(--accent-secondary)" }}
      />

      {/* Single Horizontal Orbit Ring static guideline at top-[68%] */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/25 shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-500"
        style={{
          width: displayRadius.x * 2,
          height: displayRadius.y * 2,
        }}
      />

      {/* Interactive Tooltip Badge in the center above the ring */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        {hoveredIdx !== null ? (
          (() => {
            const activeIcon = ORBIT_ICONS[hoveredIdx];
            return (
              <span className={`inline-flex animate-bounce items-center gap-2 rounded-full border ${activeIcon?.borderColor || "border-cyan-400/60"} bg-[#0a0f1d]/95 px-4 py-1.5 text-xs font-bold tracking-wider ${activeIcon?.color || "text-cyan-300"} ${activeIcon?.glow || "shadow-[0_0_20px_rgba(34,211,238,0.6)]"} font-mono`}>
                <span className={`h-2 w-2 rounded-full ${(activeIcon?.color || "text-cyan-400").replace("text-", "bg-")} animate-ping`} />
                <span>{activeIcon?.name}</span>
                {activeIcon?.category && (
                  <span className="text-[10px] font-normal opacity-70 border-l border-white/20 pl-2 text-white">{activeIcon.category}</span>
                )}
              </span>
            );
          })()
        ) : (
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400/40 shadow-[0_0_10px_#22d3ee]" />
        )}
      </div>

      {/* Orbiting Tech Icons Ring centered at top-[68%] */}
      <div className="absolute left-1/2 top-[68%]">
        {ORBIT_ICONS.map((item, i) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={i}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`surface-raised absolute left-0 top-0 flex items-center justify-center rounded-full border transition-colors duration-200 cursor-pointer ${isHovered
                ? `h-14 w-14 ${item.borderColor} bg-[#0a0f1d] ${item.color} ${item.glow}`
                : `h-11 w-11 border-white/10 bg-[#0a0f1d]/90 text-[var(--foreground)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:${item.borderColor} hover:${item.color} sm:h-12 sm:w-12`
                }`}
              style={{ marginLeft: isHovered ? -28 : -24, marginTop: isHovered ? -28 : -24 }}
            >
              <Icon className={isHovered ? "h-7 w-7" : "h-5 w-5 sm:h-6 sm:w-6"} />
            </div>
          );
        })}
      </div>

      {/* Cutout portrait avatar with zero-CLS CSS theme toggle (h-[90%] w-[90%]) */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto h-[90%] w-[90%] max-w-[540px]"
      >
        <div className="relative w-full h-full">
          {/* Image 1 (Light Mode Asset): Visible by default, hidden in dark mode */}
          <Image
            src="/images/hero-cutout-light.png"
            alt="Nihad Nilabdeen"
            fill
            priority
            sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 540px"
            className="object-contain object-bottom block dark:hidden"
          />

          {/* Image 2 (Dark Mode Asset): Hidden by default, visible in dark mode */}
          <Image
            src="/images/hero-cutout.png"
            alt="Nihad Nilabdeen"
            fill
            priority
            sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 540px"
            className="object-contain object-bottom hidden dark:block"
          />
        </div>
      </motion.div>
    </div>
  );
}
