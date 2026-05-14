import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc, getAllDocSlugs, getRelatedDocs } from "@/content/docs-utils";
import { siteOpenGraphDefaults, siteTwitterDefaults, siteOrganizationPublisher } from "@/content/site-data";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

const toIsoDateTime = (d?: string): string | undefined => {
  if (!d) return undefined;
  try {
    return new Date(d).toISOString();
  } catch {
    return undefined;
  }
};

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDoc(params.slug);
  if (!doc) return { title: "Document not found" };
  return {
    title: doc.title,
    description: doc.excerpt || doc.title,
    alternates: { canonical: `/docs/${params.slug}` },
    openGraph: {
      ...siteOpenGraphDefaults,
      type: "article",
      title: `${doc.title} | lateralworks`,
      description: doc.excerpt,
      publishedTime: doc.dateISO,
      url: `/docs/${params.slug}`,
    },
    twitter: {
      ...siteTwitterDefaults,
      title: `${doc.title} | lateralworks`,
      description: doc.excerpt,
    },
  };
}

export default function DocPage({ params }: Props) {
  const doc = getDoc(params.slug);
  if (!doc) notFound();

  const related = getRelatedDocs(params.slug, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.excerpt || doc.title,
    image: doc.images?.[0]?.src
      ? `https://lateralworks.com${doc.images[0].src}`
      : "https://lateralworks.com/logo.svg",
    datePublished: toIsoDateTime(doc.dateISO),
    dateModified: toIsoDateTime(doc.dateISO),
    author: {
      "@type": "Person",
      name: doc.author,
      url: "https://lateralworks.com/about",
    },
    publisher: siteOrganizationPublisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lateralworks.com/docs/${params.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Header */}
      <section className="bg-navy pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-8">
              <Link href="/docs" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/40 hover:text-white/70 transition-colors">
                Docs
              </Link>
              {doc.categories?.slice(0, 1).map((cat) => (
                <span key={cat} className="flex items-center gap-2">
                  <span className="text-white/20">/</span>
                  <Link href={`/docs?category=${encodeURIComponent(cat)}`}
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
                    {cat}
                  </Link>
                </span>
              ))}
            </div>

            <h1 className="font-semibold text-white text-4xl lg:text-5xl xl:text-6xl mb-6"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              {doc.title}
            </h1>

            {doc.excerpt && (
              <p className="text-base font-light text-white/60 leading-relaxed mb-8 max-w-2xl">
                {doc.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              {doc.author && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Author</p>
                  <p className="text-sm font-medium text-white/80">{doc.author}</p>
                </div>
              )}
              {doc.date && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Published</p>
                  <p className="text-sm font-medium text-white/80">{doc.date}</p>
                </div>
              )}
              {doc.categories?.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.categories.map((cat) => (
                      <Link key={cat} href={`/docs?category=${encodeURIComponent(cat)}`}
                        className="text-[11px] font-semibold text-gold hover:text-gold-light transition-colors">
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <article className="lg:col-span-8">
              <div className="post-content" dangerouslySetInnerHTML={{ __html: doc.content }} />

              {/* Tags section hidden — source data is non-discriminating (every doc has the same 4 tags). Re-enable when source tags carry signal. Infrastructure (?tag= filter, getAllDocTags) preserved. */}
              {/*
              {doc.tags?.length > 0 && (
                <div className="mt-12 pt-8 hairline">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.tags.map((tag) => (
                      <Link key={tag} href={`/docs?tag=${encodeURIComponent(tag)}`} className="tag hover:border-navy hover:text-navy transition-colors">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              */}

              <div className="mt-12 pt-8 hairline">
                <Link href="/docs"
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy hover:text-gold transition-colors">
                  ← Back to Docs
                </Link>
              </div>
            </article>

            <aside data-pagefind-ignore="all" className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {related.length > 0 && (
                  <div>
                    <p className="section-label mb-5">Related</p>
                    <div className="space-y-5">
                      {related.map((rel) => (
                        <Link key={rel.slug} href={`/docs/${rel.slug}`} className="block group">
                          <div className="flex items-start gap-3 mb-1">
                            {rel.categories?.slice(0,1).map(c => (
                              <span key={c} className="tag shrink-0">{c}</span>
                            ))}
                          </div>
                          <h3 className="font-medium text-navy text-sm leading-snug group-hover:text-navy/70 transition-colors">
                            {rel.title}
                          </h3>
                          <p className="text-[11px] font-light text-ink-muted mt-1">{rel.date}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-navy p-6">
                  <p className="section-label mb-3">Need help?</p>
                  <p className="text-sm font-light text-white/60 leading-relaxed mb-4">
                    Have a question that isn't answered here? Get in touch with the lateralworks team.
                  </p>
                  <Link href="/contact"
                    className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-gold text-white hover:bg-gold-light transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
