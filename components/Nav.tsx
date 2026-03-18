"use client";
import Link from "next/link";
import { useState } from "react";
import { siteConfig, nav } from "@/content/site-data";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-navy-faint">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo — lateralworks always lowercase, always sans-serif */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-[18px] font-semibold text-white tracking-tight group-hover:opacity-80 transition-opacity lowercase">
              {siteConfig.name}
            </span>
            <span className="text-[9px] font-normal tracking-[0.18em] uppercase text-white/40 mt-0.5">
              {siteConfig.tagline}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-[12px] font-normal text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href={nav.cta.href}
              className="hidden lg:inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-2.5 bg-gold text-white hover:bg-gold-light transition-colors"
            >
              {nav.cta.label}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-white/70 hover:text-white transition-colors p-1"
              aria-label="Toggle menu"
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-faint border-t border-white/10">
          <nav className="max-w-8xl mx-auto px-6 py-6 flex flex-col gap-4">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-normal text-white/70 hover:text-white transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 text-[11px] font-semibold tracking-[0.12em] uppercase px-5 py-3 bg-gold text-white text-center hover:bg-gold-light transition-colors"
            >
              {nav.cta.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
