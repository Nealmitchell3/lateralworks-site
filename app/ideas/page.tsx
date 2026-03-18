import Link from "next/link";
import { ideas } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ideas", description: ideas.hero.body };

export default function IdeasPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{ideas.hero.label}</p>
          <h1 className="font-semibold tracking-tight text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl">{ideas.hero.headline}</h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">{ideas.hero.body}</p>
        </div>
      </section>

      <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mr-2">Browse by</span>
            {ideas.categories.map(cat => (
              <span key={cat} className="tag cursor-pointer hover:border-navy hover:text-navy transition-colors">{cat}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="divide-y divide-border">
            {ideas.articles.map(article => (
              <Link key={article.title} href={article.href} className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-8 group">
                <div className="shrink-0 sm:w-36">
                  <span className="tag">{article.category}</span>
                  <p className="text-[11px] font-light text-ink-muted mt-2">{article.date}</p>
                </div>
                <div className="flex-grow">
                  <h2 className=" text-xl lg:text-2xl font-normal text-navy mb-3 group-hover:text-navy/70 transition-colors leading-snug">{article.title}</h2>
                  <p className="text-[13px] font-light text-ink-secondary leading-relaxed">{article.excerpt}</p>
                </div>
                <div className="shrink-0 text-gold group-hover:translate-x-1 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
          <div className="hairline pt-8 mt-8">
            <p className="text-sm font-light text-ink-muted">Showing {ideas.articles.length} of 166 articles. Full library available on request.</p>
          </div>
        </div>
      </section>
    </>
  );
}
