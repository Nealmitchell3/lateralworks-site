import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import type { Case } from "@/content/case-types";

function formatCaseDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  } catch { return iso; }
}

export default function CaseCard({ c, pdfText }: { c: Case; pdfText?: string }) {
  return (
    <article
      data-pagefind-meta={`pdf:${c.pdf}`}
      className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-10 group"
    >
      {pdfText && (
        <span className="sr-only" aria-hidden="true">
          {pdfText}
        </span>
      )}
      {/* Thumbnail */}
      <div className="shrink-0 sm:w-44">
        <Link
          href={`/results/case-studies/${c.slug}`}
          className="block border border-border hover:border-navy transition-colors bg-white"
        >
          <img
            src={c.thumb}
            alt={`Cover of ${c.title}`}
            width={160}
            height={207}
            className="w-full h-auto block"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Link
            href={`/results/case-studies?practice=${encodeURIComponent(c.practice)}`}
            className="tag hover:border-navy hover:text-navy transition-colors"
          >
            {c.practice}
          </Link>
          <span className="text-[11px] font-light text-ink-muted">·</span>
          <span className="text-[11px] font-light text-ink-muted">
            {c.type}
          </span>
          {c.sector && (
            <>
              <span className="text-[11px] font-light text-ink-muted">·</span>
              <span className="text-[11px] font-light text-ink-muted">
                {c.sector}
              </span>
            </>
          )}
        </div>

        <h2
          id={c.slug}
          className="font-semibold text-navy text-2xl leading-snug mb-1 scroll-mt-24"
          style={{ letterSpacing: "-0.01em" }}
        >
          <Link
            href={`/results/case-studies/${c.slug}`}
            className="hover:text-navy/70 transition-colors"
          >
            {c.title}
          </Link>
        </h2>

        {c.subtitle && (
          <p className="text-sm font-light text-ink-secondary mb-4">
            {c.subtitle}
          </p>
        )}

        {c.core_thesis && (
          <p className="text-[13.5px] font-light text-ink leading-relaxed mb-4 max-w-3xl">
            <span className="font-semibold text-navy">
              Core thesis.{" "}
            </span>
            {c.core_thesis}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-light text-ink-muted mb-5">
          <span>{formatCaseDate(c.date)}</span>
          <span>·</span>
          <span>{c.pages} pages</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/results/case-studies/${c.slug}`}
            className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-navy text-white hover:bg-navy-light transition-colors"
          >
            Read case study →
          </Link>
          <a
            href={c.pdf}
            download
            className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
          >
            Download PDF
          </a>
          <ShareButton url={`https://lateralworks.com/results/case-studies/${c.slug}`} />
        </div>
      </div>
    </article>
  );
}
