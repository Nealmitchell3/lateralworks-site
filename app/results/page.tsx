import Link from "next/link";
import { results } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Results", description: results.hero.body };

export default function ResultsPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{results.hero.label}</p>
          <h1 className="mb-6 max-w-3xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>{results.hero.headline}</h1>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{results.hero.body}</p>
        </div>
      </section>

      {results.caseStudies.map((study, i) => (
        <section key={study.id} id={study.id} className="py-20 lg:py-28" style={{ backgroundColor: i % 2 === 0 ? "var(--gray-50)" : "var(--white)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:pr-10" style={{ borderRight: "1px solid var(--border)" }}>
                <span className="tag mb-6 block">{study.industry}</span>
                <div className="stat-number mb-2" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "var(--navy)" }}>{study.metric.split(" ")[0]}</div>
                <p className="text-sm font-sans font-300 mb-2" style={{ color: "var(--ink-secondary)" }}>{study.metric.split(" ").slice(1).join(" ")}</p>
                <p className="text-[11px] font-sans font-300 uppercase tracking-wider" style={{ color: "var(--ink-muted)" }}>{study.submetric}</p>
              </div>
              <div className="lg:col-span-2">
                <div className="pb-6 mb-8 hairline">
                  <p className="section-label mb-3">{study.client}</p>
                  <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>{study.headline}</h2>
                </div>
                <p className="text-base font-sans font-400 mb-4 leading-relaxed" style={{ color: "var(--ink)" }}>{study.body}</p>
                <p className="text-[13px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{study.detail}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 lg:py-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "white" }} className="mb-1">Ready to add your program to this list?</h3>
            <p className="text-sm font-sans font-300 opacity-50 text-white">Let's discuss what schedule acceleration looks like for you.</p>
          </div>
          <Link href="/contact" className="shrink-0 inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-white hover:opacity-90 transition-opacity" style={{ color: "var(--navy)" }}>Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
