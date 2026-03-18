import Link from "next/link";
import { methodology } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description: methodology.hero.body,
};

export default function MethodologyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{methodology.hero.label}</p>
          <h1 className="display-heading text-white text-5xl lg:text-6xl xl:text-7xl mb-4 max-w-3xl">
            {methodology.hero.headline}
          </h1>
          <p className="font-display text-2xl font-300 text-gold italic mb-6">
            {methodology.hero.subhead}
          </p>
          <p className="text-base font-sans font-300 text-white/60 max-w-2xl leading-relaxed">
            {methodology.hero.body}
          </p>
        </div>
      </section>

      {/* Sections */}
      {methodology.sections.map((section, i) => (
        <section
          key={section.label}
          className={`py-20 lg:py-24 ${i % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}
          id={section.label.toLowerCase().replace(/\s+/g, "-")}
        >
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="hairline pb-6 mb-10">
              <p className="section-label mb-3">{section.label}</p>
              <h2 className="display-heading text-navy text-3xl lg:text-4xl max-w-2xl">
                {section.headline}
              </h2>
            </div>

            {"body" in section && typeof section.body === "string" && (
              <p className="text-base font-sans font-300 text-ink-secondary max-w-3xl leading-relaxed">
                {section.body}
              </p>
            )}

            {"items" in section && Array.isArray(section.items) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border mt-8">
                {(section.items as { title: string; body: string }[]).map((item) => (
                  <div key={item.title} className={`p-8 ${i % 2 === 0 ? "bg-cream" : "bg-cream-dark"}`}>
                    <h3 className="font-display text-xl font-500 text-navy mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[13px] font-sans font-300 text-ink-secondary leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="display-heading text-white text-2xl lg:text-3xl mb-2">
              Ready to apply FTTM to your program?
            </h3>
            <p className="text-sm font-sans font-300 text-white/50">
              Start with a conversation about your program challenge.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 text-[12px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
