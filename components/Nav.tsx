"use client";
import Link from "next/link";
import { useState } from "react";
import { siteConfig, nav } from "@/content/site-data";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b" style={{borderColor: "var(--border)"}}>
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-xl tracking-tight group-hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, color: "var(--ink)" }}>
              {siteConfig.name}
            </span>
            <span className="text-[9px] font-sans font-500 tracking-widest uppercase mt-0.5"
              style={{ color: "var(--ink-muted)" }}>
              {siteConfig.tagline}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-[12px] font-sans font-400 transition-colors"
                style={{ color: "var(--ink-secondary)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile */}
          <div className="flex items-center gap-4">
            <Link href={nav.cta.href} className="hidden lg:inline-block btn-primary">
              {nav.cta.label}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-1 transition-colors"
              style={{ color: "var(--ink-muted)" }}
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
        <div className="lg:hidden bg-white border-t" style={{borderColor: "var(--border)"}}>
          <nav className="max-w-8xl mx-auto px-6 py-6 flex flex-col gap-4">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-sans font-400 py-1 transition-colors"
                style={{ color: "var(--ink-secondary)" }}
              >
                {link.label}
              </Link>
            ))}
            <Link href={nav.cta.href} onClick={() => setOpen(false)} className="mt-2 btn-primary text-center">
              {nav.cta.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
