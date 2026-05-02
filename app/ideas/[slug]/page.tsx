import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, getRelatedPosts } from "@/content/posts-utils";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.dateISO,
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(params.slug, 3);

  return (
    <>
      {/* Header */}
      <section className="bg-navy pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-8">
              <Link href="/ideas" className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/40 hover:text-white/70 transition-colors">
                Ideas
              </Link>
              {post.categories?.slice(0, 1).map((cat) => (
                <span key={cat} className="flex items-center gap-2">
                  <span className="text-white/20">/</span>
                  <Link href={`/ideas?category=${encodeURIComponent(cat)}`}
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
                    {cat}
                  </Link>
                </span>
              ))}
            </div>

            <h1 className="font-semibold text-white text-4xl lg:text-5xl xl:text-6xl mb-6"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base font-light text-white/60 leading-relaxed mb-8 max-w-2xl">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Author</p>
                <p className="text-sm font-medium text-white/80">{post.author}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Published</p>
                <p className="text-sm font-medium text-white/80">{post.date}</p>
              </div>
              {post.categories?.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((cat) => (
                      <Link key={cat} href={`/ideas?category=${encodeURIComponent(cat)}`}
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
              <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              {post.tags?.length > 0 && (
                <div className="mt-12 pt-8 hairline">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/ideas?tag=${encodeURIComponent(tag)}`} className="tag hover:border-navy hover:text-navy transition-colors">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 hairline">
                <Link href="/ideas"
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy hover:text-gold transition-colors">
                  ← Back to Ideas
                </Link>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {related.length > 0 && (
                  <div>
                    <p className="section-label mb-5">Related</p>
                    <div className="space-y-5">
                      {related.map((rel) => (
                        <Link key={rel.slug} href={`/ideas/${rel.slug}`} className="block group">
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
