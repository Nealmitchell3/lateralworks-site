import Link from "next/link";
import type { Paper } from "@/content/paper-types";

function formatPaperDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
}

export default function PaperCard({ paper, pdfText }: { paper: Paper; pdfText?: string }) {
  return (
    <article
      data-pagefind-meta={`pdf:${paper.pdf}`}
      className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-10 group"
    >
      {pdfText && (
        <span className="sr-only" aria-hidden="true">
          {pdfText}
        </span>
      )}

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
  );
}
