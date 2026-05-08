import { Suspense } from "react";
import IdeasListing from "./IdeasListing";
import StaticIdeasListing from "./StaticIdeasListing";
import ListenWatchBlock from "@/components/ListenWatchBlock";
import { getAllPostMeta, getAllCategories } from "@/content/posts-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas",
  description: "Articles on fast-time-to-market, critical path, decision quality, and product acceleration.",
};

export default function IdeasPage() {
  const allPosts = getAllPostMeta();
  const categories = getAllCategories();
  const total = allPosts.length;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">Ideas</p>
          <h1 className="font-semibold text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            {total > 0 ? `${total} articles. 36 years of thinking.` : "Ideas. 36 years of thinking."}
          </h1>
          <p className="text-base font-light text-white/60 max-w-2xl leading-relaxed">
            Research findings, methodology insights, and practical guidance accumulated
            across three decades of fast-time-to-market work.
          </p>
        </div>
      </section>

      <ListenWatchBlock />

      <Suspense fallback={<StaticIdeasListing posts={allPosts} categories={categories} />}>
        <IdeasListing posts={allPosts} categories={categories} />
      </Suspense>
    </>
  );
}
