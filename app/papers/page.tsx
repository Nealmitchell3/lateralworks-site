import { Suspense } from "react";
import PapersListing from "./PapersListing";
import StaticPapersListing from "./StaticPapersListing";
import { getAllPapers, getAllSeries } from "@/content/papers-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papers",
  description: "Research findings, methodology papers, and field-tested frameworks from the lateralworks team.",
};

export default function PapersPage() {
  const allPapers = getAllPapers();
  const seriesList = getAllSeries();
  const total = allPapers.length;

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

      <Suspense fallback={<StaticPapersListing papers={allPapers} seriesList={seriesList} />}>
        <PapersListing papers={allPapers} seriesList={seriesList} />
      </Suspense>
    </>
  );
}
