import Link from "next/link";
import { getRecentCases } from "@/content/cases-utils";

/**
 * Teaser block for the /results page that surfaces the 2 most recent
 * case studies and links to the full /results/case-studies index.
 *
 * Renders nothing if no case studies are present yet.
 */
export default function CaseStudiesTeaser() {
  const cases = getRecentCases(2);
  if (cases.length === 0) return null;

  return (
    <section className="bg-cream-dark py-16 lg:py-24 border-t border-border">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <div>
            <p className="section-label mb-3">Case studies</p>
            <h2
              className="font-semibold text-navy text-3xl lg:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Field-tested engagements.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((c) => (
            <article
              key={c.slug}
              className="bg-white border border-border hover:border-navy transition-colors"
            >
              <div className="flex gap-5 p-5">
                <a
                  href={c.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 block w-24 border border-border bg-cream"
                >
                  <img
                    src={c.thumb}
                    alt={`Cover of ${c.title}`}
                    width={96}
                    height={124}
                    className="w-full h-auto block"
                  />
                </a>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mb-2">
                    {c.practice} · {c.type}
                  </p>
                  <h3
                    className="font-semibold text-navy text-lg leading-snug mb-2"
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
                  </h3>
                  {c.subtitle && (
                    <p className="text-[12.5px] font-light text-ink-secondary leading-relaxed mb-3 line-clamp-2">
                      {c.subtitle}
                    </p>
                  )}
                  <p className="text-[10.5px] font-light text-ink-muted">
                    {c.sector} · {c.pages} pages
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/results/case-studies"
            className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors"
          >
            View all case studies →
          </Link>
        </div>
      </div>
    </section>
  );
}
