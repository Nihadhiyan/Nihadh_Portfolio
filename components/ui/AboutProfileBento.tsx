"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Code2, MapPin, GraduationCap, Globe, CheckCircle2 } from "lucide-react";
import { WhoamiConsole } from "@/components/ui/WhoamiConsole";

export function AboutProfileBento() {
  const [activeTab, setActiveTab] = useState<"profile" | "academics" | "focus">("profile");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* ── Card 1: Main Narrative & Identity (Spans 2 cols on desktop) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 lg:col-span-2"
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-transparent blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

        <div>
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for Internships & Collaborations
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              Colombo, Sri Lanka • UTC+5:30
            </div>
          </div>

          {/* Headline */}
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-snug">
            Bridging <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Net-Centric Architecture</span> with Intelligent Systems.
          </h3>

          {/* Rich Bio Paragraphs */}
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            <p>
              I am Nihad Nilabdeen, a 3rd-year Software Engineering Undergraduate at the{" "}
              <span className="font-semibold text-white">University of Kelaniya (UoK)</span>, Sri Lanka. My passion lies in engineering robust systems from the ground up — whether designing high-concurrency web services, building data pipelines, or diving into hardware signal processing.
            </p>
            <p>
              I specialize across three core pillars:{" "}
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-300 font-mono text-xs border border-cyan-500/20">Net-Centric Applications</span>,{" "}
              <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-violet-300 font-mono text-xs border border-violet-500/20">Data Science & Engineering</span>, and{" "}
              <span className="rounded bg-fuchsia-500/10 px-1.5 py-0.5 text-fuchsia-300 font-mono text-xs border border-fuchsia-500/20">Business & Health Informatics</span>.
            </p>
          </div>
        </div>

        {/* Feature Highlights Footer */}
        <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/5 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" /> Full-Stack Architecture
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" /> Signal Processing & ML
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300 col-span-2 sm:col-span-1">
            <CheckCircle2 className="h-4 w-4 text-fuchsia-400 shrink-0" /> Clinical EHR Systems
          </div>
        </div>
      </motion.div>

      {/* ── Card 2: Interactive Diagnostics Console ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div>
          {/* Console Header Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <Terminal className="h-4 w-4" /> System Readout
            </div>
            <div className="flex gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/5">
              {(["profile", "academics", "focus"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                    activeTab === tab
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                      : "text-muted hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Console Content */}
          <div className="mt-4">
            {activeTab === "profile" && (
              <WhoamiConsole
                command="whoami --verbose"
                fields={[
                  { label: "NAME", value: "Nihad Nilabdeen" },
                  { label: "ROLE", value: "Software Engineer (Y3)" },
                  { label: "LOCATION", value: "Colombo, Sri Lanka" },
                  { label: "LANGUAGES", value: "English, Sinhala" },
                  { label: "STATUS", value: "Active / Building" },
                ]}
              />
            )}
            {activeTab === "academics" && (
              <WhoamiConsole
                command="whoami --academics"
                fields={[
                  { label: "DEGREE", value: "B.Sc. (Hons) Software Eng." },
                  { label: "UNIVERSITY", value: "University of Kelaniya" },
                  { label: "YEAR", value: "3rd Year Undergraduate" },
                  { label: "RESEARCH", value: "RFID / Signal Processing" },
                  { label: "FOCUS", value: "Systems Architecture" },
                ]}
              />
            )}
            {activeTab === "focus" && (
              <WhoamiConsole
                command="whoami --focus"
                fields={[
                  { label: "PILLAR 01", value: "Net-Centric Applications" },
                  { label: "PILLAR 02", value: "Data Science & Engineering" },
                  { label: "PILLAR 03", value: "Health Informatics & EHR" },
                  { label: "TECH STACK", value: "Next.js, Python, TS, Three.js" },
                ]}
              />
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-black/40 p-3 text-center text-[11px] font-mono text-muted">
          Click console to skip typing • Type <span className="text-cyan-400">&apos;help&apos;</span> or hover interactive elements.
        </div>
      </motion.div>

      {/* ── Card 3: Key Engineering Metrics Counter (1 Col) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-7 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-violet-400/40"
      >
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-violet-500/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
            {"// Impact Metrics"}
          </span>
          <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
        </div>

        <div className="my-6 grid grid-cols-3 gap-4 text-center divide-x divide-white/10">
          <div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">03+</div>
            <div className="mt-1 text-[11px] text-muted leading-tight">Years Coding</div>
          </div>
          <div className="pl-2">
            <div className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tight">10+</div>
            <div className="mt-1 text-[11px] text-muted leading-tight">Systems Built</div>
          </div>
          <div className="pl-2">
            <div className="text-3xl font-extrabold text-fuchsia-300 font-mono tracking-tight">03</div>
            <div className="mt-1 text-[11px] text-muted leading-tight">Core Pillars</div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-gray-400 flex items-center justify-between">
          <span>Continuous learning & building</span>
          <Code2 className="h-4 w-4 text-cyan-400" />
        </div>
      </motion.div>

      {/* ── Card 4: Academic Identity & Globe (Spans 2 cols on desktop) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/90 p-7 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 lg:col-span-2"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-400 shadow-inner">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">University of Kelaniya (UoK)</h4>
              <p className="text-xs text-muted font-mono">B.Sc. (Hons) in Software Engineering • Sri Lanka</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-gray-300">
            <Globe className="h-4 w-4 text-cyan-400" /> Bilingual: English & Sinhala
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs text-muted font-mono">
          <span>Focusing on scalable software architectures & data-driven healthcare systems.</span>
          <span className="text-cyan-300 font-semibold">EST. 2024 — PRESENT</span>
        </div>
      </motion.div>
    </div>
  );
}
