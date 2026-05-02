import Link from "next/link";
import { getAllPapers, getAllSeries, getPapersBySeries, formatPaperDate } from "@/content/papers-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papers",
  description: "Research findings, methodology papers, and field-tested frameworks from the lateralworks team.",
};

interface Props {
  searchParams: { series?: string };
}

export default function PapersPage({ searchParams }: Props) {
  const series = searchParams.series || "";
  const allPapers = getAllPapers();
  const total = allPapers.length;
  const papers = getPapersBySeries(series);
  const seriesList = getAllSeries();
  const hasPapers = papers.length > 0;

  return (
    <>
      {/* Hero — same shape as /ideas */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">Papers</p>
          <h1 className="font-semibold text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            {total > 0 ? `${total} ${total === 1 ? "paper" : "papers"}.` : "Papers."} 36 years of practice.
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            Research findings, methodology papers, and field-tested frameworks from the lateralworks team.
            New papers added regularly — check back.
          </p>
        </div>
      </section>

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
                <article key={paper.slug} className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-10 group">

                  {/* Thumbnail — same column rhythm as /ideas date column */}
                  <div className="shrink-0 sm:w-44">
                    <a href={paper.pdf} target="_blank" rel="noopener noreferrer"
                       className="block border border-border hover:border-navy transition-colors bg-white">
                      <img
                        src={paper.thumb}
                        alt={`Cover of ${paper.title}`}
                        width={160}
                        height={207}
                        className="w-full h-auto block"
                      />
                    </a>
                  </div>

                  {/* Body */}
                  <div className="flex-grow min-w-0">

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Link href={`/papers?series=${encodeURIComponent(paper.series)}`} className="tag hover:border-navy hover:text-navy transition-colors">
                        {paper.series}
                      </Link>
                      <span className="text-[11px] font-light text-ink-muted">·</span>
                      <span className="text-[11px] font-light text-ink-muted">{paper.type}</span>
                    </div>

                    <h2 className="font-semibold text-navy text-2xl leading-snug mb-1"
                      style={{ letterSpacing: "-0.01em" }}>
                      <a href={paper.pdf} target="_blank" rel="noopener noreferrer"
                         className="hover:text-navy/70 transition-colors">
                        {paper.title}
                      </a>
                    </h2>

                    {paper.subtitle && (
                      <p className="text-sm font-light text-ink-secondary mb-4">{paper.subtitle}</p>
                    )}

                    {paper.core_thesis && (
                      <p className="text-[13.5px] font-light text-ink leading-relaxed mb-4 max-w-3xl">
                        <span className="font-semibold text-navy">Core thesis. </span>
                        {paper.core_thesis}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-light text-ink-muted mb-5">
                      <span>{formatPaperDate(paper.date)}</span>
                      <span>·</span>
                      <span>{paper.pages} pages</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a href={paper.pdf}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-navy text-white hover:bg-navy-light transition-colors">
                        View PDF →
                      </a>
                      <a href={paper.pdf}
                         download
                         className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors">
                        Download
                      </a>
                    </div>
                  </div>
                </article>
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
