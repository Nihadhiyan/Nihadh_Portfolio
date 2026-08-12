import type { Project, Article } from "@/lib/outstatic";
import type { ProjectVaultItem } from "@/components/ui/HorizontalProjectVault";
import type { ArticleMatrixItem } from "@/components/ui/HorizontalArticleMatrix";
import { THEMES } from "@/lib/project-themes";

/**
 * Translates CMS-managed Projects/Articles into the shapes the display
 * components expect. Kept separate from lib/outstatic.ts so the CMS field
 * contracts stay independent of presentational concerns (theme colors, HUD
 * stat formatting) that only make sense for this particular site design.
 */

export function mapProjectsToVaultItems(projects: Project[]): ProjectVaultItem[] {
  return projects.map((p, idx) => {
    const hudStats = p.techStack.slice(0, 3).map((tech, i) => ({
      label: `STACK 0${i + 1}`,
      val: tech.toUpperCase(),
    }));
    while (hudStats.length < 3) {
      hudStats.push({ label: "STATUS", val: p.featured ? "FEATURED" : "ACTIVE" });
    }

    return {
      id: p.slug,
      index: String(idx + 1).padStart(2, "0"),
      title: p.title,
      status: p.featured ? "FEATURED // PROJECT" : "ACTIVE // PROJECT",
      description: p.description,
      tags: p.techStack,
      repoUrl: p.repoUrl || "",
      liveUrl: p.liveUrl || undefined,
      theme: THEMES[idx % THEMES.length],
      hudStats,
    };
  });
}

export function mapArticlesToMatrixItems(articles: Article[]): ArticleMatrixItem[] {
  return articles.map((a) => ({
    id: a.slug,
    title: a.title,
    readTime: a.readTime.toUpperCase(),
    date: a.publishedAt
      ? new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
      : "",
    platform: "MEDIUM",
    platformIcon: "medium",
    link: a.externalUrl || "https://medium.com/@Nihadhiyan",
    image: a.coverImage,
    summary: a.description,
    abstract: a.content || a.description,
    tags: a.tags.length > 0 ? a.tags : [a.category].filter(Boolean),
  }));
}
