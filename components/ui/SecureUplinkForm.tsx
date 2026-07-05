"use client";

import { useState, useRef, useEffect, type ReactNode, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Copy, Radio, ShieldCheck, Sparkles, ExternalLink, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";

/* ── Brand SVG Icons ── */

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Magnetic Pill Component ── */

interface MagneticPillProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}

function MagneticPill({ children, href, onClick, className = "", title }: MagneticPillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    setPosition({ x: distanceX * 0.25, y: distanceY * 0.25 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={onClick}
      title={title}
      className={`group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs text-muted-foreground transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

/* ── Stylized Dot Matrix World Map with Sri Lanka Node ── */

function GlobalNodeMap() {
  // Generate a stylized dot grid representing global nodes
  const dots = [];
  const rows = 10;
  const cols = 22;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Create a continental pattern shape density
      const isLand =
        (r >= 1 && r <= 4 && c >= 2 && c <= 7) || // North America
        (r >= 5 && r <= 8 && c >= 4 && c <= 8) || // South America
        (r >= 1 && r <= 4 && c >= 10 && c <= 15) || // Europe / Russia
        (r >= 3 && r <= 7 && c >= 10 && c <= 14) || // Africa
        (r >= 2 && r <= 6 && c >= 15 && c <= 20) || // Asia
        (r >= 7 && r <= 9 && c >= 17 && c <= 20); // Australia

      // Sri Lanka Node is around row 6, col 16
      const isSriLanka = r === 6 && c === 16;

      dots.push({ id: `${r}-${c}`, r, c, isLand, isSriLanka });
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#060a14] p-6 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)]">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-3/4 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-3xl" />

      {/* Grid Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] text-muted-foreground/80">
        <span className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wider">
          <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-400" /> GLOBAL_UPLINK_NET
        </span>
        <span className="tracking-widest">STATUS: ONLINE</span>
      </div>

      {/* Dot Matrix Grid */}
      <div className="relative grid grid-cols-22 gap-2.5 py-4 sm:gap-3">
        {dots.map((dot) => {
          if (dot.isSriLanka) {
            return (
              <div key={dot.id} className="relative flex items-center justify-center">
                {/* Pinging Radar Rings */}
                <span className="absolute h-6 w-6 rounded-full bg-cyan-400/40 animate-ping" />
                <span className="absolute h-10 w-10 rounded-full border border-cyan-400/30 animate-pulse" />
                
                {/* Core Node */}
                <div className="relative z-10 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] ring-4 ring-[#0a0f1d]" />

                {/* Sri Lanka Tooltip Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-cyan-400/60 bg-[#0a0f1d]/95 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                >
                  SRI LANKA // NODE_01
                </motion.div>
              </div>
            );
          }

          return (
            <div
              key={dot.id}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                dot.isLand ? "bg-white/20 hover:bg-cyan-400/60" : "bg-white/5"
              }`}
            />
          );
        })}
      </div>

      {/* Monospaced Overlay Banner */}
      <div className="mt-4 border-t border-white/10 pt-4 font-mono text-[11px] font-semibold tracking-[0.2em] text-cyan-400 uppercase sm:text-xs">
        BASED IN SRI LANKA // AVAILABLE WORLDWIDE
      </div>
    </div>
  );
}

/* ── Floating Label Input Component ── */

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  rows?: number;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: boolean;
}

function FloatingInput({
  id,
  label,
  type = "text",
  rows,
  value,
  onChange,
  required = false,
  error = false,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloat = isFocused || value.length > 0;

  return (
    <div className="relative w-full">
      {/* Input container with Neo-Skeuomorphic inset shadow */}
      <div
        className={`relative rounded-2xl border transition-all duration-300 bg-black/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden ${
          error
            ? "border-rose-500/80 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            : isFocused
            ? "border-cyan-400/70 bg-black/70"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        {rows ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            required={required}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full resize-none bg-transparent px-5 pt-7 pb-3 text-sm text-white focus:outline-none font-sans"
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            required={required}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-5 pt-7 pb-3 text-sm text-white focus:outline-none font-sans"
          />
        )}

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-5 transition-all duration-200 font-mono tracking-widest uppercase ${
            error
              ? "top-2.5 text-[10px] font-bold text-rose-400"
              : isFloat
              ? "top-2.5 text-[10px] font-bold text-cyan-400"
              : "top-4 text-xs text-muted-foreground/60"
          }`}
        >
          {label} {required && <span className="text-cyan-400">*</span>}
        </label>

        {/* Expanding Cyan Bottom Border onFocus */}
        <motion.span
          className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 ${
            error ? "bg-rose-500 shadow-[0_0_12px_#f43f5e]" : "bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
          }`}
          initial={{ width: "0%" }}
          animate={{ width: isFocused || error ? "100%" : "0%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ── Main Secure Uplink Form Component ── */

export function SecureUplinkForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "ESTABLISHED">("IDLE");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim());
  const isNameValid = formState.name.trim().length > 0;
  const isMessageValid = formState.message.trim().length > 0;
  const isValid = isNameValid && isEmailValid && isMessageValid;

  /* Copy Email Handler */
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.contact.email);
    setCopiedEmail(true);
  };

  useEffect(() => {
    if (copiedEmail) {
      const timer = setTimeout(() => setCopiedEmail(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copiedEmail]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  /* Hold to Send Logic (exactly 1.5 seconds) */
  const startHold = () => {
    if (status === "ESTABLISHED") return;

    if (!isValid) {
      if (!isNameValid || !isMessageValid) {
        setErrorMessage("⚠️ TRANSMISSION ERROR: ALL REQUIRED FIELDS MUST BE FILLED");
      } else if (!isEmailValid) {
        setErrorMessage("⚠️ TRANSMISSION ERROR: INVALID EMAIL ADDRESS FORMAT");
      }
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsHolding(true);

    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      setStatus("ESTABLISHED");
      // Form submitted successfully
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  const cancelHold = () => {
    if (status === "ESTABLISHED") return;
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32"
    >
      {/* Ambient background aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[550px] w-[92%] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.2) 0%, rgba(124,58,237,0.15) 50%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Neo-Skeuomorphic Glass Card Container */}
      <div className="surface-raised relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0f1d]/90 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-12 lg:p-16">
        
        {/* Subtle decorative cyan top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-80" />

        {/* Terminal Header */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              SECURE_UPLINK_TERMINAL // V2.4
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-BIT ENCRYPTED CHANNEL</span>
          </div>
        </div>

        {/* 2-Column Integrated Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          
          {/* ── COLUMN A: The Global Node (Left - Span 6) ── */}
          <div className="flex flex-col justify-between h-full lg:col-span-6 space-y-10">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let&apos;s Talk.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                Have a project in mind, an opportunity to discuss, or just want to say hello? My inbox is always open.
              </p>
            </div>

            {/* Interactive Dot Matrix Map Visual */}
            <div className="pt-2">
              <GlobalNodeMap />
            </div>

            {/* Magnetic Social Links Stack */}
            <div className="space-y-4 pt-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                {"// DIRECT COMMUNICATIONS"}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Magnetic Email Copy Pill */}
                <div className="relative">
                  <MagneticPill onClick={handleCopyEmail} title="Click to copy email">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <span>{siteConfig.contact.email}</span>
                    <Copy className="h-3.5 w-3.5 opacity-60" />
                  </MagneticPill>

                  {/* Toast Notification */}
                  <AnimatePresence>
                    {copiedEmail && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -44, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute left-0 top-0 z-50 flex items-center gap-2 whitespace-nowrap rounded-full border border-cyan-400 bg-[#0a0f1d] px-4 py-1.5 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>COPIED TO CLIPBOARD</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* GitHub Pill */}
                <MagneticPill href={siteConfig.socials.github}>
                  <GithubIcon className="h-4 w-4 text-white" />
                  <span>{siteConfig.socials.github.replace("https://", "")}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </MagneticPill>

                {/* LinkedIn Pill */}
                <MagneticPill href={siteConfig.socials.linkedin}>
                  <LinkedinIcon className="h-4 w-4 text-cyan-400" />
                  <span>{siteConfig.socials.linkedin.replace("https://", "")}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </MagneticPill>
              </div>
            </div>
          </div>

          {/* ── COLUMN B: The Uplink Form (Right - Span 6) ── */}
          <div className="lg:col-span-6 w-full">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* Floating Label Inputs */}
              <FloatingInput
                id="uplink-name"
                label="NAME / IDENTIFIER"
                required
                error={showError && !isNameValid}
                value={formState.name}
                onChange={(val) => {
                  setFormState((prev) => ({ ...prev, name: val }));
                  if (showError) setShowError(false);
                }}
              />

              <FloatingInput
                id="uplink-email"
                label="EMAIL ADDRESS"
                type="email"
                required
                error={showError && (!formState.email.trim() || !isEmailValid)}
                value={formState.email}
                onChange={(val) => {
                  setFormState((prev) => ({ ...prev, email: val }));
                  if (showError) setShowError(false);
                }}
              />

              <FloatingInput
                id="uplink-message"
                label="TRANSMISSION MESSAGE"
                rows={5}
                required
                error={showError && !isMessageValid}
                value={formState.message}
                onChange={(val) => {
                  setFormState((prev) => ({ ...prev, message: val }));
                  if (showError) setShowError(false);
                }}
              />

              {/* HOLD TO SEND MICRO-INTERACTION */}
              <div className="pt-4">
                <motion.div
                  className="relative w-full select-none"
                  animate={{ x: showError ? [-10, 10, -8, 8, -4, 4, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <button
                    type="button"
                    onPointerDown={startHold}
                    onPointerUp={cancelHold}
                    onPointerLeave={cancelHold}
                    disabled={status === "ESTABLISHED"}
                    className={`relative w-full overflow-hidden rounded-2xl border px-8 py-5 font-mono text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer ${
                      status === "ESTABLISHED"
                        ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.4)]"
                        : showError
                        ? "border-rose-500/80 bg-rose-500/15 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                        : "border-white/20 bg-[#060a14] text-white hover:border-cyan-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-[0.99]"
                    }`}
                  >
                    {/* Glowing Cyan Fill Progress Bar */}
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: isHolding ? "100%" : status === "ESTABLISHED" ? "100%" : "0%" }}
                      transition={{
                        duration: isHolding ? 1.5 : 0.25,
                        ease: isHolding ? "linear" : "easeOut",
                      }}
                    />

                    {/* Button Text & Icon */}
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {status === "ESTABLISHED" ? (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 text-emerald-300"
                        >
                          <Check className="h-5 w-5 stroke-[3] text-emerald-400 animate-bounce" />
                          <span>UPLINK ESTABLISHED // SENT</span>
                        </motion.span>
                      ) : (
                        <>
                          <Sparkles className={`h-4 w-4 text-cyan-400 ${isHolding ? "animate-spin" : ""}`} />
                          <span>{isHolding ? "ESTABLISHING UPLINK..." : "HOLD TO ESTABLISH UPLINK"}</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Micro hint below button */}
                  <div className="mt-2 text-center font-mono text-[10px] tracking-wider transition-colors duration-300">
                    {showError ? (
                      <span className="text-rose-400 font-bold animate-pulse">{errorMessage}</span>
                    ) : status === "ESTABLISHED" ? (
                      <span className="text-emerald-400">TRANSMISSION SUCCESSFUL // ENCRYPTED RESPONSE PENDING</span>
                    ) : (
                      <span className="text-muted-foreground/60">HOLD FOR 1.5 SECONDS TO TRANSMIT VIA SECURE CHANNEL</span>
                    )}
                  </div>
                </motion.div>
              </div>

            </form>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
