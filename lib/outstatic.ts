import { getDocuments, getDocumentBySlug, getSingletonBySlug } from "outstatic/server";

/* ────────────────────────────────────────────────────────────────────────
 * Collection type contracts
 *
 * Each interface below is the *clean* shape the app consumes. Outstatic
 * documents come back as a loose `{ [key: string]: any }` bag matching
 * whatever custom fields were configured in the dashboard — the `map*`
 * functions in this file are the single place that translate raw
 * frontmatter into these typed shapes.
 * ──────────────────────────────────────────────────────────────────────── */

export interface Project {
  slug: string;
  title: string;
  description: string;
  content: string;
  status: string;
  coverImage: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  publishedAt: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  externalUrl: string;
  order: number;
  publishedAt: string;
  author: {
    name?: string;
    picture?: string;
  };
}

export interface EventItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  organization: string;
  location: string;
  eventDate: string;
  role: string;
  publishedAt: string;
}

export interface TechSkill {
  slug: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
}

export interface GlobalConfig {
  name: string;
  title: string;
  bio: string;
  cvUrl: string;
  avatarUrl: string;
  email: string;
  location: string;
  availabilityStatus: string;
  cgpa: string;
  deansList: string;
  languages: string;
  yearsCoding: string;
  systemsBuilt: string;
  corePillars: string;
  socials: {
    github?: string;
    linkedin?: string;
    medium?: string;
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Raw Outstatic collection names — must match the collection folders
 * created in the /outstatic dashboard (content/<collection>/*.md)
 * ──────────────────────────────────────────────────────────────────────── */

const COLLECTIONS = {
  projects: "projects",
  articles: "articles",
  events: "events",
  skills: "skills",
} as const;

/* ────────────────────────────────────────────────────────────────────────
 * Field projections — only pull what we map, keeps the parsed payload small
 * ──────────────────────────────────────────────────────────────────────── */

const PROJECT_FIELDS = [
  "slug",
  "title",
  "description",
  "content",
  "status",
  "coverImage",
  "techStack",
  "liveUrl",
  "repoUrl",
  "featured",
  "order",
  "publishedAt",
];

const ARTICLE_FIELDS = [
  "slug",
  "title",
  "description",
  "content",
  "coverImage",
  "category",
  "tags",
  "readTime",
  "externalUrl",
  "order",
  "publishedAt",
  "author",
];

const EVENT_FIELDS = [
  "slug",
  "title",
  "description",
  "content",
  "coverImage",
  "organization",
  "location",
  "eventDate",
  "role",
  "publishedAt",
];

const SKILL_FIELDS = ["slug", "name", "category", "proficiency", "icon"];

const CONFIG_FIELDS = [
  "name",
  "title",
  "bio",
  "cvUrl",
  "avatarUrl",
  "email",
  "location",
  "availabilityStatus",
  "cgpa",
  "deansList",
  "languages",
  "yearsCoding",
  "systemsBuilt",
  "corePillars",
  "socials",
];

/* ────────────────────────────────────────────────────────────────────────
 * Mappers — frontmatter (any) -> strict interface
 * ──────────────────────────────────────────────────────────────────────── */

function mapProject(doc: Record<string, unknown>): Project {
  return {
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    content: String(doc.content ?? ""),
    status: String(doc.status ?? "Published"),
    coverImage: String(doc.coverImage ?? ""),
    techStack: Array.isArray(doc.techStack) ? (doc.techStack as string[]) : [],
    liveUrl: doc.liveUrl ? String(doc.liveUrl) : undefined,
    repoUrl: doc.repoUrl ? String(doc.repoUrl) : undefined,
    featured: Boolean(doc.featured),
    order: Number(doc.order ?? 999),
    publishedAt: String(doc.publishedAt ?? ""),
  };
}

function mapArticle(doc: Record<string, unknown>): Article {
  const author = (doc.author as Article["author"]) ?? {};
  return {
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    content: String(doc.content ?? ""),
    coverImage: String(doc.coverImage ?? ""),
    category: String(doc.category ?? ""),
    tags: Array.isArray(doc.tags) ? (doc.tags as string[]) : [],
    readTime: String(doc.readTime ?? ""),
    externalUrl: String(doc.externalUrl ?? ""),
    order: Number(doc.order ?? 999),
    publishedAt: String(doc.publishedAt ?? ""),
    author: {
      name: author.name,
      picture: author.picture,
    },
  };
}

function mapEvent(doc: Record<string, unknown>): EventItem {
  return {
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    content: String(doc.content ?? ""),
    coverImage: String(doc.coverImage ?? ""),
    organization: String(doc.organization ?? ""),
    location: String(doc.location ?? ""),
    eventDate: String(doc.eventDate ?? ""),
    role: String(doc.role ?? ""),
    publishedAt: String(doc.publishedAt ?? ""),
  };
}

function mapSkill(doc: Record<string, unknown>): TechSkill {
  return {
    slug: String(doc.slug ?? ""),
    name: String(doc.name ?? ""),
    category: String(doc.category ?? ""),
    proficiency: Number(doc.proficiency ?? 0),
    icon: String(doc.icon ?? ""),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Public fetchers
 *
 * getDocuments/getSingletonBySlug throw (rather than returning an empty
 * result) when a collection/singleton hasn't been created yet in the
 * Outstatic dashboard — e.g. on a fresh checkout before any content exists.
 * The safe* wrappers below swallow that so pages render an empty state
 * instead of crashing until the collection is created.
 * ──────────────────────────────────────────────────────────────────────── */

function safeGetDocuments(collection: string, fields: string[]): Record<string, unknown>[] {
  try {
    return getDocuments(collection, fields) as Record<string, unknown>[];
  } catch {
    return [];
  }
}

function safeGetDocumentBySlug(
  collection: string,
  slug: string,
  fields: string[]
): Record<string, unknown> | null {
  try {
    return getDocumentBySlug(collection, slug, fields) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

function safeGetSingletonBySlug(slug: string, fields: string[]): Record<string, unknown> | null {
  try {
    return getSingletonBySlug(slug, fields) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

export function getPublishedProjects(): Project[] {
  const docs = safeGetDocuments(COLLECTIONS.projects, PROJECT_FIELDS);
  return docs
    .map(mapProject)
    .sort((a, b) => a.order - b.order || (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | null {
  const doc = safeGetDocumentBySlug(COLLECTIONS.projects, slug, PROJECT_FIELDS);
  return doc ? mapProject(doc) : null;
}

export function getPublishedArticles(): Article[] {
  const docs = safeGetDocuments(COLLECTIONS.articles, ARTICLE_FIELDS);
  return docs
    .map(mapArticle)
    .sort((a, b) => a.order - b.order || (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const doc = safeGetDocumentBySlug(COLLECTIONS.articles, slug, ARTICLE_FIELDS);
  return doc ? mapArticle(doc) : null;
}

export function getPublishedEvents(): EventItem[] {
  const docs = safeGetDocuments(COLLECTIONS.events, EVENT_FIELDS);
  return docs
    .map(mapEvent)
    .sort((a, b) => (a.eventDate < b.eventDate ? 1 : -1));
}

export function getEventBySlug(slug: string): EventItem | null {
  const doc = safeGetDocumentBySlug(COLLECTIONS.events, slug, EVENT_FIELDS);
  return doc ? mapEvent(doc) : null;
}

export function getTechSkills(): TechSkill[] {
  const docs = safeGetDocuments(COLLECTIONS.skills, SKILL_FIELDS);
  return docs.map(mapSkill);
}

/**
 * GlobalConfig is stored as an Outstatic *singleton* (dashboard → Settings →
 * Singletons → "config"), not a collection, since there is only ever one.
 */
export function getGlobalConfig(): GlobalConfig | null {
  const doc = safeGetSingletonBySlug("config", CONFIG_FIELDS);
  if (!doc) return null;

  const socials = (doc.socials as GlobalConfig["socials"]) ?? {};
  return {
    name: String(doc.name ?? ""),
    title: String(doc.title ?? ""),
    bio: String(doc.bio ?? ""),
    cvUrl: String(doc.cvUrl ?? ""),
    avatarUrl: String(doc.avatarUrl ?? ""),
    email: String(doc.email ?? ""),
    location: String(doc.location ?? ""),
    availabilityStatus: String(doc.availabilityStatus ?? ""),
    cgpa: String(doc.cgpa ?? ""),
    deansList: String(doc.deansList ?? ""),
    languages: String(doc.languages ?? ""),
    yearsCoding: String(doc.yearsCoding ?? ""),
    systemsBuilt: String(doc.systemsBuilt ?? ""),
    corePillars: String(doc.corePillars ?? ""),
    socials: {
      github: socials.github,
      linkedin: socials.linkedin,
      medium: socials.medium,
    },
  };
}
