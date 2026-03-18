import Link from "next/link";
import { software } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Software", description: software.hero.body };

export default function SoftwarePage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{software.hero.label}</p>
          <h1 className="mb-4 max-w-3xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>{software.hero.headline}</h1>
          <p className="font-sans font-300 text-lg italic mb-5" style={{ color: "var(--navy)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>{software.hero.subhead}</p>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{software.hero.body}</p>
        </div>
      </section>

      {software.products.map((product, i) => (
        <section key={product.id} id={product.id} className="py-20 lg:py-24" style={{ backgroundColor: i % 2 === 0 ? "var(--gray-50)" : "var(--white)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <div className="pb-6 mb-8 hairline">
                  <p className="section-label mb-3">{product.name}</p>
                  <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>{product.tagline}</h2>
                </div>
                <p className="text-base font-sans font-300 leading-relaxed mb-6" style={{ color: "var(--ink-secondary)" }}>{product.body}</p>
                <span className="text-[11px] font-sans font-600 tracking-wider uppercase px-4 py-2" style={{ border: "1px solid var(--navy)", color: "var(--navy)" }}>{product.modules}</span>
              </div>
              <div>
                <h3 className="text-[10px] font-sans font-600 uppercase tracking-widest mb-5" style={{ color: "var(--ink-muted)" }}>Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1 h-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--navy)" }} />
                      <span className="text-[13px] font-sans font-400" style={{ color: "var(--ink-secondary)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 lg:py-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "white" }} className="mb-1">Questions about fastWorks?</h3>
            <p className="text-sm font-sans font-300 opacity-50 text-white">We're happy to walk you through the software.</p>
          </div>
          <Link href="/contact" className="shrink-0 inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-white hover:opacity-90 transition-opacity" style={{ color: "var(--navy)" }}>Get in Touch</Link>
        </div>
      </section>
    </>
  );
}
