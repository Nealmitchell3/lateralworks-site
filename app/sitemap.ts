import type { MetadataRoute } from "next";
import postsIndex from "@/content/posts_index.json";
import docsIndex from "@/content/docs_index.json";
import papersIndex from "@/content/papers_index.json";
import casesIndex from "@/content/cases_index.json";

const BASE_URL = "https://lateralworks.com";

const STATIC_ROUTES: ReadonlyArray<{ path: string; priority: number }> = [
  { path: "/", priority: 1.0 },
  { path: "/about", priority: 0.8 },
  { path: "/academy", priority: 0.8 },
  { path: "/consulting", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/docs", priority: 0.8 },
  { path: "/ideas", priority: 0.8 },
  { path: "/methodology", priority: 0.8 },
  { path: "/papers", priority: 0.8 },
  { path: "/research", priority: 0.8 },
  { path: "/results", priority: 0.8 },
  { path: "/results/case-studies", priority: 0.8 },
  { path: "/software", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const posts = (postsIndex as Array<{ slug: string; dateISO?: string; date?: string }>).map((p) => ({
    url: `${BASE_URL}/ideas/${p.slug}`,
    lastModified: new Date(p.dateISO || p.date || now),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const docs = (docsIndex as Array<{ slug: string; dateISO?: string; date?: string }>).map((d) => ({
    url: `${BASE_URL}/docs/${d.slug}`,
    lastModified: new Date(d.dateISO || d.date || now),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const papers = (papersIndex as Array<{ slug: string; date?: string }>).map((p) => ({
    url: `${BASE_URL}/papers/${p.slug}.pdf`,
    lastModified: new Date(p.date || now),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const cases = (casesIndex as Array<{ slug: string; date?: string }>).map((c) => ({
    url: `${BASE_URL}/cases/${c.slug}.pdf`,
    lastModified: new Date(c.date || now),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...posts, ...docs, ...papers, ...cases];
}
