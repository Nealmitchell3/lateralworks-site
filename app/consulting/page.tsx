import Link from "next/link";
import { consulting } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Consulting", description: consulting.hero.body };

export default function ConsultingPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{consulting.hero.label}</p>
          <h1 className="mb-6 max-w-3xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>{consulting.hero.headline}</h1>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{consulting.hero.body}</p>
        </div>
      </section>

      <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--gray-50)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="pb-8 mb-12 hairline">
            <p className="section-label mb-3">Engagement Model</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>{consulting.model.headline}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {consulting.model.steps.map(step => (
              <div key={step.number} className="bg-white p-8">
                <div className="mb-6 select-none" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "3rem", fontWeight: 300, lineHeight: 1, color: "var(--gray-200)" }}>{step.number}</div>
                <h3 className="font-sans font-500 text-base mb-3" style={{ color: "var(--ink)" }}>{step.title}</h3>
                <p className="text-[13px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white" id="training" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="pb-8 mb-12 hairline">
            <p className="section-label mb-3">Services</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>What we offer</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {consulting.services.map(service => (
              <div key={service.title} className="bg-white p-8">
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.5rem", color: "var(--ink)", marginBottom: "1rem" }}>{service.title}</h3>
                <p className="text-[13px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "white" }} className="mb-1">Tell us about your program.</h3>
            <p className="text-sm font-sans font-300 opacity-50 text-white">No obligation. A candid view of where FTTM can help.</p>
          </div>
          <Link href="/contact" className="shrink-0 inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-white hover:opacity-90 transition-opacity" style={{ color: "var(--navy)" }}>Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
