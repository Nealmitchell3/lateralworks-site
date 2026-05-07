import { externalContent } from "@/content/site-data";

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className="ml-1.5 inline-block"
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}

const linkClass =
  "inline-flex items-center text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors";

export default function ListenWatchBlock() {
  const { podcast, youtube } = externalContent;
  return (
    <section className="bg-cream-dark border-b border-border py-12 lg:py-16">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <p className="section-label mb-8">Listen &amp; Watch</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h3 className="font-semibold tracking-tight text-navy text-2xl lg:text-3xl mb-3">Listen</h3>
            <p className="text-sm font-light text-ink-secondary leading-relaxed mb-6 max-w-xl">
              {podcast.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={podcast.platforms.apple} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Apple Podcasts<ArrowUpRight />
              </a>
              <a href={podcast.platforms.spotify} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Spotify<ArrowUpRight />
              </a>
              <a href={podcast.platforms.buzzsprout} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Buzzsprout<ArrowUpRight />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-navy text-2xl lg:text-3xl mb-3">Watch</h3>
            <p className="text-sm font-light text-ink-secondary leading-relaxed mb-6 max-w-xl">
              {youtube.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={youtube.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                YouTube<ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
