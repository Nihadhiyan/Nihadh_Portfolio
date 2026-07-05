"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, Sparkles, Terminal, ArrowUpRight } from "lucide-react";
import { SiMedium } from "react-icons/si";
import { RxLinkedinLogo } from "react-icons/rx";
import { siteConfig } from "@/config/site";

interface SocialDockItem {
  label: string;
  href: string;
  icon: React.ElementType;
  tag: string;
  glowClass: string;
}

const SOCIAL_DOCK: SocialDockItem[] = [
  {
    label: "GitHub",
    href: siteConfig.socials.github,
    icon: GitBranch,
    tag: "// REPOSITORIES",
    glowClass:
      "hover:border-cyan-400/80 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]",
  },
  {
    label: "LinkedIn",
    href: siteConfig.socials.linkedin,
    icon: RxLinkedinLogo,
    tag: "// NETWORK_UPLINK",
    glowClass:
      "hover:border-violet-400/80 hover:bg-violet-500/10 hover:text-violet-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]",
  },
  {
    label: "Medium",
    href: siteConfig.socials.medium,
    icon: SiMedium,
    tag: "// DATA_TREATISES",
    glowClass:
      "hover:border-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]",
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-[#040711] py-16 px-6 sm:px-12 lg:px-24">
      {/* Background Cybernetic Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/10 via-violet-500/15 to-cyan-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl xl:max-w-[1500px] flex flex-col gap-12">
        {/* Top Section: Wordmark & Cybernetic Social Dock */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Identity & Mission */}
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
              <Terminal className="h-4 w-4" />
              <span>SYSTEM ARCHIVE // COMM_DOCK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {siteConfig.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-md">
              {siteConfig.title}
            </p>
          </div>

          {/* Social Dock Cluster */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>ESTABLISH DIRECT CHANNEL</span>
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_DOCK.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 font-mono text-xs font-bold text-white backdrop-blur-xl transition-all duration-300 ${item.glowClass}`}
                  >
                    <Icon className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                    <span>{item.label}</span>
                    <span className="hidden sm:inline-block text-[10px] text-muted-foreground/70 group-hover:text-white/80 transition-colors">
                      {item.tag}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteConfig.name.toUpperCase()} // ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 backdrop-blur-md shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </span>
            <span className="text-[11px] font-bold text-gray-300">
              SYSTEM STATUS: OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
