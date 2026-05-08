"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CaseCard from "./CaseCard";
import type { Case } from "@/content/case-types";

interface Props {
  cases: Case[];
  practicesList: string[];
}

export default function CaseStudiesListing({ cases: allCases, practicesList }: Props) {
  const searchParams = useSearchParams();
  const practice = searchParams.get("practice") || "";

  const cases = practice
    ? allCases.filter((c) => c.practice?.toLowerCase() === practice.toLowerCase())
    : allCases;
  const hasCases = cases.length > 0;

  return (
    <>
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
                <CaseCard key={c.slug} c={c} />
              ))}
            </div>
          )}

          {hasCases && (
            <div className="hairline pt-8 mt-8">
              <p className="text-sm font-light text-ink-muted">
                {cases.length} case stud{cases.length !== 1 ? "ies" : "y"}
                {practice ? ` in ${practice}` : ""}.
                {!practice &&
                  " New cases are added when they are created. Most case studies we can publish are >10 year old projects. Our current work involves advanced technology at the bleeding edge. We are not able to share these details for obvious reasons."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
