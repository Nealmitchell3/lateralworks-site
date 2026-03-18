import Link from "next/link";
import { academy } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy",
  description: academy.hero.body,
};

export default function AcademyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{academy.hero.label}</p>
          <h1 className="display-heading text-white text-5xl lg:text-6xl xl:text-7xl mb-4 max-w-3xl">
            {academy.hero.headline}
          </h1>
          <p className="font-display text-2xl font-300 text-gold italic mb-6">
            {academy.hero.subhead}
          </p>
          <p className="text-base font-sans font-300 text-white/60 max-w-2xl leading-relaxed">
            {academy.hero.body}
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {academy.tracks.map((track) => (
              <div key={track.product} className="bg-cream p-10 card-hover">
                <div className="inline-block text-[10px] font-sans font-600 tracking-widest uppercase bg-gold text-white px-3 py-1 mb-6">
                  {track.count}
                </div>
                <h2 className="font-display text-3xl font-500 text-navy mb-1">
                  {track.product}
                </h2>
                <p className="section-label mb-4">{track.topic}</p>
                <p className="text-[13px] font-sans font-300 text-ink-secondary leading-relaxed">
                  {track.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process note */}
      <section className="bg-cream-dark py-16 lg:py-20 border-y border-border">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 max-w-3xl">
          <p className="section-label mb-4">How it works</p>
          <h2 className="display-heading text-navy text-3xl lg:text-4xl mb-6">
            Concept → Function → Practice
          </h2>
          <p className="text-base font-sans font-300 text-ink-secondary leading-relaxed">
            Every FTTM Academy module follows the same three-stage learning arc. First you learn the
            concept and why it matters. Then you see how it functions in a real program context.
            Then you practice it — applying the technique to exercises drawn from actual program
            scenarios. The same sequence that has trained practitioners on 200+ global engagements.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="display-heading text-white text-2xl lg:text-3xl mb-2">
              Ready to start learning?
            </h3>
            <p className="text-sm font-sans font-300 text-white/50">
              Contact us to access the full FTTM Academy.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 text-[12px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors"
          >
            Get Access
          </Link>
        </div>
      </section>
    </>
  );
}
