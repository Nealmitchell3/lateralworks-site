"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DocCard from "./DocCard";
import type { DocMeta } from "@/content/doc-types";

const DOCS_PER_PAGE = 20;

interface Props {
  docs: DocMeta[];
  categories: string[];
}

export default function DocsListing({ docs: allDocs, categories }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  let filtered = allDocs;
  if (category) {
    filtered = filtered.filter((d) =>
      d.categories?.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }
  if (tag) {
    filtered = filtered.filter((d) =>
      d.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }
  const total = filtered.length;
  const totalPages = Math.ceil(total / DOCS_PER_PAGE);
  const start = (page - 1) * DOCS_PER_PAGE;
  const docs = filtered.slice(start, start + DOCS_PER_PAGE);
  const hasDocs = docs.length > 0;

  const filterQS = [
    category ? `category=${encodeURIComponent(category)}` : null,
    tag ? `tag=${encodeURIComponent(tag)}` : null,
  ]
    .filter(Boolean)
    .join("&");
  const pageHref = (n: number) =>
    `/docs?${filterQS ? filterQS + "&" : ""}page=${n}`;

  return (
    <>
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
                <DocCard key={doc.slug} doc={doc} />
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
