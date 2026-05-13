import { Suspense } from "react";
import DocsListing from "./DocsListing";
import StaticDocsListing from "./StaticDocsListing";
import { getAllDocMeta, getAllDocCategories } from "@/content/docs-utils";
import { siteOpenGraphDefaults } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "Release notes, how-to guides, and troubleshooting documentation for fastProjectAI, fastDecisionAI, and Cost-of-delayAI.",
  alternates: { canonical: "/docs" },
  openGraph: { ...siteOpenGraphDefaults, url: "/docs" },
};

export default function DocsPage() {
  const allDocs = getAllDocMeta();
  const categories = getAllDocCategories();
  const total = allDocs.length;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">Docs</p>
          <h1 className="font-semibold text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            {total > 0 ? `${total} documents. Release notes, guides, and how-tos.` : "Docs. Release notes, guides, and how-tos."}
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            Reference material for fastProjectAI, fastDecisionAI, and Cost-of-delayAI users — release notes,
            common solutions, and concept explanations from the practitioner team.
          </p>
        </div>
      </section>

      <Suspense fallback={<StaticDocsListing docs={allDocs} categories={categories} />}>
        <DocsListing docs={allDocs} categories={categories} />
      </Suspense>
    </>
  );
}
