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
  SiFramer,
  SiPrisma,
  SiFirebase,
  SiNumpy,
  SiC,
} from "react-icons/si";
import { Database, Cloud, Sigma } from "lucide-react";

/* ── Ring 1 Archive (8 Icons - Tilted +30 degrees) ── */
const ORBIT_ICONS_1 = [
  { icon: SiNextdotjs, name: "Next.js", category: "App Architecture", color: "text-white", borderColor: "border-white/60", glow: "shadow-[0_0_25px_rgba(255,255,255,0.7)]" },
  { icon: SiReact, name: "React", category: "Frontend UI", color: "text-[#61DAFB]", borderColor: "border-[#61DAFB]/60", glow: "shadow-[0_0_25px_rgba(97,218,251,0.8)]" },
  { icon: SiTypescript, name: "TypeScript", category: "Type Safety", color: "text-[#3178C6]", borderColor: "border-[#3178C6]/60", glow: "shadow-[0_0_25px_rgba(49,120,198,0.8)]" },
  { icon: SiTailwindcss, name: "Tailwind CSS", category: "Design System", color: "text-[#38B2AC]", borderColor: "border-[#38B2AC]/60", glow: "shadow-[0_0_25px_rgba(56,178,172,0.8)]" },
  { icon: SiThreedotjs, name: "Three.js", category: "3D WebGL", color: "text-white", borderColor: "border-white/60", glow: "shadow-[0_0_25px_rgba(255,255,255,0.8)]" },
  { icon: SiFramer, name: "Framer Motion", category: "Scroll Physics", color: "text-[#0055FF]", borderColor: "border-[#0055FF]/60", glow: "shadow-[0_0_25px_rgba(0,85,255,0.8)]" },
  { icon: SiNodedotjs, name: "Node.js", category: "Backend Runtime", color: "text-[#339933]", borderColor: "border-[#339933]/60", glow: "shadow-[0_0_25px_rgba(51,153,51,0.8)]" },
  { icon: SiPrisma, name: "Prisma ORM", category: "Database Layer", color: "text-slate-200", borderColor: "border-slate-200/60", glow: "shadow-[0_0_25px_rgba(226,232,240,0.7)]" },
];

/* ── Ring 2 Archive (8 Icons - Tilted -30 degrees) ── */
const ORBIT_ICONS_2 = [
  { icon: SiPython, name: "Python", category: "AI & Signal Processing", color: "text-[#FFD43B]", borderColor: "border-[#FFD43B]/60", glow: "shadow-[0_0_25px_rgba(255,212,59,0.8)]" },
  { icon: SiPostgresql, name: "PostgreSQL", category: "Relational Systems", color: "text-[#336791]", borderColor: "border-[#336791]/60", glow: "shadow-[0_0_25px_rgba(51,103,145,0.8)]" },
  { icon: SiFirebase, name: "Firebase", category: "Realtime Cloud", color: "text-[#FFCA28]", borderColor: "border-[#FFCA28]/60", glow: "shadow-[0_0_25px_rgba(255,202,40,0.8)]" },
  { icon: SiNumpy, name: "NumPy", category: "Scientific Computing", color: "text-[#4FD1C5]", borderColor: "border-[#4FD1C5]/60", glow: "shadow-[0_0_25px_rgba(79,209,197,0.8)]" },
  { icon: SiC, name: "C / Embedded", category: "Low-Level Hardware", color: "text-[#93C5FD]", borderColor: "border-[#93C5FD]/60", glow: "shadow-[0_0_25px_rgba(147,197,253,0.8)]" },
  { icon: Database, name: "SQL & Schema", category: "Data Engineering", color: "text-[#FB7185]", borderColor: "border-[#FB7185]/60", glow: "shadow-[0_0_25px_rgba(251,113,133,0.8)]" },
  { icon: Cloud, name: "Cloud Architecture", category: "Distributed Systems", color: "text-[#38BDF8]", borderColor: "border-[#38BDF8]/60", glow: "shadow-[0_0_25px_rgba(56,189,248,0.8)]" },
  { icon: Sigma, name: "MATLAB & Math", category: "Signal Modeling", color: "text-[#F43F5E]", borderColor: "border-[#F43F5E]/60", glow: "shadow-[0_0_25px_rgba(244,63,94,0.8)]" },
];

const IDLE_SPEED = 0.004; // radians/ms
const ENTRANCE_DURATION = 1400; // ms per icon flight
const STAGGER_DELAY = 150; // ms delay between sequential spawns

/** Easing function: Ease-Out Quint for smooth snap-into-orbit lock-in */
const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);

/**
 * Dual-Orbit X Hero Component with Staggered Entrance Choreography:
 * Icons spawn sequentially from behind the avatar (angle = Math.PI, depth = -1, scale = 0)
 * and fly along their tilted orbital paths until locking into continuous 60fps spin.
 */
export function HeadHalo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iconRefs_1 = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs_2 = useRef<(HTMLDivElement | null)[]>([]);

  const rotation = useRef(0);
  const spinVelocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastMoveTime = useRef(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Hovered tech tooltip state
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredRing, setHoveredRing] = useState<number>(1);

  // Responsive radius calculation state
  const radiusRef = useRef({ x: 230, y: 60 });
  const [displayRadius, setDisplayRadius] = useState({ x: 230, y: 60 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateRadius = () => {
      const w = el.clientWidth || 440;
      const x = Math.min(Math.max(w * 0.35, 150), 240);
      const y = x * 0.3; // 3D perspective ellipse ratio
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

      /* ── Ring 1 Math (Tilted +30 degrees) ── */
      const tilt1 = (30 * Math.PI) / 180;

      ORBIT_ICONS_1.forEach((_, i) => {
        const el = iconRefs_1.current[i];
        if (!el) return;

        // Calculate staggered spawn progress (0 to 1)
        const delay = i * STAGGER_DELAY;
        const rawProgress = Math.max(0, Math.min(1, (elapsedTime - delay) / ENTRANCE_DURATION));
        const progress = prefersReducedMotion ? 1 : easeOutQuint(rawProgress);

        // Target angle on continuous spinning ring
        const targetAngle = rotation.current + (i / ORBIT_ICONS_1.length) * Math.PI * 2;
        // Linear interpolation from back origin (Math.PI) to targetAngle
        const currentAngle = Math.PI + (targetAngle - Math.PI) * progress;

        const xBase = Math.sin(currentAngle) * rx;
        const yBase = Math.cos(currentAngle) * ry;
        const depth = Math.cos(currentAngle); // 1 = front, -1 = behind

        // Apply +30 deg tilt transformation
        const x = xBase * Math.cos(tilt1) - yBase * Math.sin(tilt1);
        const y = xBase * Math.sin(tilt1) + yBase * Math.cos(tilt1);

        const isHovered = hoveredRing === 1 && hoveredIdx === i;

        // Scale and opacity multiply by progress to grow from 0 during flight
        const baseScale = 0.6 + 0.4 * ((depth + 1) / 2);
        const scale = (isHovered ? 1.25 : baseScale) * progress;
        const opacity = (isHovered ? 1 : 0.2 + 0.6 * ((depth + 1) / 2)) * progress;

        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = isHovered ? "50" : depth > 0 ? "20" : "0";
      });

      /* ── Ring 2 Math (Tilted -30 degrees) ── */
      const tilt2 = (-30 * Math.PI) / 180;

      ORBIT_ICONS_2.forEach((_, i) => {
        const el = iconRefs_2.current[i];
        if (!el) return;

        // Sequential stagger continues after Ring 1 (or overlapped)
        const delay = (i + 4) * STAGGER_DELAY;
        const rawProgress = Math.max(0, Math.min(1, (elapsedTime - delay) / ENTRANCE_DURATION));
        const progress = prefersReducedMotion ? 1 : easeOutQuint(rawProgress);

        // Offset Ring 2 angle for interwoven dual-orbit
        const targetAngle = rotation.current + (i / ORBIT_ICONS_2.length) * Math.PI * 2 + Math.PI / ORBIT_ICONS_2.length;
        const currentAngle = Math.PI + (targetAngle - Math.PI) * progress;

        const xBase = Math.sin(currentAngle) * rx;
        const yBase = Math.cos(currentAngle) * ry;
        const depth = Math.cos(currentAngle);

        // Apply -30 deg tilt transformation
        const x = xBase * Math.cos(tilt2) - yBase * Math.sin(tilt2);
        const y = xBase * Math.sin(tilt2) + yBase * Math.cos(tilt2);

        const isHovered = hoveredRing === 2 && hoveredIdx === i;

        const baseScale = 0.6 + 0.4 * ((depth + 1) / 2);
        const scale = (isHovered ? 1.25 : baseScale) * progress;
        const opacity = (isHovered ? 1 : 0.2 + 0.6 * ((depth + 1) / 2)) * progress;

        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(opacity);
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
          // Continuous idle rotation when not hovering an icon
          rotation.current += IDLE_SPEED * dt;
        }
      }

      applyPositions(now);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hoveredIdx, hoveredRing]);

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
      className="relative mx-auto h-[clamp(340px,65vh,900px)] w-[clamp(260px,90vw,980px)] max-w-full cursor-grab touch-none select-none active:cursor-grabbing"
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
        className="absolute left-1/2 top-[55%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-96 sm:w-96 md:h-[28rem] md:w-[28rem]"
        style={{ background: "var(--accent-primary)" }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.2, scale: 1, transition: { duration: 1.4, delay: 0.1, ease: "easeOut" } }}
        viewport={{ once: false, amount: 0.15 }}
        className="absolute left-1/2 top-[55%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[28rem] sm:w-[28rem] md:h-[32rem] md:w-[32rem]"
        style={{ background: "var(--accent-secondary)" }}
      />

      {/* Dual-Orbit X static orbit ring guidelines in 3D perspective */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[60%] rounded-full border border-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500"
        style={{
          width: displayRadius.x * 2,
          height: displayRadius.y * 2,
          transform: "translate(-50%, -50%) rotate(30deg)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[60%] rounded-full border border-violet-400/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500"
        style={{
          width: displayRadius.x * 2,
          height: displayRadius.y * 2,
          transform: "translate(-50%, -50%) rotate(-30deg)",
        }}
      />

      {/* Interactive Tooltip Badge in the center of Dual-Orbit X */}
      <div className="absolute left-1/2 top-[15%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        {hoveredIdx !== null ? (
          (() => {
            const activeIcon = hoveredRing === 1 ? ORBIT_ICONS_1[hoveredIdx] : ORBIT_ICONS_2[hoveredIdx];
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

      {/* Orbiting Tech Icons Ring 1 (+30 deg tilt) */}
      <div className="absolute left-1/2 top-[60%]">
        {ORBIT_ICONS_1.map((item, i) => {
          const Icon = item.icon;
          const isHovered = hoveredRing === 1 && hoveredIdx === i;
          return (
            <div
              key={`ring1-${i}`}
              ref={(el) => {
                iconRefs_1.current[i] = el;
              }}
              onMouseEnter={() => {
                setHoveredIdx(i);
                setHoveredRing(1);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`surface-raised absolute left-0 top-0 flex items-center justify-center rounded-full border transition-colors duration-200 cursor-pointer ${isHovered
                ? `h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 ${item.borderColor} bg-[#0a0f1d] ${item.color} ${item.glow}`
                : `h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-white/10 bg-[#0a0f1d]/90 text-[var(--foreground)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:${item.borderColor} hover:${item.color}`
                }`}
              style={{ marginLeft: isHovered ? -40 : -32, marginTop: isHovered ? -40 : -32 }}
            >
              <Icon className={isHovered ? "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" : "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"} />
            </div>
          );
        })}

        {/* Orbiting Tech Icons Ring 2 (-30 deg tilt) */}
        {ORBIT_ICONS_2.map((item, i) => {
          const Icon = item.icon;
          const isHovered = hoveredRing === 2 && hoveredIdx === i;
          return (
            <div
              key={`ring2-${i}`}
              ref={(el) => {
                iconRefs_2.current[i] = el;
              }}
              onMouseEnter={() => {
                setHoveredIdx(i);
                setHoveredRing(2);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`surface-raised absolute left-0 top-0 flex items-center justify-center rounded-full border transition-colors duration-200 cursor-pointer ${isHovered
                ? `h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 ${item.borderColor} bg-[#0a0f1d] ${item.color} ${item.glow}`
                : `h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-white/10 bg-[#0a0f1d]/90 text-[var(--foreground)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:${item.borderColor} hover:${item.color}`
                }`}
              style={{ marginLeft: isHovered ? -40 : -32, marginTop: isHovered ? -40 : -32 }}
            >
              <Icon className={isHovered ? "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" : "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"} />
            </div>
          );
        })}
      </div>

      {/* Cutout portrait avatar with zero-CLS CSS theme toggle (h-[98%] w-[98%]) */}
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
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto h-[98%] w-[98%] max-w-[700px]"
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
