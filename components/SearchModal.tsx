"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch, type SearchResult } from "@/lib/useSearch";
import SearchResults from "./SearchResults";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { search } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Body scroll lock + global ESC
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const t = setTimeout(() => {
      search(query).then((r) => {
        setResults(r);
        setSelectedIndex(-1);
      });
    }, 150);
    return () => clearTimeout(t);
  }, [query, search]);

  if (!isOpen) return null;

  const goToSearchPage = () => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const selectedUrl = selectedIndex >= 0 ? results[selectedIndex]?.url ?? null : null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 w-[92vw] max-w-3xl bg-cream rounded-md shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-cream-dark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted shrink-0">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (selectedIndex >= 0 && results[selectedIndex]) {
                  const r = results[selectedIndex];
                  onClose();
                  if (r.pdfUrl) {
                    window.open(r.pdfUrl, "_blank", "noopener,noreferrer");
                  } else {
                    router.push(r.url);
                  }
                } else if (query.trim()) {
                  goToSearchPage();
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  results.length === 0 ? -1 : Math.min(prev + 1, results.length - 1)
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, -1));
              }
            }}
            placeholder="Search ideas, papers, cases, and pages…"
            className="flex-1 bg-transparent border-none outline-none text-lg text-navy placeholder:text-ink-muted"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-muted hover:text-navy transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <SearchResults
            results={results}
            query={query}
            selectedUrl={selectedUrl}
            onSelect={onClose}
          />
        </div>

        {/* Bottom hint */}
        <div className="px-5 py-3 border-t border-cream-dark flex items-center justify-between text-[11px] text-ink-muted">
          <span>↑↓ navigate · ↵ select · ESC close</span>
          {results.length > 0 && (
            <button
              type="button"
              onClick={goToSearchPage}
              className="text-gold hover:text-gold-light font-semibold tracking-[0.06em] uppercase"
            >
              See all {results.length} results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
