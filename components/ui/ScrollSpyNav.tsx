"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Home, User, Cpu, Terminal, Briefcase, BookOpen, Mail, Sun, Moon } from "lucide-react";
import { usePixelTheme } from "@/components/theme/PixelTransitionProvider";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", icon: <Home className="h-4 w-4" /> },
  { label: "About", href: "#about", icon: <User className="h-4 w-4" /> },
  { label: "Specializations", href: "#specializations", icon: <Cpu className="h-4 w-4" /> },
  { label: "Skills", href: "#skills", icon: <Terminal className="h-4 w-4" /> },
  { label: "Projects", href: "#projects", icon: <Briefcase className="h-4 w-4" /> },
  { label: "Articles", href: "#articles", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Contact", href: "#contact", icon: <Mail className="h-4 w-4" /> },
];

interface ScrollSpyNavProps {
  items?: NavItem[];
}

/**
 * Advanced Scroll-Reactive Navigation (The Flowing Menu).
 * Features:
 * - Scroll-Reactive Glassmorphism: transparent/glass mode at the top (!isScrolled),
 *   smoothly transitioning via 500ms cubic-bezier into a solid, condensed dock when scrolled.
 * - Throttled scroll detection via Framer Motion's useScroll & useMotionValueEvent.
 * - Automatic Scroll-Spy section detection via IntersectionObserver.
 * - Liquid glowing pill background that glides smoothly to active or hovered tabs.
 */
export function ScrollSpyNav({ items = DEFAULT_NAV_ITEMS }: ScrollSpyNavProps) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.href ?? "#home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  /* ── 1. Throttled Scroll Detection (Threshold = 60px) ── */
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const thresholdCrossed = latest > 60;
    if (thresholdCrossed !== isScrolled) {
      setIsScrolled(thresholdCrossed);
    }
  });

  /* ── 2. Automatic Scroll-Spy via IntersectionObserver ── */
  useEffect(() => {
    const sectionIds = items.map((item) => item.href.replace("#", "")).filter(Boolean);
    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sectionEls.length === 0) return;

    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of ratioMap) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        // Handle very top of document
        if (bestRatio < 0.05 && window.scrollY < 120) {
          setActiveSection(items[0]?.href ?? "#home");
          return;
        }

        if (bestId) {
          setActiveSection(`#${bestId}`);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-10% 0px -40% 0px",
      }
    );

    for (const el of sectionEls) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      {/* ── DESKTOP TOP NAVBAR (hidden on mobile, flex on md+) ── */}
      <nav
        aria-label="Desktop Navigation"
        className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 hidden md:flex items-center rounded-full transition-all duration-500 ease-in-out max-w-[95vw] ${
          isScrolled
            ? "backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] border border-white/15 bg-[#0a0f1d]/95 py-1.5 px-3"
            : "py-2.5 px-5 bg-transparent backdrop-blur-md border border-white/10 shadow-sm"
        }`}
      >
        <ul
          onMouseLeave={() => setHoveredSection(null)}
          className="flex items-center gap-1.5 relative"
        >
          {items.map((item) => {
            const isActive = activeSection === item.href;
            const isHovered = hoveredSection === item.href;
            const showPill = isHovered || (!hoveredSection && isActive);

            return (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  onMouseEnter={() => setHoveredSection(item.href)}
                  onFocus={() => setHoveredSection(item.href)}
                  onClick={() => setActiveSection(item.href)}
                  className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs lg:text-sm font-medium transition-colors duration-300 ${
                    isActive || isHovered ? "text-[var(--foreground)]" : "text-muted-foreground hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className={isActive ? "text-cyan-400 animate-pulse" : "opacity-70"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>

                {/* Liquid Pill Background — Glides smoothly to active or hovered tab */}
                {showPill && (
                  <motion.div
                    layoutId="desktop-scroll-spy-pill"
                    className="absolute inset-0 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/25 via-violet-500/25 to-cyan-500/25 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                    transition={{
                      type: "spring" as const,
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}
              </li>
            );
          })}

          {/* Separator line */}
          <li className="h-5 w-[1px] bg-white/15 mx-2" aria-hidden="true" />

          {/* Integrated Theme Toggle */}
          <li>
            <ThemeToggleEl />
          </li>
        </ul>
      </nav>

      {/* ── MOBILE BOTTOM DOCK (flex on mobile, hidden on md+) ── */}
      <nav
        aria-label="Mobile Navigation Dock"
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center justify-between gap-1 rounded-full transition-all duration-500 ease-in-out w-[92vw] max-w-sm ${
          isScrolled
            ? "border border-white/15 bg-[#0a0f1d]/95 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            : "border border-white/10 bg-transparent p-2 backdrop-blur-md shadow-sm"
        }`}
      >
        <ul className="flex items-center justify-around w-full relative">
          {items.map((item) => {
            const isActive = activeSection === item.href;

            return (
              <li key={item.href} className="relative flex-1 text-center">
                <a
                  href={item.href}
                  onClick={() => setActiveSection(item.href)}
                  aria-label={item.label}
                  className={`relative z-10 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-colors ${
                    isActive ? "text-cyan-400" : "text-muted-foreground hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className={isActive ? "scale-110 transition-transform" : "opacity-70"}>
                    {item.icon}
                  </span>
                  <span className="text-[9px] font-mono tracking-tighter mt-0.5 truncate max-w-[48px]">
                    {item.label}
                  </span>
                </a>

                {/* Mobile Liquid Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-scroll-spy-pill"
                    className="absolute inset-0 rounded-full border border-cyan-400/50 bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    transition={{
                      type: "spring" as const,
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}
              </li>
            );
          })}

          {/* Separator line */}
          <li className="h-6 w-[1px] bg-white/15 mx-1" aria-hidden="true" />

          {/* Integrated Theme Toggle for Mobile */}
          <li className="shrink-0 pr-1">
            <ThemeToggleEl />
          </li>
        </ul>
      </nav>
    </>
  );
}

/**
 * Theme Toggle Button integrated inside ScrollSpyNav.
 * Delegates to PixelTransitionProvider for 3D pixel fracturing animation.
 */
function ThemeToggleEl() {
  const { theme, toggleTheme, mounted } = usePixelTheme();

  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[var(--foreground)] shadow-sm transition-colors hover:border-cyan-400/50 hover:bg-cyan-500/10"
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.8)]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4 text-cyan-600 drop-shadow-[0_0_6px_rgba(8,145,178,0.6)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
