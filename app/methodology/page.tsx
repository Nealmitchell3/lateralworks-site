import Link from "next/link";
import { methodology } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Methodology", description: methodology.hero.body };

const H1Style = { fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" } as const;
const H2Style = { fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--ink)" } as const;
const H3Style = { fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.3rem", lineHeight: 1.25, color: "var(--ink)" } as const;

export default function MethodologyPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 max-w-5xl">
          <p className="section-label mb-6">{methodology.hero.label}</p>
          <h1 style={H1Style} className="mb-6 max-w-3xl">{methodology.hero.headline}</h1>
          <p className="font-sans font-300 text-lg italic mb-6" style={{ color: "var(--navy)", fontFamily: "var(--font-cormorant), Georgia, serif" }}>{methodology.hero.subhead}</p>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{methodology.hero.body}</p>
        </div>
      </section>

      {methodology.sections.map((section, i) => (
        <section key={section.label} id={section.label.toLowerCase().replace(/\s+/g,"-")}
          className="py-20 lg:py-24" style={{ backgroundColor: i % 2 === 0 ? "var(--gray-50)" : "var(--white)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="pb-8 mb-10 hairline">
              <p className="section-label mb-3">{section.label}</p>
              <h2 style={H2Style} className="max-w-2xl">{section.headline}</h2>
            </div>
            {"body" in section && typeof section.body === "string" && (
              <p className="text-base font-sans font-300 max-w-3xl leading-relaxed" style={{ color: "var(--ink-secondary)" }}>{section.body}</p>
            )}
            {"items" in section && Array.isArray(section.items) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mt-8" style={{ backgroundColor: "var(--border)" }}>
                {(section.items as {title:string;body:string}[]).map(item => (
                  <div key={item.title} className="bg-white p-8">
                    <h3 style={H3Style} className="mb-3">{item.title}</h3>
                    <p className="text-[13px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="py-16 lg:py-20" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.75rem", color: "white" }} className="mb-1">Ready to apply FTTM?</h3>
            <p className="text-sm font-sans font-300 opacity-50 text-white">Start with a conversation about your program challenge.</p>
          </div>
          <Link href="/contact" className="shrink-0 inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-7 py-4 bg-white hover:opacity-90 transition-opacity" style={{ color: "var(--navy)" }}>
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
