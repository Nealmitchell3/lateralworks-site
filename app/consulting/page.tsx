import Link from "next/link";
import { consulting } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Consulting", description: consulting.hero.body };

export default function ConsultingPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{consulting.hero.label}</p>
          <h1 className="display-heading text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl">{consulting.hero.headline}</h1>
          <p className="text-base font-sans font-300 text-white/60 max-w-2xl leading-relaxed">{consulting.hero.body}</p>
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="hairline pb-6 mb-12">
            <p className="section-label mb-3">Engagement Model</p>
            <h2 className="display-heading text-navy text-3xl lg:text-4xl">{consulting.model.headline}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {consulting.model.steps.map(step => (
              <div key={step.number} className="bg-cream p-8">
                <div className="font-display text-5xl font-300 text-navy/10 leading-none mb-6 select-none">{step.number}</div>
                <h3 className="font-display text-xl font-500 text-navy mb-3">{step.title}</h3>
                <p className="text-[13px] font-sans font-300 text-ink-secondary leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20 lg:py-28" id="training">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="hairline pb-6 mb-12">
            <p className="section-label mb-3">Services</p>
            <h2 className="display-heading text-navy text-3xl lg:text-4xl">What we offer</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
            {consulting.services.map(service => (
              <div key={service.title} className="bg-cream-dark p-8">
                <h3 className="font-display text-2xl font-500 text-navy mb-4">{service.title}</h3>
                <p className="text-[13px] font-sans font-300 text-ink-secondary leading-relaxed">{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="display-heading text-white text-2xl lg:text-3xl mb-2">Tell us about your program.</h3>
            <p className="text-sm font-sans font-300 text-white/50">No obligation. We&apos;ll give you a candid view of where FTTM can help.</p>
          </div>
          <Link href="/contact" className="shrink-0 text-[12px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
