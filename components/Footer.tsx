import Link from "next/link";
import { siteConfig, footer } from "@/content/site-data";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--navy)", color: "white" }}>
      <div className="max-w-8xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col leading-none mb-5">
              <span className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400 }}>
                {siteConfig.name}
              </span>
              <span className="text-[9px] font-sans font-500 tracking-widest uppercase mt-0.5 opacity-40">
                {siteConfig.tagline}
              </span>
            </Link>
            <p className="text-sm font-sans font-300 leading-relaxed max-w-xs opacity-50">
              {footer.tagline}
            </p>
          </div>

          {/* Columns */}
          {footer.columns.map((col) => (
            <div key={col.label}>
              <h4 className="text-[9px] font-sans font-600 tracking-widest uppercase opacity-40 mb-5">
                {col.label}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-sans font-300 opacity-60 hover:opacity-100 transition-opacity"
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
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[11px] font-sans font-300 opacity-30">{siteConfig.copyright} {siteConfig.address}.</p>
          <p className="text-[11px] font-sans font-300 opacity-30">{siteConfig.trademark}</p>
        </div>
      </div>
    </footer>
  );
}
