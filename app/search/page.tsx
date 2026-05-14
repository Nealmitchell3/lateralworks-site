import { Suspense } from "react";
import type { Metadata } from "next";
import { siteOpenGraphDefaults, siteTwitterDefaults } from "@/content/site-data";
import SearchPage from "./SearchPage";

const description =
  "Search across all lateralworks ideas, papers, case studies, and pages.";

export const metadata: Metadata = {
  title: "Search",
  description,
  alternates: { canonical: "/search" },
  openGraph: {
    ...siteOpenGraphDefaults,
    title: "Search | lateralworks",
    description,
    url: "/search",
  },
  twitter: {
    ...siteTwitterDefaults,
    title: "Search | lateralworks",
    description,
  },
};

export default function Page() {
  return (
    <div data-pagefind-ignore="all">
      <section className="bg-navy pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold mb-6">
              Search
            </p>
            <h1
              className="font-semibold text-white text-4xl lg:text-5xl xl:text-6xl mb-4"
              style={{ letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              Search lateralworks
            </h1>
            <p className="text-base font-light text-white/60 leading-relaxed max-w-2xl">
              Find ideas, papers, case studies, and pages across the site.
            </p>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="bg-cream py-12 lg:py-20">
            <div className="max-w-8xl mx-auto px-6 lg:px-10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 border-b border-cream-dark py-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted shrink-0">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="text-xl text-ink-muted">Loading…</span>
                </div>
              </div>
            </div>
          </section>
        }
      >
        <SearchPage />
      </Suspense>
    </div>
  );
}
