import Link from "next/link";
import { software } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Software", description: software.hero.body };

export default function SoftwarePage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{software.hero.label}</p>
          <h1 className="font-semibold tracking-tight text-white text-5xl lg:text-6xl xl:text-7xl mb-4 max-w-3xl">{software.hero.headline}</h1>
          <p className=" text-2xl font-light text-gold italic mb-6">{software.hero.subhead}</p>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">{software.hero.body}</p>
        </div>
      </section>

      {software.products.map((product, i) => (
        <section key={product.id} id={product.id} className={`py-20 lg:py-24 ${i % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}>
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <div className="hairline pb-6 mb-8">
                  <p className="section-label mb-3">{product.name}</p>
                  <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl">{product.tagline}</h2>
                </div>
                <p className="text-base font-light text-ink-secondary leading-relaxed mb-6">{product.body}</p>
                <div className="inline-block text-[12px] font-semibold tracking-wider uppercase text-gold border border-gold px-4 py-2">{product.modules}</div>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1 h-1 shrink-0 bg-gold rounded-full" />
                      <span className="text-[13px] font-normal text-ink-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold tracking-tight text-white text-2xl lg:text-3xl mb-2">Questions about the fastWorks suite?</h3>
            <p className="text-sm font-light text-white/50">We&apos;re happy to walk you through the software.</p>
          </div>
          <Link href="/contact" className="shrink-0 text-[12px] font-semibold tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors">Get in Touch</Link>
        </div>
      </section>
    </>
  );
}
