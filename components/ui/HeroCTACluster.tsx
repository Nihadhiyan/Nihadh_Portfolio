"use client";

import { useState, useRef, useEffect, type MouseEvent, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";
import { ArrowRight, Terminal, Radio, Send, FileText, Download } from "lucide-react";
import { siteConfig } from "@/config/site";

/* ── 1. The Decoder Status Badge (Top Element) ── */

const ROLES = [
  "Software Engineer",
  "Systems Architect",
  "Data Engineer",
  "Full-Stack Developer",
];

const SYMBOLS = ["#", "$", "%", "&", "@", "X", "Z", "0", "1", "<", ">", "/", "*", "!", "?", "_"];

function DecoderRoleBadge() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState(ROLES[0]);
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 4500);

    return () => clearInterval(cycleInterval);
  }, []);

  useEffect(() => {
    const target = ROLES[roleIndex];
    setTimeout(() => setIsScrambling(true), 0);
    let iteration = 0;

    const scrambleInterval = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx < iteration) {
              return target[idx];
            }
            return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        clearInterval(scrambleInterval);
        setIsScrambling(false);
      }

      iteration += 1 / 2; // Speed of decoding
    }, 30);

    return () => clearInterval(scrambleInterval);
  }, [roleIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 backdrop-blur-md shadow-[inset_0_1px_4px_rgba(255,255,255,0.1),0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
    >
      {/* Pulsing Cyan Heartbeat Dot */}
      <div className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        <span className="absolute h-full w-full rounded-full bg-cyan-400 animate-ping opacity-75" />
        <span className="relative h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
      </div>

      {/* Status Label & Decoder Text */}
      <div className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-wide">
        <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px] sm:text-xs">
          STATUS // ONLINE:
        </span>
        <span className={`font-bold transition-colors ${isScrambling ? "text-cyan-300" : "text-white group-hover:text-cyan-300"}`}>
          {displayText}
        </span>
      </div>
    </motion.div>
  );
}

/* ── 2. The Magnetic Plasma Button (Primary CTA) ── */

interface MagneticPlasmaButtonProps {
  href: string;
  children: ReactNode;
}

function MagneticPlasmaButton({ href, children }: MagneticPlasmaButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  /* Magnetic Spring Displacement */
  const springX = useSpring(0, { stiffness: 350, damping: 25 });
  const springY = useSpring(0, { stiffness: 350, damping: 25 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Map coordinates for plasma glow border
    setMousePos({ x, y });

    // Magnetic pull (disabled on mobile)
    if (!isMobile) {
      const centerX = width / 2;
      const centerY = height / 2;
      springX.set((x - centerX) * 0.35);
      springY.set((y - centerY) * 0.35);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="group relative inline-flex items-center justify-center rounded-2xl p-[1.5px] font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-transform duration-200 active:scale-95 cursor-pointer select-none"
    >
      {/* Outer Glow Base Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-cyan-500/30 to-violet-500/30 transition-opacity duration-300 group-hover:opacity-40" />

      {/* Plasma Radial Border Glow strictly tracking cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34,211,238,1), rgba(139,92,246,0.8), transparent 80%)`,
        }}
      />

      {/* Dark Magnetic Hardware Body */}
      <div className="relative flex h-full w-full items-center justify-center gap-3 rounded-[15px] bg-[#060a14] px-8 py-4.5 text-white transition-all duration-300 group-hover:bg-[#060a14]/90 group-hover:text-cyan-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <Terminal className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
        <span>{children}</span>
        <ArrowRight className="h-4 w-4 text-cyan-400 transition-all duration-300 group-hover:translate-x-1.5" />
      </div>
    </motion.a>
  );
}

/* ── 3. The Ghost Link (Secondary CTA - Minimalist & Animated Underline) ── */

interface GhostLinkProps {
  href: string;
  children: ReactNode;
  download?: string;
}

function GhostLink({ href, children, download }: GhostLinkProps) {
  return (
    <a
      href={href}
      download={download}
      target={download ? "_blank" : undefined}
      rel={download ? "noopener noreferrer" : undefined}
      className="group relative inline-flex items-center gap-3 px-6 py-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-all duration-300 hover:text-white cursor-pointer select-none"
    >
      {download ? (
        <FileText className="h-3.5 w-3.5 text-cyan-400/70 transition-transform duration-300 group-hover:scale-125 group-hover:text-cyan-400" />
      ) : (
        <Radio className="h-3.5 w-3.5 text-cyan-400/70 transition-transform duration-300 group-hover:scale-125 group-hover:text-cyan-400" />
      )}
      <span className="transition-transform duration-300 group-hover:translate-x-1.5">
        {children}
      </span>
      {download ? (
        <Download className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-400" />
      ) : (
        <Send className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-400" />
      )}

      {/* Sleek Animated Glowing Underline tracing left to right */}
      <span className="absolute bottom-2 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 shadow-[0_0_12px_#22d3ee]" />
    </a>
  );
}

/* ── Main Hero CTA Cluster Component (Tactile Cybernetic Console) ── */

export function HeroCTACluster() {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Top: Decoder Status Badge */}
      <div className="flex justify-center">
        <DecoderRoleBadge />
      </div>

      {/* Bottom: CTA Buttons Pair */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 w-full"
      >
        <MagneticPlasmaButton href="#projects">
          Access Archives
        </MagneticPlasmaButton>

        <GhostLink href="/Nihadh_CV.pdf" download="Nihadh_CV.pdf">
          RESUME // CV
        </GhostLink>
      </motion.div>
    </div>
  );
}
