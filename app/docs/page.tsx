import Link from "next/link";
import { getAllDocCategories, getDocsByPage } from "@/content/docs-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "Release notes, how-to guides, and troubleshooting documentation for fastProject, fastDecision, and fastROI.",
};

interface Props {
  searchParams: { category?: string; tag?: string; page?: string };
}

export default function DocsPage({ searchParams }: Props) {
  const category = searchParams.category || "";
  const tag = searchParams.tag || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));

  const { docs, totalPages, total } = getDocsByPage(page, category, tag);
  const categories = getAllDocCategories();
  const hasDocs = docs.length > 0;

  const filterQS = [
    category ? `category=${encodeURIComponent(category)}` : null,
    tag ? `tag=${encodeURIComponent(tag)}` : null,
  ].filter(Boolean).join("&");
  const pageHref = (n: number) => `/docs?${filterQS ? filterQS + "&" : ""}page=${n}`;

  const heroHeadline =
    total > 0 && tag && !category
      ? `${total} documents tagged "${tag}".`
      : total > 0
        ? `${total} documents. Release notes, guides, and how-tos.`
        : "Docs. Release notes, guides, and how-tos.";

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">Docs</p>
          <h1 className="font-semibold text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            {heroHeadline}
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            Reference material for fastProject, fastDecision, and fastROI users — release notes,
            common solutions, and concept explanations from the practitioner team.
          </p>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">Filter by</span>
              <Link href="/docs"
                className={`tag transition-colors ${!category ? "border-navy text-navy bg-navy/5" : "hover:border-navy hover:text-navy"}`}>
                All
              </Link>
              {categories.map((cat) => (
                <Link key={cat} href={`/docs?category=${encodeURIComponent(cat)}`}
                  className={`tag transition-colors ${category.toLowerCase() === cat.toLowerCase() ? "border-navy text-navy bg-navy/5" : "hover:border-navy hover:text-navy"}`}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">

          {category && (
            <div className="mb-8 pb-6 hairline flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Category</p>
                <h2 className="font-semibold text-navy text-2xl">{category}</h2>
              </div>
              <Link href="/docs" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted hover:text-navy transition-colors">
                ← All docs
              </Link>
            </div>
          )}

          {tag && (
            <div className="mb-8 pb-6 hairline flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Tag</p>
                <h2 className="font-semibold text-navy text-2xl">{tag}</h2>
              </div>
              <Link href="/docs" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted hover:text-navy transition-colors">
                ← All docs
              </Link>
            </div>
          )}

          {!hasDocs && (
            <div className="py-24 text-center">
              <h2 className="font-semibold text-navy text-2xl mb-3">No documents found</h2>
              <p className="text-sm font-light text-ink-muted">Try a different category.</p>
            </div>
          )}

          {hasDocs && (
            <div className="divide-y divide-border">
              {docs.map((doc) => (
                <Link key={doc.slug} href={`/docs/${doc.slug}`}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 py-8 group">
                  <div className="shrink-0 sm:w-44">
                    <p className="text-[11px] font-light text-ink-muted mb-2">{doc.date || "—"}</p>
                    {doc.categories?.slice(0, 2).map((cat) => (
                      <span key={cat} className="tag block w-fit mb-1">{cat}</span>
                    ))}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h2 className="font-semibold text-navy text-xl leading-snug mb-2 group-hover:text-navy/70 transition-colors"
                      style={{ letterSpacing: "-0.01em" }}>
                      {doc.title}
                    </h2>
                    {doc.excerpt && (
                      <p className="text-[13px] font-light text-ink-secondary leading-relaxed line-clamp-2">{doc.excerpt}</p>
                    )}
                  </div>
                  <div className="shrink-0 self-center text-gold group-hover:translate-x-1 transition-transform hidden sm:block">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-10 mt-8 hairline">
              <div>
                {page > 1 && (
                  <Link href={pageHref(page - 1)}
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy hover:text-gold transition-colors">
                    ← Previous
                  </Link>
                )}
              </div>
              <p className="text-[12px] font-light text-ink-muted">Page {page} of {totalPages} · {total} documents</p>
              <div>
                {page < totalPages && (
                  <Link href={pageHref(page + 1)}
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy hover:text-gold transition-colors">
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}

          {hasDocs && totalPages <= 1 && (
            <div className="hairline pt-8 mt-8">
              <p className="text-sm font-light text-ink-muted">
                {total} document{total !== 1 ? "s" : ""}{category ? ` in ${category}` : ""}{tag ? ` tagged "${tag}"` : ""}.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
