import React from "react";
import { HeroAngelRing } from "@/components/ui/HeroAngelRing";
import { CircuitTrace } from "@/components/ui/CircuitTrace";
import { AboutProfileBento } from "@/components/ui/AboutProfileBento";
import { SpecializationsShowcase } from "@/components/ui/SpecializationsShowcase";
import { SkillsBentoGrid } from "@/components/ui/SkillsBentoGrid";
import { HorizontalArticleMatrix } from "@/components/ui/HorizontalArticleMatrix";
import { VelocityEventTape } from "@/components/ui/VelocityEventTape";
import { ContactSection } from "@/components/ui/ContactSection";
import { MonolithFooter } from "@/components/ui/MonolithFooter";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { FadeIn } from "@/components/animations/FadeIn";
import { HorizontalProjectVault } from "@/components/ui/HorizontalProjectVault";
import { getPublishedProjects, getPublishedArticles, getGlobalConfig } from "@/lib/outstatic";
import { mapProjectsToVaultItems, mapArticlesToMatrixItems } from "@/lib/cms-adapters";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
      <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]" />
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  const cmsProjects = mapProjectsToVaultItems(getPublishedProjects());
  const cmsArticles = mapArticlesToMatrixItems(getPublishedArticles());
  const config = getGlobalConfig();

  return (
    <div className="relative min-h-screen overflow-x-clip text-[var(--foreground)] transition-colors duration-500">
      {/* Main Content Wrapper for Curtain Reveal Trick (mb-[80vh] on md+ exposes fixed footer underneath) */}
      <div className="relative z-30 bg-[var(--background)] md:mb-[80vh] shadow-[0_50px_100px_rgba(0,0,0,0.95)] transition-colors duration-500">
        {/* ═══ HERO — Angel Ring Dual-Orbit Halo & Cutout Portrait ═══ */}
        <HeroAngelRing cvUrl={config?.cvUrl || "/Nihadh_CV.pdf"} />

        {/* Cybernetic Circuit Trace background divider */}
        <CircuitTrace />

        {/* ═══ ABOUT — 4-card holographic bento profile matrix ═══ */}
        <section id="about" className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 py-32 relative z-10">
          <FadeIn amount={0.15}>
            <Eyebrow>{"//"} 01 — ABOUT</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Identity &amp; Background
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              An overview of my academic foundation, engineering philosophy, and active focus areas.
            </p>
          </FadeIn>

          <FadeIn amount={0.15} delay={0.15} className="mt-12">
            <AboutProfileBento config={config} />
          </FadeIn>
        </section>

        {/* ═══ SPECIALIZATIONS — 3-column holographic bento showcase ═══ */}
        <section id="specializations" className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 py-24 relative z-10">
          <FadeIn amount={0.15}>
            <Eyebrow>{"//"} 02 — SPECIALIZATIONS</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Engineering Pillars
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Specialized domain expertise spanning net-centric architecture, event-driven business engineering, RAG/AI data science, and enterprise healthcare informatics.
            </p>
          </FadeIn>

          <FadeIn amount={0.15} delay={0.15} className="mt-12">
            <SpecializationsShowcase />
          </FadeIn>
        </section>

        {/* ═══ SKILLS — Neo-Skeuomorphic Bento Grid Showcase ═══ */}
        <section id="skills" className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 py-24 relative z-10">
          <FadeIn amount={0.15}>
            <Eyebrow>{"//"} 03 — SKILLS</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Technical Arsenal
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Comprehensive breakdown of languages, frameworks, infrastructure, and tools utilized across production systems.
            </p>
          </FadeIn>

          <FadeIn amount={0.15} delay={0.15} className="mt-12">
            <SkillsBentoGrid />
          </FadeIn>
        </section>

        {/* ═══ PROJECTS — Pinned Horizontal Parallax Vault (04) ═══ */}
        <section id="projects" className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 pt-24 pb-8 relative z-10">
          <FadeIn amount={0.15}>
            <Eyebrow>{"//"} 04 — PROJECTS</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Cinematic Archive
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Selected engineering breakthroughs across software architecture, artificial intelligence, and hardware systems.
            </p>
          </FadeIn>
        </section>
        <HorizontalProjectVault projects={cmsProjects} />

        {/* ═══ FIELD OPERATIONS — Velocity Marquee for Engagements (05) ═══ */}
        <section id="engagements" className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 pt-24 pb-8 relative z-10">
          <FadeIn amount={0.15}>
            <Eyebrow>{"//"} 05 — FIELD OPERATIONS</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Engagements &amp; Events
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Competitions, hackathons, and organizational leadership events across the engineering and IEEE ecosystem.
            </p>
          </FadeIn>
        </section>
        <div className="relative z-10 overflow-hidden">
          <VelocityEventTape />
        </div>

        {/* ═══ ARTICLES — Kinetic Horizontal Accordion Matrix (06) ═══ */}
        <section id="articles" className="mx-auto max-w-7xl xl:max-w-[1500px] px-6 pt-24 pb-8 relative z-10">
          <FadeIn amount={0.15}>
            <Eyebrow>{"//"} 06 — ARTICLES &amp; DATA LOGS</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Kinetic Matrix
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
              Technical treatises and engineering deep-dives rendered in an expanding horizontal accordion. Scroll down, hover, or click to unpack data logs.
            </p>
          </FadeIn>
        </section>
        <HorizontalArticleMatrix articles={cmsArticles} />

        {/* ═══ CONTACT — Secure Uplink Dossier Form ═══ */}
        <section id="contact" className="relative z-10 py-24">
          <ContactSection />
        </section>
      </div>

      {/* ═══ FLOATING SPEED DIAL CONTACT BUTTON ═══ */}
      <FloatingContact cvUrl={config?.cvUrl || "/Nihadh_CV.pdf"} />

      {/* ═══ FOOTER — The Cinematic Curtain Reveal & Magnetic Monolith ═══ */}
      <MonolithFooter />
    </div>
  );
}
