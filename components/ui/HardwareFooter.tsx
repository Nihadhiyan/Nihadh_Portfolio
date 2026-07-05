"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, GitBranch, Terminal, ShieldCheck, Cpu, Zap, Activity } from "lucide-react";
import { SiWhatsapp, SiGithub, SiMedium } from "react-icons/si";
import { RxLinkedinLogo } from "react-icons/rx";
import { siteConfig } from "@/config/site";

interface DataPort {
  id: string;
  name: string;
  protocol: string;
  href: string;
  icon: React.ElementType;
  glowColor: string;
  voltageClass: string;
}

const DATA_PORTS: DataPort[] = [
  {
    id: "PORT_01",
    name: "GitHub",
    protocol: "GIT // REPO",
    href: siteConfig.socials.github,
    icon: SiGithub,
    glowColor: "#22d3ee",
    voltageClass:
      "group-hover:border-cyan-400 group-hover:bg-cyan-500/20 group-hover:shadow-[inset_0_0_20px_rgba(34,211,238,0.6),0_0_25px_rgba(34,211,238,0.5)] group-hover:text-cyan-300",
  },
  {
    id: "PORT_02",
    name: "LinkedIn",
    protocol: "NET // COMM",
    href: siteConfig.socials.linkedin,
    icon: RxLinkedinLogo,
    glowColor: "#8b5cf6",
    voltageClass:
      "group-hover:border-violet-400 group-hover:bg-violet-500/20 group-hover:shadow-[inset_0_0_20px_rgba(139,92,246,0.6),0_0_25px_rgba(139,92,246,0.5)] group-hover:text-violet-300",
  },
  {
    id: "PORT_03",
    name: "Medium",
    protocol: "LOG // DATA",
    href: siteConfig.socials.medium,
    icon: SiMedium,
    glowColor: "#10b981",
    voltageClass:
      "group-hover:border-emerald-400 group-hover:bg-emerald-500/20 group-hover:shadow-[inset_0_0_20px_rgba(16,185,129,0.6),0_0_25px_rgba(16,185,129,0.5)] group-hover:text-emerald-300",
  },
  {
    id: "PORT_04",
    name: "Email",
    protocol: "SMTP // MAIL",
    href: siteConfig.contact.emailMailto,
    icon: Mail,
    glowColor: "#38bdf8",
    voltageClass:
      "group-hover:border-sky-400 group-hover:bg-sky-500/20 group-hover:shadow-[inset_0_0_20px_rgba(56,189,248,0.6),0_0_25px_rgba(56,189,248,0.5)] group-hover:text-sky-300",
  },
  {
    id: "PORT_05",
    name: "WhatsApp",
    protocol: "CHAT // LINK",
    href: siteConfig.contact.whatsappUrl,
    icon: SiWhatsapp,
    glowColor: "#25d366",
    voltageClass:
      "group-hover:border-green-400 group-hover:bg-green-500/20 group-hover:shadow-[inset_0_0_20px_rgba(37,211,102,0.6),0_0_25px_rgba(37,211,102,0.5)] group-hover:text-green-300",
  },
];

export function HardwareFooter() {
  const [localTime, setLocalTime] = useState<string>("CALIBRATING CLOCK...");
  const [latency, setLatency] = useState<number>(12);

  /* Client-side dynamic telemetry clock to avoid hydration errors */
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLocalTime(`${formatted} // LOCAL_SYNC`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    /* Subtle simulated latency jitter */
    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 5) + 11);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(latencyInterval);
    };
  }, []);

  return (
    <footer className="relative z-10 w-full overflow-hidden border-t border-white/15 bg-[#02040A] py-16 px-6 sm:px-12 lg:px-24 text-white select-none">
      {/* Background Cybernetic Chassis Grid Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[2px] w-3/4 max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent shadow-[0_0_15px_#22d3ee]" />

      <div className="mx-auto max-w-7xl xl:max-w-[1500px]">
        {/* Chassis Section Title Header */}
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Cpu className="h-4 w-4 animate-spin" style={{ animationDuration: "12s" }} />
            <span>HARDWARE I/O DOCK // CHASSIS REV-4</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>Z-AXIS BASELINE GROUNDED</span>
          </div>
        </div>

        {/* Responsive 3-Column Chassis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          
          {/* ── COLUMN 1: SYSTEM TELEMETRY ── */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#060a14]/90 p-6 backdrop-blur-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.05),0_10px_25px_rgba(0,0,0,0.7)]">
            <div className="space-y-4">
              {/* Telemetry Status Bar */}
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </span>
                  <span className="tracking-widest">SYSTEM UPLINK SECURED</span>
                </div>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>

              {/* Monospace Telemetry Readout Box */}
              <div className="rounded-xl border border-white/10 bg-[#02040a] p-4 font-mono text-xs space-y-2.5 text-gray-300 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">LOCAL TIME:</span>
                  <span className="text-cyan-300 font-semibold">{localTime}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">RUNTIME:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span>OPTIMAL // 99.99%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">LATENCY:</span>
                  <span className="text-white font-semibold">{latency}ms // DIRECT NODE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ENCRYPTION:</span>
                  <span className="text-violet-300 font-semibold">AES-256-GCM // ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
              <span>TELEMETRY FEED</span>
              <span>NODE: LK-UOK-01</span>
            </div>
          </div>

          {/* ── COLUMN 2: DATA I/O PORTS ── */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#060a14]/90 p-6 backdrop-blur-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.05),0_10px_25px_rgba(0,0,0,0.7)]">
            <div className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>DATA I/O PORTS</span>
                </div>
                <span className="text-[10px] text-muted-foreground">5 PORTS ONLINE</span>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                Hover to trigger voltage spike; click to establish direct communication channel.
              </p>

              {/* Glassmorphism Square Data Ports Grid */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3 pt-2">
                {DATA_PORTS.map((port) => {
                  const Icon = port.icon;
                  return (
                    <motion.a
                      key={port.id}
                      href={port.href}
                      target={port.href.startsWith("http") ? "_blank" : undefined}
                      rel={port.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      title={`${port.name} (${port.protocol})`}
                      /* Physical Depression Physics */
                      whileHover={{ scale: 0.92, y: 3 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`group relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] p-2 backdrop-blur-md transition-colors duration-200 cursor-pointer ${port.voltageClass}`}
                    >
                      {/* Port Number Indicator */}
                      <span className="absolute top-1 left-1.5 font-mono text-[8px] text-muted-foreground/60 group-hover:text-white/90 font-bold transition-colors">
                        {port.id.split("_")[1]}
                      </span>

                      {/* Icon */}
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300 transition-transform duration-300 group-hover:scale-110" />

                      {/* Mini Port Name */}
                      <span className="font-mono text-[9px] font-extrabold uppercase tracking-tight text-muted-foreground group-hover:text-white transition-colors truncate w-full text-center">
                        {port.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
              <span>PROTOCOL: HIGH-SPEED I/O</span>
              <span className="text-cyan-400 font-semibold animate-pulse">VOLTAGE READY</span>
            </div>
          </div>

          {/* ── COLUMN 3: THE MANUFACTURER PLATE ── */}
          <div className="flex flex-col justify-between">
            {/* Engraved Metal Manufacturer Plate */}
            <div className="relative flex-1 flex flex-col justify-center rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.15),0_15px_35px_rgba(0,0,0,0.8)]">
              
              {/* 4 Corner Bolted Chassis Screws */}
              <span className="absolute top-3 left-3 h-2.5 w-2.5 rounded-full border border-white/30 bg-[#02040A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full border border-white/30 bg-[#02040A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
              <span className="absolute bottom-3 left-3 h-2.5 w-2.5 rounded-full border border-white/30 bg-[#02040A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
              <span className="absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full border border-white/30 bg-[#02040A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />

              {/* Plate Header */}
              <div className="mb-4 flex items-center justify-center gap-2 border-b border-white/10 pb-3 font-mono text-xs font-black tracking-[0.3em] text-cyan-400 uppercase text-center">
                <Terminal className="h-4 w-4 shrink-0" />
                <span>MANUFACTURER SPEC PLATE</span>
              </div>

              {/* Engraved Monospace Specification Lines */}
              <div className="space-y-3 font-mono text-xs sm:text-sm font-extrabold tracking-wider text-gray-200 py-2">
                <div className="flex items-center justify-between rounded bg-black/40 px-3 py-2 border border-white/5">
                  <span className="text-muted-foreground">ENGINEERED BY:</span>
                  <span className="text-cyan-300 font-black tracking-widest">NIHADH</span>
                </div>

                <div className="flex items-center justify-between rounded bg-black/40 px-3 py-2 border border-white/5">
                  <span className="text-muted-foreground">CORE ARCH:</span>
                  <span className="text-violet-300 font-black tracking-widest">LARMORA SYSTEMS</span>
                </div>

                <div className="flex items-center justify-between rounded bg-black/40 px-3 py-2 border border-white/5">
                  <span className="text-muted-foreground">STATUS:</span>
                  <span className="text-emerald-400 font-black tracking-widest">
                    ALL SYSTEMS NOMINAL
                  </span>
                </div>
              </div>

              {/* Copyright & Serial Barcode Simulation */}
              <div className="mt-6 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="font-bold">
                  © {new Date().getFullYear()} // ALL RIGHTS RESERVED
                </span>
                <span className="tracking-[0.25em] font-extrabold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  ||| |||| | ||||| ||
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Absolute Bottom Edge Branding */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-xs text-muted-foreground/60">
          <p>
            CYBERNETIC PORTFOLIO // DESIGNED &amp; DEVELOPED FOR HIGH-PERFORMANCE NET-CENTRIC COMPUTING
          </p>
          <div className="flex items-center gap-3">
            <span>CHASSIS ID: LARMORA-MK4</span>
            <span>•</span>
            <span className="text-cyan-400/80">TERMINAL ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
