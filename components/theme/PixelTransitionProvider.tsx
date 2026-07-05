"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type AppTheme = "dark" | "light";

interface PixelThemeContextValue {
  /** `undefined` until mounted, to keep server/client render output identical. */
  theme: AppTheme | undefined;
  toggleTheme: (event?: React.MouseEvent | { clientX: number; clientY: number } | unknown) => void;
  mounted: boolean;
}

const PixelThemeContext = createContext<PixelThemeContextValue | null>(null);

/** Read the active theme + a click-to-flip toggler. Must be used under `PixelTransitionProvider`. */
export function usePixelTheme() {
  const ctx = useContext(PixelThemeContext);
  if (!ctx) {
    throw new Error("usePixelTheme must be used within a PixelTransitionProvider");
  }
  return ctx;
}

/* ── Radial "pixel chip flip" grid overlay ── */

const TILE_SIZE = 72; // px, target — actual cell size is derived to fill the viewport exactly
const FLIP_DURATION = 0.5; // seconds, per-tile flip
const RIPPLE_SPREAD = 0.6; // seconds, delay budget from center to the farthest tile
const FADE_DURATION = 0.35; // seconds, overlay fade-out once done

const THEME_SWATCH: Record<AppTheme, { bg: string; edge: string }> = {
  dark: { bg: "#050505", edge: "rgba(34, 211, 238, 0.35)" },
  light: { bg: "#f8fafc", edge: "rgba(8, 145, 178, 0.3)" },
};

const THEME_QUOTES: Record<AppTheme, { quote: string; eyebrow: string; tagline: string }> = {
  dark: {
    eyebrow: "// SYSTEM OVERRIDE — CYBERPUNK PROTOCOL",
    quote: "Talk is cheap. Show me the code.",
    tagline: "— Linus Torvalds • Dark Mode Activated",
  },
  light: {
    eyebrow: "// SILICON VALLEY — HIGH-CONTRAST LIGHT",
    quote: "Simplicity is the ultimate sophistication.",
    tagline: "— Leonardo da Vinci • Light Mode Activated",
  },
};

interface Tile {
  col: number;
  row: number;
  delay: number;
}

function computeRadialGrid(
  originX: number = window.innerWidth / 2,
  originY: number = window.innerHeight / 2
): { tiles: Tile[]; cols: number; rows: number } {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Base tile size from clamp(60px, 8vw, 100px)
  const baseSize = Math.max(65, Math.min(110, width * 0.085));

  // Cap total DOM nodes to ~72 tiles (e.g. 8x9 grid) to guarantee locked 60fps GPU physics
  const targetTotalTiles = 72;
  const area = width * height;
  const minSizeForTarget = Math.sqrt(area / targetTotalTiles);
  const tileSize = Math.max(baseSize, minSizeForTarget);

  const cols = Math.max(1, Math.ceil(width / tileSize));
  const rows = Math.max(1, Math.ceil(height / tileSize));
  const cellW = width / cols;
  const cellH = height / rows;

  let maxDist = 0;
  const withDistance: (Tile & { dist: number })[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileX = (col + 0.5) * cellW;
      const tileY = (row + 0.5) * cellH;
      const dist = Math.hypot(tileX - originX, tileY - originY);
      if (dist > maxDist) maxDist = dist;
      withDistance.push({ col, row, dist, delay: 0 });
    }
  }

  const tiles = withDistance.map(({ col, row, dist }) => ({
    col,
    row,
    delay: maxDist > 0 ? (dist / maxDist) * RIPPLE_SPREAD : 0,
  }));

  return { tiles, cols, rows };
}

function PixelGridOverlay({
  from,
  to,
  originX,
  originY,
  onSwap,
  onDone,
}: {
  from: AppTheme;
  to: AppTheme;
  originX: number;
  originY: number;
  onSwap: () => void;
  onDone: () => void;
}) {
  const [grid, setGrid] = useState<{ tiles: Tile[]; cols: number; rows: number } | null>(null);
  const [fading, setFading] = useState(false);
  const swappedRef = useRef(false);
  const [textStep, setTextStep] = useState<"from" | "to" | "none">("none");

  // Wait for mount before touching `window` so grid math never runs during SSR.
  useEffect(() => {
    const computed = computeRadialGrid(originX, originY);
    // One-time client-only measurement, not a response to changing React state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid(computed);

    // --- Simplified Theme Transition Timing ---
    // Show the arriving theme text immediately when the background flip starts
    // and hide it after a short display period, ensuring only one text is ever visible.
    // 1. Show arriving text and swap theme (at 0ms)
    const showTimer = setTimeout(() => {
      if (!swappedRef.current) {
        swappedRef.current = true;
        onSwap(); // swap background colors
      }
      setTextStep("to"); // display arriving text
    }, 0);

    // 2. Hide text after display duration (e.g., 1200ms)
    const hideTimer = setTimeout(() => {
      setTextStep("none");
    }, 1200);

    // 3. Fade out overlay after text disappears (e.g., 1400ms)
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1400);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(fadeTimer);
    };
    // onSwap is stable for the lifetime of a single transition instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originX, originY]);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(onDone, FADE_DURATION * 1000);
    return () => clearTimeout(t);
  }, [fading, onDone]);

  const handleSkip = () => {
    if (!swappedRef.current) {
      swappedRef.current = true;
      onSwap();
    }
    setTextStep("none");
    setFading(true);
  };

  if (!grid) return null;

  const fromSwatch = THEME_SWATCH[from];
  const toSwatch = THEME_SWATCH[to];
  const activeTheme = textStep === "to" ? to : from;
  const quoteData = THEME_QUOTES[activeTheme];

  return (
    <motion.div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] ${fading ? "pointer-events-none" : "pointer-events-auto cursor-pointer"}`}
      style={{ background: fromSwatch.bg }}
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
    >
      {/* 3D Fracturing Grid Tiles (Happens in background behind the text!) */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {grid.tiles.map((tile) => (
          <div key={`${tile.col}-${tile.row}`} className="pixel-tile-perspective">
            <motion.div
              className="preserve-3d relative h-full w-full"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{
                delay: tile.delay,
                duration: FLIP_DURATION,
                ease: "easeInOut",
              }}
            >
              {/* Front face — the theme we're leaving */}
              <div
                className="backface-hidden absolute inset-0 border"
                style={{ background: fromSwatch.bg, borderColor: fromSwatch.edge }}
              />
              {/* Back face — the theme we're arriving at */}
              <div
                className="backface-hidden absolute inset-0 border"
                style={{
                  background: toSwatch.bg,
                  borderColor: toSwatch.edge,
                  transform: "rotateY(180deg)",
                }}
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Theme Transition Bold Quote Overlay (Two-phase sequential choreography!) */}
      <AnimatePresence mode="wait">
        {textStep !== "none" && (
          <motion.div
            key={textStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18, ease: "easeInOut" } }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4 text-center select-none"
          >
            {/* Monospace Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(8px)", color: from === "dark" ? "#22d3ee" : "#0284c7" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", color: to === "dark" ? "#22d3ee" : "#0284c7" }}
              exit={{ opacity: 0, y: -15, scale: 0.95, filter: "blur(6px)", color: to === "dark" ? "#22d3ee" : "#0284c7", transition: { duration: 0.15, ease: "easeIn", delay: 0 } }}
              transition={{
                opacity: { duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 0.45, delay: 0.05, ease: "easeOut" },
                color: { duration: 0.6, delay: 0.15, ease: "easeInOut" },
              }}
              className="mb-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]"
            >
              {quoteData.eyebrow}
            </motion.p>

            {/* Main Bold Quote */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.85, rotateX: 25, y: 35, filter: "blur(12px)", color: from === "dark" ? "#ffffff" : "#0f172a" }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0, filter: "blur(0px)", color: to === "dark" ? "#ffffff" : "#0f172a" }}
              exit={{ opacity: 0, scale: 0.95, rotateX: -15, y: -20, filter: "blur(8px)", color: to === "dark" ? "#ffffff" : "#0f172a", transition: { duration: 0.15, ease: "easeIn", delay: 0.02 } }}
              transition={{
                opacity: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                rotateX: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                filter: { duration: 0.6, delay: 0.1, ease: "easeOut" },
                color: { duration: 0.6, delay: 0.15, ease: "easeInOut" },
              }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase max-w-5xl leading-none sm:leading-tight"
            >
              {quoteData.quote}
            </motion.h2>

            {/* Subtitle / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)", color: from === "dark" ? "#94a3b8" : "#64748b" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", color: to === "dark" ? "#94a3b8" : "#64748b" }}
              exit={{ opacity: 0, y: -15, filter: "blur(6px)", color: to === "dark" ? "#94a3b8" : "#64748b", transition: { duration: 0.15, ease: "easeIn", delay: 0.04 } }}
              transition={{
                opacity: { duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 0.45, delay: 0.2, ease: "easeOut" },
                color: { duration: 0.6, delay: 0.15, ease: "easeInOut" },
              }}
              className="mt-6 font-mono text-xs sm:text-sm tracking-widest uppercase"
            >
              {quoteData.tagline}
            </motion.p>

            {/* Skip Hint */}
            <motion.span
              initial={{ opacity: 0, color: activeTheme === "dark" ? "#94a3b8" : "#64748b" }}
              animate={{ opacity: 0.5, color: activeTheme === "dark" ? "#94a3b8" : "#64748b" }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{
                opacity: { duration: 0.45, delay: 0.3 },
              }}
              className="absolute bottom-8 right-8 font-mono text-[11px] tracking-wider uppercase"
            >
              [Click anywhere to skip]
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Controller: owns next-themes state + drives the overlay ── */

function PixelThemeController({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [transition, setTransition] = useState<{
    from: AppTheme;
    to: AppTheme;
    originX: number;
    originY: number;
  } | null>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    // Standard next-themes hydration-safety flag, not a response to state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | { clientX: number; clientY: number } | unknown) => {
      if (!mounted || animatingRef.current) return;

      const current: AppTheme = theme === "light" ? "light" : "dark";
      const next: AppTheme = current === "dark" ? "light" : "dark";

      let originX = window.innerWidth / 2;
      let originY = window.innerHeight / 2;
      if (
        event &&
        typeof event === "object" &&
        "clientX" in event &&
        "clientY" in event &&
        typeof (event as { clientX: unknown }).clientX === "number" &&
        typeof (event as { clientY: unknown }).clientY === "number"
      ) {
        originX = (event as { clientX: number }).clientX;
        originY = (event as { clientY: number }).clientY;
      }

      if (prefersReducedMotion) {
        setTheme(next);
        return;
      }

      // Suppress global CSS transitions on background elements during 3D GPU animation
      document.documentElement.classList.add("disable-global-transitions");

      animatingRef.current = true;
      setTransition({ from: current, to: next, originX, originY });
    },
    [mounted, theme, setTheme, prefersReducedMotion]
  );

  const handleSwap = useCallback(() => {
    if (transition) setTheme(transition.to);
  }, [transition, setTheme]);

  const handleDone = useCallback(() => {
    animatingRef.current = false;
    document.documentElement.classList.remove("disable-global-transitions");
    setTransition(null);
  }, []);

  const value = useMemo<PixelThemeContextValue>(
    () => ({
      theme: mounted ? (theme === "light" ? "light" : "dark") : undefined,
      toggleTheme,
      mounted,
    }),
    [mounted, theme, toggleTheme]
  );

  return (
    <PixelThemeContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {transition && (
          <PixelGridOverlay
            key="pixel-theme-overlay"
            from={transition.from}
            to={transition.to}
            originX={transition.originX}
            originY={transition.originY}
            onSwap={handleSwap}
            onDone={handleDone}
          />
        )}
      </AnimatePresence>
    </PixelThemeContext.Provider>
  );
}

/**
 * Wraps the app with next-themes + a radial "pixel chip flip" transition:
 * on toggle, a grid of 3D tiles fractures across the screen and flips from
 * the old theme's color to the new one, propagating outward from the
 * screen's center using `Math.hypot` distance-based delays, before the real
 * `next-themes` state swaps underneath and the overlay fades away.
 */
export function PixelTransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={["dark", "light"]}>
      <PixelThemeController>{children}</PixelThemeController>
    </NextThemesProvider>
  );
}
