import Link from "next/link";
import { getAllCategories, getPostsByPage } from "@/content/posts-utils";
import ListenWatchBlock from "@/components/ListenWatchBlock";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas",
  description: "Articles on fast-time-to-market, critical path, decision quality, and product acceleration.",
};

interface Props {
  searchParams: { category?: string; tag?: string; page?: string };
}

export default function IdeasPage({ searchParams }: Props) {
  const category = searchParams.category || "";
  const tag = searchParams.tag || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));

  const { posts, totalPages, total } = getPostsByPage(page, category, tag);
  const categories = getAllCategories();
  const hasPosts = posts.length > 0;

  const filterQS = [
    category ? `category=${encodeURIComponent(category)}` : null,
    tag ? `tag=${encodeURIComponent(tag)}` : null,
  ].filter(Boolean).join("&");
  const pageHref = (n: number) => `/ideas?${filterQS ? filterQS + "&" : ""}page=${n}`;

  const heroHeadline =
    total > 0 && tag && !category
      ? `${total} articles tagged "${tag}".`
      : total > 0
        ? `${total} articles. 36 years of thinking.`
        : "Ideas. 36 years of thinking.";

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">Ideas</p>
          <h1 className="font-semibold text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            {heroHeadline}
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            Research findings, methodology insights, and practical guidance accumulated
            across three decades of fast-time-to-market work.
          </p>
        </div>
      </section>

      <ListenWatchBlock />

      {/* Category filter */}
      {categories.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">Browse by</span>
              <Link href="/ideas"
                className={`tag transition-colors ${!category ? "border-navy text-navy bg-navy/5" : "hover:border-navy hover:text-navy"}`}>
                All
              </Link>
              {categories.map((cat) => (
                <Link key={cat} href={`/ideas?category=${encodeURIComponent(cat)}`}
                  className={`tag transition-colors ${category.toLowerCase() === cat.toLowerCase() ? "border-navy text-navy bg-navy/5" : "hover:border-navy hover:text-navy"}`}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">

          {category && (
            <div className="mb-8 pb-6 hairline flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Category</p>
                <h2 className="font-semibold text-navy text-2xl">{category}</h2>
              </div>
              <Link href="/ideas" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted hover:text-navy transition-colors">
                ← All Ideas
              </Link>
            </div>
          )}

          {tag && (
            <div className="mb-8 pb-6 hairline flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Tag</p>
                <h2 className="font-semibold text-navy text-2xl">{tag}</h2>
              </div>
              <Link href="/ideas" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted hover:text-navy transition-colors">
                ← All Ideas
              </Link>
            </div>
          )}

          {!hasPosts && (
            <div className="py-24 text-center">
              <h2 className="font-semibold text-navy text-2xl mb-3">No posts found</h2>
              <p className="text-sm font-light text-ink-muted">Try a different category.</p>
            </div>
          )}

          {hasPosts && (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <Link key={post.slug} href={`/ideas/${post.slug}`}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 py-8 group">
                  <div className="shrink-0 sm:w-44">
                    <p className="text-[11px] font-light text-ink-muted mb-2">{post.date}</p>
                    <div className="flex flex-col gap-1.5 items-start">
                      {post.categories?.map((c) => (
                        <span key={c} className="tag w-fit">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h2 className="font-semibold text-navy text-xl leading-snug mb-2 group-hover:text-navy/70 transition-colors"
                      style={{ letterSpacing: "-0.01em" }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-[13px] font-light text-ink-secondary leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.author && (
                      <p className="text-[11px] font-light text-ink-muted mt-2">{post.author}</p>
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
              <p className="text-[12px] font-light text-ink-muted">Page {page} of {totalPages} · {total} articles</p>
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

          {hasPosts && totalPages <= 1 && (
            <div className="hairline pt-8 mt-8">
              <p className="text-sm font-light text-ink-muted">
                {total} article{total !== 1 ? "s" : ""}{category ? ` in ${category}` : ""}{tag ? ` tagged "${tag}"` : ""}.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
