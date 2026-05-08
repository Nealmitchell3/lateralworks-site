"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PaperCard from "./PaperCard";
import type { Paper } from "@/content/paper-types";

interface Props {
  papers: Paper[];
  seriesList: string[];
}

export default function PapersListing({ papers: allPapers, seriesList }: Props) {
  const searchParams = useSearchParams();
  const series = searchParams.get("series") || "";

  const total = allPapers.length;
  const papers = series
    ? allPapers.filter((p) => p.series?.toLowerCase() === series.toLowerCase())
    : allPapers;
  const hasPapers = papers.length > 0;

  return (
    <>
      {/* Series filter */}
      {seriesList.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">Series</span>
              <Link href="/papers"
                className={`tag transition-colors ${!series ? "border-navy text-navy bg-navy/5" : "hover:border-navy hover:text-navy"}`}>
                All
              </Link>
              {seriesList.map((s) => (
                <Link key={s} href={`/papers?series=${encodeURIComponent(s)}`}
                  className={`tag transition-colors ${series.toLowerCase() === s.toLowerCase() ? "border-navy text-navy bg-navy/5" : "hover:border-navy hover:text-navy"}`}>
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">

          {series && (
            <div className="mb-8 pb-6 hairline flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Series</p>
                <h2 className="font-semibold text-navy text-2xl">{series}</h2>
              </div>
              <Link href="/papers" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted hover:text-navy transition-colors">
                ← All papers
              </Link>
            </div>
          )}

          {!hasPapers && (
            <div className="py-24 text-center">
              <h2 className="font-semibold text-navy text-2xl mb-3">No papers found</h2>
              <p className="text-sm font-light text-ink-muted">Try a different series.</p>
            </div>
          )}

          {hasPapers && (
            <div className="divide-y divide-border">
              {papers.map((paper) => (
                <PaperCard key={paper.slug} paper={paper} />
              ))}
            </div>
          )}

          {hasPapers && (
            <div className="hairline pt-8 mt-8">
              <p className="text-sm font-light text-ink-muted">
                {papers.length} paper{papers.length !== 1 ? "s" : ""}{series ? ` in ${series}` : ""}.
                {!series && total >= 5 && " More papers added regularly."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
