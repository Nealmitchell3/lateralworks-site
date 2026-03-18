import Link from "next/link";
import { academy } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Academy", description: academy.hero.body };

export default function AcademyPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{academy.hero.label}</p>
          <h1 className="mb-4 max-w-3xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>{academy.hero.headline}</h1>
          <p className="font-sans font-300 text-lg italic mb-5" style={{ color: "var(--navy)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>{academy.hero.subhead}</p>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{academy.hero.body}</p>
        </div>
      </section>

      <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--gray-50)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {academy.tracks.map(track => (
              <div key={track.product} className="bg-white p-10 card-hover">
                <div className="inline-block text-[9px] font-sans font-600 tracking-widest uppercase px-2.5 py-1 mb-6" style={{ backgroundColor: "var(--navy)", color: "white" }}>{track.count}</div>
                <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "var(--ink)", marginBottom: "0.25rem" }}>{track.product}</h2>
                <p className="section-label mb-4">{track.topic}</p>
                <p className="text-[13px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-secondary)" }}>{track.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10" style={{ maxWidth: "48rem" }}>
          <p className="section-label mb-4">How it works</p>
          <h2 className="mb-5" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--ink)" }}>Concept → Function → Practice</h2>
          <p className="text-base font-sans font-300 leading-relaxed" style={{ color: "var(--ink-secondary)" }}>Every FTTM Academy module follows the same three-stage learning arc. First you learn the concept and why it matters. Then you see how it functions in a real program context. Then you practice it — applying the technique to exercises drawn from actual program scenarios.</p>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "white" }} className="mb-1">Ready to start learning?</h3>
            <p className="text-sm font-sans font-300 opacity-50 text-white">Contact us to access the full FTTM Academy.</p>
          </div>
          <Link href="/contact" className="shrink-0 inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-white hover:opacity-90 transition-opacity" style={{ color: "var(--navy)" }}>Get Access</Link>
        </div>
      </section>
    </>
  );
}
