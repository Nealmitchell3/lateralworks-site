import Link from "next/link";
import { about, team } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", description: about.hero.body };

export default function AboutPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{about.hero.label}</p>
          <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }} className="mb-3">{about.hero.headline}</h1>
          <p className="font-sans font-300 text-lg italic mb-5" style={{ color: "var(--navy)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>{about.hero.subhead}</p>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{about.hero.body}</p>
        </div>
      </section>

      <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--gray-50)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="section-label mb-3">Our Story</p>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>{about.story.headline}</h2>
              <p className="text-base font-sans font-300 leading-relaxed" style={{ color: "var(--ink-secondary)" }}>{about.story.body}</p>
            </div>
            <div className="grid grid-cols-2 gap-px self-start" style={{ backgroundColor: "var(--border)" }}>
              {[{number:"1988",label:"Founded"},{number:"200+",label:"FTTM Projects"},{number:"36yr",label:"Research"},{number:"$7B+",label:"Accelerated"}].map(item => (
                <div key={item.label} className="bg-white p-6">
                  <div className="stat-number mb-1" style={{ fontSize: "2.5rem", color: "var(--navy)" }}>{item.number}</div>
                  <div className="text-[10px] font-sans font-500 uppercase tracking-widest" style={{ color: "var(--ink-muted)" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="pb-8 mb-12 hairline">
            <p className="section-label mb-3">{team.sectionLabel}</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>{team.headline}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {team.members.map(member => (
              <div key={member.name} className="bg-white p-8 card-hover">
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ backgroundColor: "var(--navy)" }}>
                  <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.1rem", color: "white" }}>{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-sans font-500 text-sm mb-1" style={{ color: "var(--ink)" }}>{member.name}</h3>
                <p className="section-label mb-3">{member.role}</p>
                <p className="text-[12px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "white" }} className="mb-1">Let's work together.</h3>
            <p className="text-sm font-sans font-300 opacity-50 text-white">Tell us about your program.</p>
          </div>
          <Link href="/contact" className="shrink-0 inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-white hover:opacity-90 transition-opacity" style={{ color: "var(--navy)" }}>Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
