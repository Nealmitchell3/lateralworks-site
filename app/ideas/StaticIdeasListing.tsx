import Link from "next/link";
import PostCard from "./PostCard";
import type { PostMeta } from "@/content/post-types";

interface Props {
  posts: PostMeta[];
  categories: string[];
}

export default function StaticIdeasListing({ posts, categories }: Props) {
  return (
    <>
      {/* Category filter — unfiltered baseline */}
      {categories.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">Browse by</span>
              <Link href="/ideas" className="tag transition-colors border-navy text-navy bg-navy/5">
                All
              </Link>
              {categories.map((cat) => (
                <Link key={cat} href={`/ideas?category=${encodeURIComponent(cat)}`}
                  className="tag transition-colors hover:border-navy hover:text-navy">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles — full unfiltered list */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="hairline pt-8 mt-8">
            <p className="text-sm font-light text-ink-muted">
              {posts.length} article{posts.length !== 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
