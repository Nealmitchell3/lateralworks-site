import Link from "next/link";
import { ideas } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ideas", description: ideas.hero.body };

export default function IdeasPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{ideas.hero.label}</p>
          <h1 className="mb-6 max-w-3xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>{ideas.hero.headline}</h1>
          <p className="text-base font-sans font-300 leading-relaxed max-w-2xl" style={{ color: "var(--ink-secondary)" }}>{ideas.hero.body}</p>
        </div>
      </section>

      <section className="bg-white py-4 sticky top-16 z-40" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-sans font-600 uppercase tracking-widest mr-2" style={{ color: "var(--ink-muted)" }}>Browse by</span>
            {ideas.categories.map(cat => (
              <span key={cat} className="tag cursor-pointer hover:border-navy hover:text-navy transition-colors">{cat}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {ideas.articles.map(article => (
              <Link key={article.title} href={article.href}
                className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-8 group"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="shrink-0 sm:w-40">
                  <span className="tag">{article.category}</span>
                  <p className="text-[11px] font-sans font-300 mt-2" style={{ color: "var(--ink-muted)" }}>{article.date}</p>
                </div>
                <div className="flex-grow">
                  <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.3rem", lineHeight: 1.3, color: "var(--ink)", marginBottom: "0.75rem" }}
                    className="group-hover:opacity-60 transition-opacity">{article.title}</h2>
                  <p className="text-[13px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{article.excerpt}</p>
                </div>
                <div className="shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "var(--navy)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-sm font-sans font-300 mt-8 pt-8" style={{ color: "var(--ink-muted)", borderTop: "1px solid var(--border)" }}>
            Showing {ideas.articles.length} of 166 articles. Full library available on request.
          </p>
        </div>
      </section>
    </>
  );
}
