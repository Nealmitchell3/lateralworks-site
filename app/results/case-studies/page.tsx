import { Suspense } from "react";
import Link from "next/link";
import CaseStudiesListing from "./CaseStudiesListing";
import StaticCaseStudiesListing from "./StaticCaseStudiesListing";
import { getAllCases, getAllCasePractices } from "@/content/cases-utils";
import { siteOpenGraphDefaults } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Field-tested case studies from lateralworks engagements across semiconductor, hardware, and complex-systems programs. Names and sector-identifying details have been removed.",
  alternates: { canonical: "/results/case-studies" },
  openGraph: { ...siteOpenGraphDefaults, url: "/results/case-studies" },
};

export default function CaseStudiesPage() {
  const allCases = getAllCases();
  const practicesList = getAllCasePractices();
  const total = allCases.length;

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

      <Suspense fallback={<StaticCaseStudiesListing cases={allCases} practicesList={practicesList} />}>
        <CaseStudiesListing cases={allCases} practicesList={practicesList} />
      </Suspense>
    </>
  );
}
