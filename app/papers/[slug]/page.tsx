import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaper, getRelatedPapers, getAllPapers, formatPaperDate } from "@/content/papers-utils";
import { siteOpenGraphDefaults, siteTwitterDefaults, siteOrganizationPublisher } from "@/content/site-data";
import ShareButton from "@/components/ShareButton";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paper = getPaper(params.slug);
  if (!paper) return {};
  const description = paper.subtitle || paper.abstract.slice(0, 155);
  return {
    title: paper.title,
    description,
    alternates: { canonical: `/papers/${paper.slug}` },
    openGraph: {
      ...siteOpenGraphDefaults,
      type: "article",
      title: `${paper.title} | lateralworks`,
      description,
      publishedTime: paper.date,
      url: `/papers/${paper.slug}`,
      images: [paper.thumb],
    },
    twitter: {
      ...siteTwitterDefaults,
      title: `${paper.title} | lateralworks`,
      description,
      images: [paper.thumb],
    },
  };
}

export default function PaperPage({ params }: Props) {
  const paper = getPaper(params.slug);
  if (!paper) notFound();

  const related = getRelatedPapers(paper.slug, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: paper.title,
    description: paper.subtitle,
    image: `https://lateralworks.com${paper.thumb}`,
    datePublished: new Date(paper.date + "T00:00:00Z").toISOString(),
    dateModified: new Date(paper.date + "T00:00:00Z").toISOString(),
    author: {
      "@type": "Organization",
      name: "lateralworks",
      url: "https://lateralworks.com/about",
    },
    publisher: siteOrganizationPublisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lateralworks.com/papers/${paper.slug}`,
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
              <Link href="/papers" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/40 hover:text-white/70 transition-colors">
                Papers
              </Link>
              <span className="flex items-center gap-2">
                <span className="text-white/20">/</span>
                <Link href={`/papers?series=${encodeURIComponent(paper.series)}`}
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
                  {paper.series}
                </Link>
              </span>
            </div>

            <h1 className="font-semibold text-white text-4xl lg:text-5xl xl:text-6xl mb-6"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              {paper.title}
            </h1>

            {paper.subtitle && (
              <p className="text-base font-light text-white/60 leading-relaxed mb-8 max-w-2xl">
                {paper.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Series</p>
                <p className="text-sm font-medium text-white/80">{paper.series}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Published</p>
                <p className="text-sm font-medium text-white/80">{formatPaperDate(paper.date)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Length</p>
                <p className="text-sm font-medium text-white/80">{paper.pages} pages</p>
              </div>
              <div className="ml-auto">
                <ShareButton
                  url={`https://lateralworks.com/papers/${paper.slug}`}
                  colorClasses="text-white/80 hover:text-gold-light"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            <article className="lg:col-span-8">
              <div className="post-content" dangerouslySetInnerHTML={{ __html: paper.contentHtml }} />

              <div className="mt-12 pt-8 hairline">
                <Link href="/papers"
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy hover:text-gold transition-colors">
                  ← Back to Papers
                </Link>
              </div>
            </article>

            <aside data-pagefind-ignore="all" className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Cover + Download */}
                <div className="bg-white p-6 border border-ink/10">
                  <img
                    src={paper.thumb}
                    alt={paper.title}
                    className="w-full h-auto mb-5 border border-ink/10"
                  />
                  <a
                    href={paper.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-gold text-white hover:bg-gold-light transition-colors"
                  >
                    Download PDF
                  </a>
                  <p className="text-[11px] font-light text-ink-muted mt-3 text-center">
                    {paper.pages} pages · {paper.type}
                  </p>
                </div>

                {related.length > 0 && (
                  <div>
                    <p className="section-label mb-5">Related</p>
                    <div className="space-y-5">
                      {related.map((rel) => (
                        <Link key={rel.slug} href={`/papers/${rel.slug}`} className="block group">
                          <div className="flex items-start gap-3 mb-1">
                            <span className="tag shrink-0">{rel.series}</span>
                          </div>
                          <h3 className="font-medium text-navy text-sm leading-snug group-hover:text-navy/70 transition-colors">
                            {rel.title}
                          </h3>
                          <p className="text-[11px] font-light text-ink-muted mt-1">{formatPaperDate(rel.date)}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-navy p-6">
                  <p className="section-label mb-3">Questions?</p>
                  <p className="text-sm font-light text-white/60 leading-relaxed mb-4">
                    Learn how lateralworks applies these ideas to real technology programs.
                  </p>
                  <Link href="/contact"
                    className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-gold text-white hover:bg-gold-light transition-colors">
                    Start a Conversation
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
