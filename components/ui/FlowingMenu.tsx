"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { usePixelTheme } from "@/components/theme/PixelTransitionProvider";

interface NavItem {
  label: string;
  href: string;
}

interface FlowingMenuProps {
  items: NavItem[];
}

/**
 * Sticky nav bar with a background pill that glides between items on
 * hover via a shared layoutId. Condenses on scroll with glass blur.
 * Includes scroll-spy: the nav item for the currently visible section
 * is highlighted automatically as the user scrolls.
 * Includes an integrated Dark/Light Theme Switcher that triggers 3D pixel fracturing!
 */
export function FlowingMenu({ items }: FlowingMenuProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(
    items[0]?.href ?? ""
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Scroll spy via IntersectionObserver ── */
  useEffect(() => {
    // Extract section IDs from hrefs (e.g. "#about" → "about")
    const sectionIds = items
      .map((item) => item.href.replace("#", ""))
      .filter(Boolean);

    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sectionEls.length === 0) return;

    // Track which sections are currently intersecting and their ratios
    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.set(entry.target.id, entry.intersectionRatio);
        }

        // Find the section with the highest intersection ratio
        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of ratioMap) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        // If nothing is meaningfully visible, check if we're at the very top
        if (bestRatio < 0.05) {
          if (window.scrollY < 100) {
            setActiveSection(items[0]?.href ?? "");
          }
          return;
        }

        if (bestId) {
          setActiveSection(`#${bestId}`);
        }
      },
      {
        // Multiple thresholds for fine-grained ratio tracking
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        // Offset the rootMargin to account for the fixed navbar
        rootMargin: "-80px 0px -30% 0px",
      }
    );

    for (const el of sectionEls) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full transition-all duration-300 max-w-[95vw] overflow-x-auto no-scrollbar ${
        scrolled ? "backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0a0f1d]/80" : ""
      }`}
    >
      <ul
        onMouseLeave={() => setHovered(null)}
        className={`surface-pressed flex items-center gap-1 rounded-full px-3 transition-all duration-300 ${
          scrolled ? "py-1.5" : "py-2"
        }`}
      >
        {items.map((item) => (
          <NavItemEl
            key={item.href}
            item={item}
            isHovered={hovered === item.href}
            isActive={activeSection === item.href}
            onHover={() => setHovered(item.href)}
          />
        ))}

        {/* Separator line between nav links and theme toggle */}
        <li className="h-4 w-[1px] bg-white/15 mx-1.5 shrink-0" />

        {/* Integrated Resize-Friendly Theme Toggle */}
        <li className="shrink-0">
          <ThemeToggleNavEl />
        </li>
      </ul>
    </nav>
  );
}

function NavItemEl({
  item,
  isHovered,
  isActive,
  onHover,
}: {
  item: NavItem;
  isHovered: boolean;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <li className="relative shrink-0">
      <a
        href={item.href}
        onMouseEnter={onHover}
        onFocus={onHover}
        className={`relative z-10 block rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium outline-none transition-all duration-300 ${
          isHovered
            ? "text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
            : isActive
              ? "text-cyan-300"
              : "text-[var(--foreground)] hover:text-white"
        }`}
      >
        {item.label}
      </a>

      {/* Hover pill — slides between items */}
      {isHovered && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3),0_0_10px_rgba(124,58,237,0.2)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(34,211,238,0.22) 0%, rgba(124,58,237,0.22) 100%)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}

      {/* Active section indicator — persistent dot/underline */}
      {isActive && !isHovered && (
        <motion.div
          layoutId="nav-active-dot"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </li>
  );
}

/**
 * Compact theme toggle button integrated inside the FlowingMenu navbar.
 * Delegates to `PixelTransitionProvider`, which handles the scroll-to-top,
 * the radial pixel-flip animation, and the actual next-themes state swap.
 */
function ThemeToggleNavEl() {
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

