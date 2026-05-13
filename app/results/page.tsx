import Link from "next/link";
import { results, siteOpenGraphDefaults } from "@/content/site-data";
import CaseStudiesTeaser from "@/components/CaseStudiesTeaser";
import ExperienceModal from "@/components/ExperienceModal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results",
  description: results.hero.body,
  alternates: { canonical: "/results" },
  openGraph: { ...siteOpenGraphDefaults, url: "/results" },
};

export default function ResultsPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{results.hero.label}</p>
          <h1 className="font-semibold tracking-tight text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl">{results.hero.headline}</h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">{results.hero.body}</p>
        </div>
      </section>

      {results.caseStudies.map((study, i) => (
        <section key={study.id} id={study.id} className={`py-20 lg:py-28 ${i % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}>
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:border-r border-border pr-0 lg:pr-10">
                <span className="tag mb-6 block">{study.industry}</span>
                <div className="stat-number text-5xl lg:text-6xl text-navy mb-2">{study.metric.split(" ")[0]}</div>
                <p className="text-sm font-light text-ink-secondary mb-2">{study.metric.split(" ").slice(1).join(" ")}</p>
                <p className="text-[11px] font-light text-ink-muted uppercase tracking-wider">{study.submetric}</p>
              </div>
              <div className="lg:col-span-2">
                <div className="hairline pb-6 mb-8">
                  <p className="section-label mb-3">{study.client}</p>
                  <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl">{study.headline}</h2>
                </div>
                <p className="text-base font-normal text-ink mb-4 leading-relaxed">{study.body}</p>
                <p className="text-[13px] font-light text-ink-secondary leading-relaxed">{study.detail}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CaseStudiesTeaser />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 text-center">
        <ExperienceModal />
      </div>

      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold tracking-tight text-white text-2xl lg:text-3xl mb-2">Ready to add your program to this list?</h3>
            <p className="text-sm font-light text-white/50">Let&apos;s talk about what schedule acceleration looks like for you.</p>
          </div>
          <Link href="/contact" className="shrink-0 text-[12px] font-semibold tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
