import Link from "next/link";
import { siteConfig, footer } from "@/content/site-data";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Top section */}
      <div className="max-w-8xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-400 text-white tracking-tight">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-sans font-300 tracking-widest uppercase text-white/40 mt-0.5">
                {siteConfig.tagline}
              </span>
            </Link>
            <p className="text-sm font-sans font-300 text-white/50 leading-relaxed max-w-xs">
              {footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.label}>
              <h4 className="section-label text-white/40 mb-5">{col.label}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-sans font-300 text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[11px] font-sans font-300 text-white/30">
            {siteConfig.copyright} {siteConfig.address}.
          </p>
          <p className="text-[11px] font-sans font-300 text-white/30">
            {siteConfig.trademark}
          </p>
        </div>
      </div>
    </footer>
  );
}
