"use client";

import { useEffect, useState, useCallback } from "react";

export type SearchCategory = "ideas" | "papers" | "cases" | "pages";

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  category: SearchCategory;
}

interface PagefindResultData {
  url: string;
  meta: { title?: string };
  excerpt: string;
}

interface PagefindResultHandle {
  data: () => Promise<PagefindResultData>;
}

interface PagefindAPI {
  options: (opts: { baseUrl?: string }) => Promise<void>;
  search: (q: string) => Promise<{ results: PagefindResultHandle[] }>;
}

declare global {
  interface Window {
    __pagefind?: PagefindAPI;
  }
}

function normalizeUrl(raw: string): string {
  let url = raw.replace(/\.html$/, "");
  if (url.endsWith("/index")) url = url.slice(0, -"index".length);
  if (url.length > 1 && url.endsWith("/")) url = url.slice(0, -1);
  if (!url) url = "/";
  return url;
}

function categorize(url: string): SearchCategory {
  if (/^\/ideas\/[^/]+$/.test(url)) return "ideas";
  if (/^\/papers\/[^/]+$/.test(url)) return "papers";
  if (/^\/results\/case-studies\/[^/]+$/.test(url)) return "cases";
  return "pages";
}

async function loadPagefind(): Promise<PagefindAPI> {
  if (typeof window === "undefined") {
    throw new Error("pagefind only loads in the browser");
  }
  if (window.__pagefind) return window.__pagefind;
  // @ts-expect-error pagefind is loaded at runtime from /pagefind/pagefind.js
  const pf = (await import(/* webpackIgnore: true */ "/pagefind/pagefind.js")) as PagefindAPI;
  await pf.options({ baseUrl: "/" });
  window.__pagefind = pf;
  return pf;
}

export function useSearch() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPagefind()
      .then(() => {
        if (!cancelled) setIsReady(true);
      })
      .catch((err) => {
        console.error("pagefind load failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    try {
      const pf = await loadPagefind();
      const r = await pf.search(trimmed);
      const top = r.results.slice(0, 30);
      const data = await Promise.all(top.map((h) => h.data()));
      return data.map((d) => {
        const url = normalizeUrl(d.url);
        return {
          url,
          title: d.meta.title || url,
          excerpt: d.excerpt,
          category: categorize(url),
        };
      });
    } catch (err) {
      console.error("search failed:", err);
      return [];
    }
  }, []);

  return { search, isReady };
}
