import Link from "next/link";
import { about, siteOpenGraphDefaults } from "@/content/site-data";
import TeamSection from "@/components/TeamSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: about.hero.body,
  alternates: { canonical: "/about" },
  openGraph: { ...siteOpenGraphDefaults, url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{about.hero.label}</p>
          <h1 className="font-semibold tracking-tight text-white text-5xl lg:text-6xl xl:text-7xl mb-4">{about.hero.headline}</h1>
          <p className=" text-2xl font-light text-gold italic mb-6">{about.hero.subhead}</p>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">{about.hero.body}</p>
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="hairline pb-6 pt-0">
              <p className="section-label mb-3">Our Story</p>
              <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl mb-6">{about.story.headline}</h2>
              <p className="text-base font-light text-ink-secondary leading-relaxed">
                {(() => {
                  const parts = about.story.body.split("The research project");
                  return (
                    <>
                      {parts[0]}
                      <Link href="/research" className="text-navy hover:text-gold underline underline-offset-2 transition-colors">
                        The research project
                      </Link>
                      {parts.slice(1).join("The research project")}
                    </>
                  );
                })()}
              </p>
              <Link href="/research" className="inline-block mt-6 text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
                More about our original research →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border self-start">
              {[{number:"1988",label:"Founded"},{number:"200+",label:"FTTM Projects"},{number:"36yr",label:"Research"},{number:"$7B+",label:"Accelerated"}].map(item => (
                <div key={item.label} className="bg-cream p-6">
                  <div className="stat-number text-4xl text-navy mb-1">{item.number}</div>
                  <div className="text-[11px] font-medium uppercase tracking-widest text-ink-muted">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

      <section className="bg-navy py-16 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold tracking-tight text-white text-2xl lg:text-3xl mb-2">Let&apos;s work together.</h3>
            <p className="text-sm font-light text-white/50">Tell us about your program.</p>
          </div>
          <Link href="/contact" className="shrink-0 text-[12px] font-semibold tracking-wider uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
