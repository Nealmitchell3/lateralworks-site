import Link from "next/link";
import CaseCard from "./CaseCard";
import type { Case } from "@/content/case-types";
import { getPdfText } from "@/content/cases-utils";

interface Props {
  cases: Case[];
  practicesList: string[];
}

export default function StaticCaseStudiesListing({ cases, practicesList }: Props) {
  return (
    <>
      {/* Practice filter — unfiltered baseline */}
      {practicesList.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">
                Practice
              </span>
              <Link
                href="/results/case-studies"
                className="tag transition-colors border-navy text-navy bg-navy/5"
              >
                All
              </Link>
              {practicesList.map((p) => (
                <Link
                  key={p}
                  href={`/results/case-studies?practice=${encodeURIComponent(p)}`}
                  className="tag transition-colors hover:border-navy hover:text-navy"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List — full unfiltered */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="divide-y divide-border">
            {cases.map((c) => (
              <CaseCard key={c.slug} c={c} pdfText={getPdfText(c.slug)} />
            ))}
          </div>
          <div className="hairline pt-8 mt-8">
            <p className="text-sm font-light text-ink-muted">
              Most case studies we can publish are &gt;10 year old projects. Our current work involves advanced technology at the bleeding edge. We are not able to share these details for obvious reasons.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
