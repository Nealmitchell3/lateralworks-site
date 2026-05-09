import Link from "next/link";
import PaperCard from "./PaperCard";
import type { Paper } from "@/content/paper-types";
import { getPdfText } from "@/content/papers-utils";

interface Props {
  papers: Paper[];
  seriesList: string[];
}

export default function StaticPapersListing({ papers, seriesList }: Props) {
  const total = papers.length;

  return (
    <>
      {/* Series filter — unfiltered baseline */}
      {seriesList.length > 0 && (
        <section className="bg-cream-dark border-b border-border py-4 sticky top-16 z-40">
          <div className="max-w-8xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">Series</span>
              <Link href="/papers" className="tag transition-colors border-navy text-navy bg-navy/5">
                All
              </Link>
              {seriesList.map((s) => (
                <Link key={s} href={`/papers?series=${encodeURIComponent(s)}`}
                  className="tag transition-colors hover:border-navy hover:text-navy">
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List — full unfiltered */}
      <section className="bg-cream py-12 lg:py-20">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="divide-y divide-border">
            {papers.map((paper) => (
              <PaperCard key={paper.slug} paper={paper} pdfText={getPdfText(paper.slug)} />
            ))}
          </div>
          <div className="hairline pt-8 mt-8">
            <p className="text-sm font-light text-ink-muted">
              {papers.length} paper{papers.length !== 1 ? "s" : ""}.
              {total >= 5 && " More papers added regularly."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
