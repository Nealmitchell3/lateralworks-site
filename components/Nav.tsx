"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig, nav } from "@/content/site-data";
import SearchModal from "./SearchModal";

function isTextInputFocused(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === "/" && !searchOpen && !isTextInputFocused()) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <>
    <header data-pagefind-ignore="all" className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-navy-faint">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo — lateralworks always lowercase, always sans-serif */}
          <Link href="/" className="flex items-center gap-2 leading-none group">
            <span className="text-[18px] font-semibold text-white tracking-tight group-hover:opacity-80 transition-opacity lowercase">
              {siteConfig.name}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gold group-hover:opacity-80 transition-opacity mt-0.5"
              aria-hidden="true"
            >
              <path d="M7 4 L17 12 L7 20" />
            </svg>
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

          {/* Search + CTA */}
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search (⌘K)"
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
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
    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
