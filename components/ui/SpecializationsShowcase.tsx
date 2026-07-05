"use client";

import { motion } from "framer-motion";
import { Network, Cpu, Activity, Server, Database, HeartPulse, ArrowUpRight } from "lucide-react";

interface SpecializationCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  gradient: string;
  visualType: "network" | "signal" | "health";
}

const SPECIALIZATIONS: SpecializationCard[] = [
  {
    id: "net-centric",
    title: "Net-Centric Applications",
    subtitle: "Distributed Systems & Cloud Architecture",
    description:
      "Architecting resilient network protocols, high-concurrency distributed web ecosystems, microservices, and low-latency API infrastructures designed for massive enterprise scale.",
    icon: <Network className="h-6 w-6 text-cyan-400" />,
    tags: ["Distributed Web", "Cloud Infra", "API Ecosystems", "Microservices", "WebSockets"],
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    visualType: "network",
  },
  {
    id: "data-science",
    title: "Data Science & Engineering",
    subtitle: "Big Data, ML & Signal Processing",
    description:
      "Building predictive data pipelines, numerical feature extraction models, and advanced audio/digital signal processing algorithms using Python, NumPy, and MATLAB.",
    icon: <Cpu className="h-6 w-6 text-violet-400" />,
    tags: ["Signal Processing", "Predictive ML", "NumPy & MATLAB", "Feature Extraction", "Big Data"],
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    visualType: "signal",
  },
  {
    id: "health-informatics",
    title: "Business & Health Informatics",
    subtitle: "Clinical Systems & Enterprise Workflow",
    description:
      "Bridging complex business logic with mission-critical healthcare data systems, optimizing clinical data interoperability, electronic health records (EHR), and decision support.",
    icon: <Activity className="h-6 w-6 text-fuchsia-400" />,
    tags: ["Healthcare Data", "Clinical Workflows", "EHR Systems", "Business Logic", "Interoperability"],
    gradient: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
    visualType: "health",
  },
];

export function SpecializationsShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {SPECIALIZATIONS.map((spec, idx) => (
        <motion.div
          key={spec.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
          whileHover={{ y: -6 }}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/80 p-7 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_10px_40px_rgba(34,211,238,0.18)]"
        >
          {/* Ambient Corner Gradient Glow */}
          <div
            className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${spec.gradient} blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60`}
          />

          <div>
            {/* Header Icon & Badge */}
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-inner transition-transform duration-300 group-hover:scale-110">
                {spec.icon}
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-muted transition-colors group-hover:border-cyan-400/30 group-hover:text-cyan-400">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {/* Titles */}
            <div className="mt-6">
              <p
                className="text-xs uppercase tracking-[0.2em] text-[var(--accent-primary)] font-mono"
              >
                {spec.subtitle}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                {spec.title}
              </h3>
            </div>

            {/* Interactive Visual Graphic Box */}
            <div className="my-6 flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-4 shadow-inner">
              {spec.visualType === "network" && <NetworkVisual />}
              {spec.visualType === "signal" && <SignalVisual />}
              {spec.visualType === "health" && <HealthVisual />}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted group-hover:text-gray-300 transition-colors">
              {spec.description}
            </p>
          </div>

          {/* Tech Tags Footer */}
          <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/5">
            {spec.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs font-medium text-gray-400 transition-colors group-hover:border-cyan-400/20 group-hover:bg-cyan-500/10 group-hover:text-cyan-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Interactive Visual Indicators ── */

function NetworkVisual() {
  return (
    <div className="relative flex w-full items-center justify-around">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
          <Server className="h-4 w-4" />
        </span>
        <span className="h-0.5 w-8 bg-gradient-to-r from-cyan-500 to-violet-500 animate-pulse" />
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          <Network className="h-5 w-5" />
        </span>
        <span className="h-0.5 w-8 bg-gradient-to-r from-violet-500 to-cyan-500 animate-pulse" />
        <span className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
          <Database className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function SignalVisual() {
  return (
    <div className="flex h-full w-full items-end justify-center gap-1.5 pb-2">
      {[40, 70, 30, 90, 60, 100, 50, 80, 45, 85, 35, 75, 55].map((height, i) => (
        <motion.div
          key={i}
          animate={{ height: [`${height * 0.4}%`, `${height}%`, `${height * 0.4}%`] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          className="w-1.5 rounded-full bg-gradient-to-t from-violet-600 via-purple-400 to-cyan-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        />
      ))}
    </div>
  );
}

function HealthVisual() {
  return (
    <div className="relative flex w-full items-center justify-center gap-3">
      <div className="flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.4)]">
        <HeartPulse className="h-5 w-5" />
      </div>
      <div className="flex-1 overflow-hidden">
        {/* Animated ECG Pulse Waveform representation */}
        <svg className="h-12 w-full stroke-fuchsia-400" viewBox="0 0 150 40" fill="none">
          <motion.path
            d="M0 20 H30 L40 5 L50 35 L60 10 L70 25 L80 20 H150"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
