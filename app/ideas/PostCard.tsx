import Link from "next/link";
import type { PostMeta } from "@/content/post-types";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/ideas/${post.slug}`}
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
  );
}
