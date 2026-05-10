"use client";

import Link from "next/link";
import type { SearchResult, SearchCategory } from "@/lib/useSearch";

const CATEGORY_LABELS: Record<SearchCategory, string> = {
  ideas: "Ideas",
  papers: "Papers",
  cases: "Case studies",
  pages: "Pages",
};

const CATEGORY_ORDER: SearchCategory[] = ["ideas", "papers", "cases", "pages"];

interface Props {
  results: SearchResult[];
  query: string;
  selectedUrl?: string | null;
  onSelect?: () => void;
}

export default function SearchResults({ results, query, selectedUrl, onSelect }: Props) {
  if (!query.trim()) {
    return (
      <p className="text-center text-ink-muted py-12 text-sm">
        Start typing to search.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-center text-ink-muted py-12 text-sm">
        No matches for &ldquo;{query}&rdquo;.
      </p>
    );
  }

  const groups: Record<SearchCategory, SearchResult[]> = {
    ideas: [],
    papers: [],
    cases: [],
    pages: [],
  };
  for (const r of results) groups[r.category].push(r);

  return (
    <div className="space-y-8">
      {CATEGORY_ORDER.map((cat) => {
        const items = groups[cat];
        if (items.length === 0) return null;
        return (
          <section key={cat}>
            <p className="section-label mb-3">
              {CATEGORY_LABELS[cat]} ({items.length})
            </p>
            <ul className="divide-y divide-border">
              {items.map((r) => {
                const isSelected = r.url === selectedUrl;
                const className = `block py-3 px-3 -mx-3 rounded transition-colors ${
                  isSelected ? "bg-cream-dark" : "hover:bg-cream-dark/60"
                }`;
                const inner = (
                  <>
                    <h3 className="text-base font-medium text-navy leading-snug">
                      {r.title}
                      {r.pdfUrl && (
                        <span className="ml-2 inline-block rounded bg-gold/15 text-gold px-1.5 py-0.5 text-[10px] font-semibold tracking-wider align-middle">
                          PDF
                        </span>
                      )}
                    </h3>
                    <p
                      className="text-sm font-light text-ink leading-relaxed mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                    />
                    <p className="text-[11px] font-light text-ink-muted mt-1 truncate">
                      {r.pdfUrl ?? r.url}
                    </p>
                  </>
                );
                return (
                  <li key={r.url}>
                    {r.pdfUrl ? (
                      <a
                        href={r.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onSelect}
                        className={className}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={r.url} onClick={onSelect} className={className}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
