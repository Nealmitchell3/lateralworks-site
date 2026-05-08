import Link from "next/link";
import DocCard from "./DocCard";
import type { DocMeta } from "@/content/doc-types";

interface Props {
  docs: DocMeta[];
  categories: string[];
}

export default function StaticDocsListing({ docs, categories }: Props) {
  return (
    <>
      {/* Category filter — unfiltered baseline */}
      {categories.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">Filter by</span>
              <Link href="/docs" className="tag transition-colors border-navy text-navy bg-navy/5">
                All
              </Link>
              {categories.map((cat) => (
                <Link key={cat} href={`/docs?category=${encodeURIComponent(cat)}`}
                  className="tag transition-colors hover:border-navy hover:text-navy">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List — full unfiltered */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div data-pagefind-ignore="all" className="divide-y divide-border">
            {docs.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
          <div className="hairline pt-8 mt-8">
            <p className="text-sm font-light text-ink-muted">
              {docs.length} document{docs.length !== 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
