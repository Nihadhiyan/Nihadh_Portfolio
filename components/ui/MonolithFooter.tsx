"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, ArrowUp, Sparkles, Terminal } from "lucide-react";
import { SiWhatsapp, SiGithub, SiMedium } from "react-icons/si";
import { RxLinkedinLogo } from "react-icons/rx";
import { siteConfig } from "@/config/site";

interface SocialPillItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const SOCIAL_PILLS: SocialPillItem[] = [
  { label: "GitHub", href: siteConfig.socials.github, icon: SiGithub },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: RxLinkedinLogo },
  { label: "Medium", href: siteConfig.socials.medium, icon: SiMedium },
  { label: "Email", href: siteConfig.contact.emailMailto, icon: Mail },
  { label: "WhatsApp", href: siteConfig.contact.whatsappUrl, icon: SiWhatsapp },
];

/**
 * Magnetic Social Pill with zero React state re-renders.
 * Uses Framer Motion's useMotionValue and useSpring to pull towards the cursor.
 * Styled with full responsive Light & Dark theme support.
 */
function MagneticSocialPill({ href, icon: Icon, label }: SocialPillItem) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    /* Disable magnetic physics on mobile viewports (< 768px) */
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    /* Pull pill up to ~15px towards mouse */
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isExternal = href.startsWith("http");

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center gap-3 rounded-full border border-slate-300/80 dark:border-white/15 bg-white/80 dark:bg-white/[0.05] px-6 py-3.5 font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200 backdrop-blur-xl transition-all duration-300 hover:border-sky-500 dark:hover:border-cyan-400/80 hover:bg-white dark:hover:bg-white/[0.1] hover:text-slate-950 dark:hover:text-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer select-none"
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
      <span>{label}</span>
      <span className="absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 dark:from-cyan-400 dark:to-violet-500 transition-all duration-300 group-hover:w-3/4 shadow-[0_0_8px_#0284c7] dark:shadow-[0_0_8px_#22d3ee]" />
    </motion.a>
  );
}

/**
 * The Cinematic Curtain Reveal & Magnetic Monolith Footer.
 * On md+ viewports, sits fixed behind the main content (h-[80vh]) to reveal like a theatrical curtain.
 * On mobile (< md), renders as a standard high-impact block in normal DOM flow.
 * Fully responsive across both Dark (Cybernetic Monolith) and Light (Silicon Valley Monument) themes.
 */
export function MonolithFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative md:fixed md:bottom-0 md:left-0 w-full min-h-[600px] md:h-[80vh] z-10 md:z-10 flex flex-col justify-between overflow-hidden bg-[#f1f5f9] dark:bg-[#03060f] text-slate-900 dark:text-white pt-16 pb-8 px-6 sm:px-12 lg:px-24 border-t border-slate-200 dark:border-white/15 select-none transition-colors duration-500">
      {/* Background Cybernetic Plasma & Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#0284c7_1px,transparent_1px)] dark:bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:28px_28px] opacity-10 dark:opacity-15" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[350px] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-500/15 via-indigo-500/20 to-sky-500/15 dark:from-cyan-500/15 dark:via-violet-500/20 dark:to-cyan-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[2px] w-4/5 max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/80 dark:via-cyan-400/80 to-transparent shadow-[0_0_20px_#0284c7] dark:shadow-[0_0_20px_#22d3ee]" />

      {/* ── 1. TOP HEADER: STATUS & IDENTIFICATION ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: false }}
        className="mx-auto w-full max-w-7xl xl:max-w-[1500px] flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6 font-mono text-xs text-slate-600 dark:text-muted-foreground uppercase tracking-[0.25em]"
      >
        <div className="flex items-center gap-2.5 text-sky-600 dark:text-cyan-400 font-extrabold">
          <Terminal className="h-4 w-4" />
          <span>INDEPENDENT ARCHITECTURE // MOHAMED NIHADH</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-slate-300 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] px-3.5 py-1 backdrop-blur-md shadow-sm dark:shadow-none">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10b981] dark:shadow-[0_0_8px_#34d399]" />
          </span>
          <span className="text-[10px] font-bold text-slate-800 dark:text-gray-300">ALL SYSTEMS NOMINAL</span>
        </div>
      </motion.div>

      {/* ── 2. CENTERPIECE: MAGNETIC PILLS & MASSIVE MONOLITH TYPOGRAPHY ── */}
      <div className="my-auto flex flex-col items-center justify-center gap-8 py-8 w-full">

        {/* Floating Magnetic Glass Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          viewport={{ once: false }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl z-20"
        >
          {SOCIAL_PILLS.map((pill) => (
            <MagneticSocialPill key={pill.label} {...pill} />
          ))}
        </motion.div>

        {/* Gigantic Edge-to-Edge Monolith Typography */}
        <div className="w-full text-center relative z-10 my-2 sm:my-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
            className="w-full text-[16vw] sm:text-[15vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-slate-400 dark:from-white dark:via-white/85 dark:to-white/15 drop-shadow-[0_15px_35px_rgba(2,132,199,0.18)] dark:drop-shadow-[0_0_50px_rgba(34,211,238,0.22)] select-none"
          >
            NIHADH.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-xs font-extrabold tracking-[0.35em] text-sky-600 dark:text-cyan-400 uppercase whitespace-nowrap opacity-90 dark:opacity-80"
          >
            <Sparkles className="inline h-3.5 w-3.5 mr-1.5 animate-pulse text-sky-500 dark:text-cyan-300" />
            <span>SOFTWARE ENGINEER &amp; SYSTEMS ARCHITECT</span>
          </motion.div>
        </div>

      </div>

      {/* ── 3. BOTTOM BASEPLATE: COPYRIGHT & SCROLL TO RETURN ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: false }}
        className="mx-auto w-full max-w-7xl xl:max-w-[1500px] border-t border-slate-200 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-600 dark:text-muted-foreground/80"
      >
        <p className="text-center sm:text-left">
          Designed &amp; Developed by <span className="text-slate-900 dark:text-white font-bold">Mohamed Nihadh</span> © {new Date().getFullYear()}.
        </p>

        <button
          onClick={scrollToTop}
          data-interactive
          className="group flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] px-5 py-2 font-bold text-slate-700 dark:text-gray-300 backdrop-blur-md transition-all duration-300 hover:border-sky-500 dark:hover:border-cyan-400/80 hover:bg-sky-50 dark:hover:bg-cyan-500/10 hover:text-sky-700 dark:hover:text-cyan-300 hover:shadow-[0_4px_15px_rgba(2,132,199,0.15)] dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer shadow-sm dark:shadow-none"
        >
          <span>SCROLL TO RETURN</span>
          <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1 text-sky-600 dark:text-cyan-400 animate-bounce" style={{ animationDuration: "2s" }} />
        </button>
      </motion.div>
    </footer>
  );
}
