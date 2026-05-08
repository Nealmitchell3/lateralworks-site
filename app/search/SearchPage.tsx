"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch, type SearchResult } from "@/lib/useSearch";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { search } = useSearch();

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = query.trim();
      const target = trimmed
        ? `/search?q=${encodeURIComponent(trimmed)}`
        : "/search";
      router.replace(target, { scroll: false });
      if (trimmed) {
        search(query).then(setResults);
      } else {
        setResults([]);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [query, router, search]);

  return (
    <section className="bg-cream py-12 lg:py-20">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 border-b border-cream-dark py-4 mb-10">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted shrink-0">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ideas, papers, cases, and pages…"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-xl text-navy placeholder:text-ink-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="text-ink-muted hover:text-navy transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <SearchResults results={results} query={query} />
        </div>
      </div>
    </section>
  );
}
