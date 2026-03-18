import Link from "next/link";
import { home, team, siteConfig } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: home.hero.body,
};

export default function HomePage() {
  return (
    <>
      {/* ── HERO — white, full width, generous padding ──────── */}
      <section className="bg-white pt-36 pb-28 lg:pt-44 lg:pb-36">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="section-label mb-6 animate-fadeup">{siteConfig.founded}</p>
              <h1
                className="animate-fadeup animate-fadeup-delay-1 mb-8"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                }}
              >
                {home.hero.headline}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-3">
              <p className="text-base font-sans font-300 leading-relaxed mb-8 animate-fadeup animate-fadeup-delay-2"
                style={{ color: "var(--ink-secondary)" }}>
                {home.hero.body}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fadeup animate-fadeup-delay-3">
                <Link href={home.hero.cta1.href} className="btn-primary text-center">
                  {home.hero.cta1.label}
                </Link>
                <Link href={home.hero.cta2.href} className="btn-ghost text-center">
                  {home.hero.cta2.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS — light gray band ──────────────────────────── */}
      <section style={{ backgroundColor: "var(--gray-50)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {home.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="py-10 px-6 first:pl-0"
                style={{ borderRight: i < 3 ? "1px solid var(--border)" : "none" }}
              >
                <div className="stat-number mb-1" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--navy)" }}>
                  {stat.number}
                </div>
                <div className="text-[13px] font-sans font-500 mb-0.5" style={{ color: "var(--ink)" }}>
                  {stat.label}
                </div>
                <div className="text-[11px] font-sans font-300" style={{ color: "var(--ink-muted)" }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ──────────────────────────────────────────── */}
      <section className="bg-white py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-sans font-600 uppercase tracking-widest mr-3" style={{ color: "var(--ink-muted)" }}>
              {home.clients.label}
            </span>
            {home.clients.logos.map((name) => (
              <span key={name} className="text-[11px] font-sans font-400 px-3 py-1"
                style={{ color: "var(--ink-secondary)", border: "1px solid var(--border)" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between pb-8 mb-12 hairline">
            <div>
              <p className="section-label mb-3">{team.sectionLabel}</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>
                {team.headline}
              </h2>
            </div>
            <Link href={team.cta.href} className="link-arrow hidden sm:inline-flex">
              {team.cta.label} <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {team.members.map((member) => (
              <div key={member.name} className="bg-white p-7 card-hover">
                <div className="w-9 h-9 flex items-center justify-center mb-5"
                  style={{ backgroundColor: "var(--gray-100)", border: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.1rem", color: "var(--navy)" }}>
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-sans text-sm font-500 mb-1" style={{ color: "var(--ink)" }}>{member.name}</h3>
                <p className="section-label mb-3">{member.role}</p>
                <p className="text-[12px] font-sans font-300 leading-relaxed" style={{ color: "var(--ink-muted)" }}>
                  {member.bio}
                </p>
              </div>
            ))}
            <div className="p-7 flex flex-col justify-end" style={{ backgroundColor: "var(--navy)" }}>
              <Link href={team.cta.href} className="text-[11px] font-sans font-600 tracking-widest uppercase text-white opacity-80 hover:opacity-100 transition-opacity">
                {team.cta.label} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUR PILLARS ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--gray-50)", borderTop: "1px solid var(--border)" }} className="py-24 lg:py-32">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="pb-8 mb-12 hairline">
            <p className="section-label mb-3">{home.pillars.sectionLabel}</p>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>
              {home.pillars.headline}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {home.pillars.items.map((item) => (
              <div key={item.number} className="bg-white p-8 flex flex-col card-hover">
                <div className="mb-6 select-none"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "3.5rem", fontWeight: 300, lineHeight: 1, color: "var(--gray-200)" }}>
                  {item.number}
                </div>
                <p className="section-label mb-2">{item.category}</p>
                <h3 className="font-sans font-500 text-base mb-4 leading-snug" style={{ color: "var(--ink)" }}>
                  {item.title}
                </h3>
                <p className="text-[13px] font-sans font-300 leading-relaxed flex-grow mb-6" style={{ color: "var(--ink-muted)" }}>
                  {item.body}
                </p>
                <Link href={item.link.href} className="link-arrow mt-auto">
                  {item.link.label} <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-32" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between pb-8 mb-12 hairline">
            <div>
              <p className="section-label mb-3">{home.results.sectionLabel}</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>
                {home.results.headline}
              </h2>
            </div>
            <Link href={home.results.cta.href} className="link-arrow hidden sm:inline-flex">
              {home.results.cta.label} <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {home.results.items.map((item) => (
              <div key={item.client} className="bg-white p-8 card-hover flex flex-col">
                <span className="tag mb-6 self-start">{item.industry}</span>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.4rem", lineHeight: 1.25, color: "var(--ink)", marginBottom: "1rem" }}>
                  {item.headline}
                </h3>
                <p className="text-[13px] font-sans font-300 leading-relaxed flex-grow mb-8" style={{ color: "var(--ink-muted)" }}>
                  {item.body}
                </p>
                <Link href={item.link.href} className="link-arrow mt-auto">
                  {item.link.label} <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IDEAS PREVIEW ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--gray-50)", borderTop: "1px solid var(--border)" }} className="py-24 lg:py-32">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between pb-8 mb-12 hairline">
            <div>
              <p className="section-label mb-3">{home.ideasPreview.sectionLabel}</p>
              <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--ink)" }}>
                {home.ideasPreview.headline}
              </h2>
            </div>
            <Link href={home.ideasPreview.cta.href} className="link-arrow hidden sm:inline-flex">
              {home.ideasPreview.cta.label} <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {home.ideasPreview.featured.map((article) => (
              <Link key={article.title} href={article.href}
                className="bg-white p-8 group card-hover block">
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag">{article.category}</span>
                  <span className="text-[11px] font-sans font-300" style={{ color: "var(--ink-muted)" }}>{article.date}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "1.35rem", lineHeight: 1.3, color: "var(--ink)" }}
                  className="group-hover:opacity-60 transition-opacity">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMY CTA ──────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block text-[9px] font-sans font-600 tracking-widest uppercase px-2.5 py-1 mb-5"
                style={{ backgroundColor: "var(--navy)", color: "white" }}>
                {home.academyCta.badge}
              </div>
              <h2 className="mb-4" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.15 }}>
                {home.academyCta.headline}
              </h2>
              <p className="text-[13px] font-sans font-300 leading-relaxed mb-7" style={{ color: "var(--ink-secondary)" }}>
                {home.academyCta.body}
              </p>
              <Link href={home.academyCta.cta.href} className="btn-primary">
                {home.academyCta.cta.label}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: "var(--border)" }}>
              {home.academyCta.modules.map((mod) => (
                <div key={mod.product} className="bg-white p-6">
                  <div className="font-sans font-500 text-sm mb-1" style={{ color: "var(--ink)" }}>{mod.product}</div>
                  <div className="section-label mb-1">{mod.count}</div>
                  <div className="text-[12px] font-sans font-300" style={{ color: "var(--ink-muted)" }}>{mod.topic}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — navy ─────────────────────────────────── */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em", color: "white", lineHeight: 1.1, maxWidth: "36rem", margin: "0 auto 1.5rem" }}>
            {home.finalCta.headline}
          </h2>
          <p className="text-base font-sans font-300 mb-10 leading-relaxed mx-auto"
            style={{ color: "rgba(255,255,255,0.55)", maxWidth: "32rem" }}>
            {home.finalCta.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={home.finalCta.cta1.href}
              className="inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-8 py-4 bg-white text-center transition-opacity hover:opacity-80"
              style={{ color: "var(--navy)" }}>
              {home.finalCta.cta1.label}
            </Link>
            <Link href={home.finalCta.cta2.href}
              className="inline-block text-[11px] font-sans font-600 tracking-wider uppercase px-8 py-4 text-center transition-opacity hover:opacity-80"
              style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)" }}>
              {home.finalCta.cta2.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
