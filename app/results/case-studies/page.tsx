import Link from "next/link";
import {
  getAllCases,
  getAllCasePractices,
  getCasesByPractice,
  formatCaseDate,
} from "@/content/cases-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Field-tested case studies from lateralworks engagements across semiconductor, hardware, and complex-systems programs. Names and sector-identifying details have been removed.",
};

interface Props {
  searchParams: { practice?: string };
}

export default function CaseStudiesPage({ searchParams }: Props) {
  const practice = searchParams.practice || "";
  const allCases = getAllCases();
  const total = allCases.length;
  const cases = getCasesByPractice(practice);
  const practicesList = getAllCasePractices();
  const hasCases = cases.length > 0;

  return (
    <>
      {/* Hero — same shape as /papers */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/results"
              className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors"
            >
              ← Results
            </Link>
            <span className="text-white/30">·</span>
            <p className="section-label !text-white/60 !mb-0">Case studies</p>
          </div>
          <h1
            className="font-semibold text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}
          >
            {total > 0
              ? `${total} ${total === 1 ? "case study" : "case studies"}.`
              : "Case studies."}{" "}
            Field-tested.
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            Real engagements from the lateralworks team across semiconductor,
            hardware, and complex-systems programs. Names and sector-identifying
            details have been removed. New cases added regularly — check back.
          </p>
        </div>
      </section>

      {/* Practice filter */}
      {practicesList.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">
                Practice
              </span>
              <Link
                href="/results/case-studies"
                className={`tag transition-colors ${
                  !practice
                    ? "border-navy text-navy bg-navy/5"
                    : "hover:border-navy hover:text-navy"
                }`}
              >
                All
              </Link>
              {practicesList.map((p) => (
                <Link
                  key={p}
                  href={`/results/case-studies?practice=${encodeURIComponent(p)}`}
                  className={`tag transition-colors ${
                    practice.toLowerCase() === p.toLowerCase()
                      ? "border-navy text-navy bg-navy/5"
                      : "hover:border-navy hover:text-navy"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          {practice && (
            <div className="mb-8 pb-6 hairline flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Practice</p>
                <h2 className="font-semibold text-navy text-2xl">{practice}</h2>
              </div>
              <Link
                href="/results/case-studies"
                className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted hover:text-navy transition-colors"
              >
                ← All case studies
              </Link>
            </div>
          )}

          {!hasCases && (
            <div className="py-24 text-center">
              <h2 className="font-semibold text-navy text-2xl mb-3">
                No case studies found
              </h2>
              <p className="text-sm font-light text-ink-muted">
                Try a different practice.
              </p>
            </div>
          )}

          {hasCases && (
            <div className="divide-y divide-border">
              {cases.map((c) => (
                <article
                  key={c.slug}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-10 group"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 sm:w-44">
                    <a
                      href={c.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-border hover:border-navy transition-colors bg-white"
                    >
                      <img
                        src={c.thumb}
                        alt={`Cover of ${c.title}`}
                        width={160}
                        height={207}
                        className="w-full h-auto block"
                      />
                    </a>
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
                      className="font-semibold text-navy text-2xl leading-snug mb-1"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      <a
                        href={c.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-navy/70 transition-colors"
                      >
                        {c.title}
                      </a>
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

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={c.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-navy text-white hover:bg-navy-light transition-colors"
                      >
                        View PDF →
                      </a>
                      <a
                        href={c.pdf}
                        download
                        className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {hasCases && (
            <div className="hairline pt-8 mt-8">
              <p className="text-sm font-light text-ink-muted">
                {cases.length} case stud{cases.length !== 1 ? "ies" : "y"}
                {practice ? ` in ${practice}` : ""}.
                {!practice &&
                  " New cases added as engagements complete and customer details are anonymized."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
