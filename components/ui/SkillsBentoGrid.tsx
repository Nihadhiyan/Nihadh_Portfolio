"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiSpringboot,
  SiMysql,
  SiDocker,
  SiPhp,
  SiApachekafka,
  SiKotlin,
  SiEspressif,
  SiLangchain,
  SiStripe,
  SiCplusplus,
} from "react-icons/si";
import { Database, Cpu, Layers, Terminal, ArrowUpRight } from "lucide-react";

export type CategoryKey = "FRONTEND" | "BACKEND" | "SPECIALIZED";

export interface SkillItem {
  name: string;
  category: CategoryKey;
  description: string;
  icon: React.ReactNode;
  spanClass: string;
  badge: string;
  color: string;
  borderColor: string;
}

const SKILL_DATA: SkillItem[] = [
  // ── FRONTEND ──
  {
    name: "Next.js",
    category: "FRONTEND",
    description: "App Router, server components, edge rendering & SEO optimization.",
    icon: <SiNextdotjs className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Framework",
    color: "text-white",
    borderColor: "group-hover:border-white/50",
  },
  {
    name: "React",
    category: "FRONTEND",
    description: "Component architecture, custom hooks & reactive state management.",
    icon: <SiReact className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "UI Library",
    color: "text-[#61DAFB]",
    borderColor: "group-hover:border-[#61DAFB]/50",
  },
  {
    name: "TypeScript",
    category: "FRONTEND",
    description: "End-to-end static typing, generics & scalable codebases.",
    icon: <SiTypescript className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Type Safety",
    color: "text-[#3178C6]",
    borderColor: "group-hover:border-[#3178C6]/50",
  },
  {
    name: "Tailwind CSS",
    category: "FRONTEND",
    description: "Utility-first design systems, custom animations & responsive layouts.",
    icon: <SiTailwindcss className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Design System",
    color: "text-[#38B2AC]",
    borderColor: "group-hover:border-[#38B2AC]/50",
  },
  {
    name: "Framer Motion",
    category: "FRONTEND",
    description: "Declarative physics-based animations, layout transitions & gestures.",
    icon: <SiFramer className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Animation",
    color: "text-indigo-400",
    borderColor: "group-hover:border-indigo-400/50",
  },
  {
    name: "JavaScript",
    category: "FRONTEND",
    description: "ES6+, async patterns & DOM-driven interactive interfaces.",
    icon: <SiJavascript className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Core Language",
    color: "text-[#F7DF1E]",
    borderColor: "group-hover:border-[#F7DF1E]/50",
  },

  // ── BACKEND & SYSTEMS ──
  {
    name: "Java & Spring Boot",
    category: "BACKEND",
    description: "REST APIs, Spring Batch pipelines, event-driven backends & Spring for Apache Kafka.",
    icon: <SiSpringboot className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Core Language",
    color: "text-[#6DB33F]",
    borderColor: "group-hover:border-[#6DB33F]/50",
  },
  {
    name: "Python",
    category: "BACKEND",
    description: "RAG pipelines, LangChain agents & backend scripting/automation.",
    icon: <SiPython className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Core Language",
    color: "text-[#FFD43B]",
    borderColor: "group-hover:border-[#FFD43B]/50",
  },
  {
    name: "Node.js & Express",
    category: "BACKEND",
    description: "Real-time messaging APIs with Clerk auth & media pipelines.",
    icon: <SiNodedotjs className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Runtime",
    color: "text-[#339933]",
    borderColor: "group-hover:border-[#339933]/50",
  },
  {
    name: "MySQL & SQL",
    category: "BACKEND",
    description: "Relational schema design, stored procedures & query optimization.",
    icon: <SiMysql className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Database",
    color: "text-[#4479A1]",
    borderColor: "group-hover:border-[#4479A1]/50",
  },
  {
    name: "PostgreSQL & Redis",
    category: "BACKEND",
    description: "ACID transactions, JPA locking, Flyway migrations & Redis caching/rate-limiting.",
    icon: <Database className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Database",
    color: "text-rose-400",
    borderColor: "group-hover:border-rose-400/50",
  },
  {
    name: "Docker",
    category: "BACKEND",
    description: "Containerized services & reproducible multi-service deployments.",
    icon: <SiDocker className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Infrastructure",
    color: "text-[#2496ED]",
    borderColor: "group-hover:border-[#2496ED]/50",
  },
  {
    name: "PHP",
    category: "BACKEND",
    description: "Server-side e-commerce logic, sessions & admin dashboards.",
    icon: <SiPhp className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Web Backend",
    color: "text-[#777BB4]",
    borderColor: "group-hover:border-[#777BB4]/50",
  },

  // ── SPECIALIZED ──
  {
    name: "Apache Kafka",
    category: "SPECIALIZED",
    description: "Real-time telemetry ingestion & event-driven microservice pipelines.",
    icon: <SiApachekafka className="h-7 w-7" />,
    spanClass: "md:col-span-2 md:row-span-1",
    badge: "Streaming",
    color: "text-[#231F20] dark:text-white",
    borderColor: "group-hover:border-cyan-400/50",
  },
  {
    name: "LangChain & RAG",
    category: "SPECIALIZED",
    description: "Multimodal RAG pipelines with LCEL, MMR retrieval & Gemini-grounded synthesis.",
    icon: <SiLangchain className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "AI / LLM",
    color: "text-emerald-400",
    borderColor: "group-hover:border-emerald-400/50",
  },
  {
    name: "Kotlin & Compose",
    category: "SPECIALIZED",
    description: "Jetpack Compose UI, Material3 theming & native Android development.",
    icon: <SiKotlin className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Mobile",
    color: "text-[#7F52FF]",
    borderColor: "group-hover:border-[#7F52FF]/50",
  },
  {
    name: "C++ & Assembly",
    category: "SPECIALIZED",
    description: "Bootloaders, kernels & performant low-level systems programming.",
    icon: <SiCplusplus className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Low-Level Systems",
    color: "text-[#00599C]",
    borderColor: "group-hover:border-[#00599C]/50",
  },
  {
    name: "IoT & ESP32",
    category: "SPECIALIZED",
    description: "Embedded sensor firmware paired with cloud decision engines.",
    icon: <SiEspressif className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Embedded",
    color: "text-[#E7352C]",
    borderColor: "group-hover:border-[#E7352C]/50",
  },
  {
    name: "Payments & Auth",
    category: "SPECIALIZED",
    description: "Stripe payments, Keycloak (OAuth2), JWT sessions, RBAC & AES-GCM encryption.",
    icon: <SiStripe className="h-7 w-7" />,
    spanClass: "md:col-span-1 md:row-span-1",
    badge: "Security",
    color: "text-[#635BFF]",
    borderColor: "group-hover:border-[#635BFF]/50",
  },
];

const CATEGORIES: { key: CategoryKey; label: string; icon: React.ReactNode }[] = [
  { key: "FRONTEND", label: "Frontend Stack", icon: <Layers className="h-4 w-4" /> },
  { key: "BACKEND", label: "Backend & Systems", icon: <Terminal className="h-4 w-4" /> },
  { key: "SPECIALIZED", label: "Specialized Eng.", icon: <Cpu className="h-4 w-4" /> },
];

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 25,
    },
  },
};

/**
 * Individual Bento Card with Neo-Skeuomorphic 3D Spring Tilt
 * and CSS-variable driven Mouse Spotlight background/border.
 */
function BentoCard({ item }: { item: SkillItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // 3D Tilt Spring Math
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized percentage [-0.5, 0.5] for 3D tilt
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReducedMotion ? {} : { scale: 1.015, z: 20 }}
      transition={{ duration: 0.2 }}
      className={`spotlight-card group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#060913]/90 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors duration-500 ${item.borderColor} ${item.spanClass}`}
    >
      {/* ── Neo-Skeuomorphic Border Spotlight (-inset-px) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(34,211,238,0.45), rgba(124,58,237,0.25) 40%, transparent 70%)",
        }}
      />

      {/* ── Background Glow Spotlight ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(34,211,238,0.12), rgba(124,58,237,0.06) 50%, transparent 80%)",
        }}
      />

      {/* Decorative top-right indicator dot */}
      <div className="absolute right-6 top-6 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-cyan-300 transition-colors">
          {item.badge}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {/* Card Header: Glowing Icon & Category Tag */}
      <div>
        <div
          className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${item.color} shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]`}
        >
          {item.icon}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
          {item.name}
        </h3>
      </div>

      {/* Card Footer: One-line Description */}
      <p className="mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed transition-colors group-hover:text-gray-300">
        {item.description}
      </p>

      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/60 transition-all duration-500" />
    </motion.div>
  );
}

export function SkillsBentoGrid() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("FRONTEND");
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const activeSkills = SKILL_DATA.filter((skill) => skill.category === activeTab);

  /**
   * Grid-level mouse tracking: updates --mouse-x and --mouse-y
   * across all child cards so the spotlight flows continuously across borders.
   */
  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridContainerRef.current) return;
    const cards = gridContainerRef.current.getElementsByClassName("spotlight-card");
    for (const card of Array.from(cards)) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div className="w-full">
      {/* ── Segmented Control Category Switcher ── */}
      <div className="mb-12 flex flex-col items-center justify-center">
        <div
          role="tablist"
          aria-label="Skill Categories"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-[#0a0f1d]/90 p-1.5 shadow-[0_0_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(cat.key)}
                className={`relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                {/* Liquid Sliding Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 rounded-full border border-cyan-400/60 bg-gradient-to-r from-cyan-500/25 via-violet-500/25 to-cyan-500/25 shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    transition={{
                      type: "spring" as const,
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Tab Content (relative z-10 above liquid background) */}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={isActive ? "text-cyan-300 animate-pulse" : "opacity-70"}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Responsive Multi-Column Bento Grid with Staggered Reveal ── */}
      <div ref={gridContainerRef} onMouseMove={handleGridMouseMove} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
          >
            {activeSkills.map((item) => (
              <BentoCard key={item.name} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
