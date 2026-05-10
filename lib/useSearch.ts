"use client";

import { useEffect, useState, useCallback } from "react";

export type SearchCategory = "ideas" | "papers" | "cases" | "pages";

export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  category: SearchCategory;
  pdfUrl?: string;
}

interface PagefindSubResult {
  title?: string;
  url: string;
  excerpt: string;
}

interface PagefindResultData {
  url: string;
  meta: { title?: string };
  excerpt: string;
  sub_results?: PagefindSubResult[];
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

function splitUrl(url: string): { path: string; hash: string } {
  const i = url.indexOf("#");
  if (i < 0) return { path: url, hash: "" };
  return { path: url.slice(0, i), hash: url.slice(i + 1) };
}

function normalizePath(rawPath: string): string {
  let p = rawPath.replace(/\.html$/, "");
  if (p.endsWith("/index")) p = p.slice(0, -"index".length);
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (!p) p = "/";
  return p;
}

function normalizeUrl(raw: string): string {
  const { path, hash } = splitUrl(raw);
  const p = normalizePath(path);
  return hash ? `${p}#${hash}` : p;
}

function categorize(url: string): SearchCategory {
  const { path, hash } = splitUrl(url);
  const p = normalizePath(path);

  if (hash) {
    if (p === "/papers") return "papers";
    if (p === "/results/case-studies") return "cases";
  }

  if (/^\/ideas\/[^/]+$/.test(p)) return "ideas";
  if (/^\/papers\/[^/]+$/.test(p)) return "papers";
  if (/^\/results\/case-studies\/[^/]+$/.test(p)) return "cases";

  return "pages";
}

function derivePdfUrl(url: string): string | undefined {
  const { path, hash } = splitUrl(url);
  if (!hash) return undefined;
  const p = normalizePath(path);
  if (p === "/papers") return `/papers/${hash}.pdf`;
  if (p === "/results/case-studies") return `/cases/${hash}.pdf`;
  return undefined;
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

      const flat: SearchResult[] = [];
      for (const d of data) {
        if (d.sub_results && d.sub_results.length > 0) {
          for (const sub of d.sub_results) {
            const url = normalizeUrl(sub.url);
            flat.push({
              url,
              title: sub.title || d.meta.title || url,
              excerpt: sub.excerpt,
              category: categorize(url),
              pdfUrl: derivePdfUrl(url),
            });
          }
        } else {
          const url = normalizeUrl(d.url);
          flat.push({
            url,
            title: d.meta.title || url,
            excerpt: d.excerpt,
            category: categorize(url),
          });
        }
      }
      return flat;
    } catch (err) {
      console.error("search failed:", err);
      return [];
    }
  }, []);

  return { search, isReady };
}
