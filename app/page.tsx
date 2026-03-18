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
      {/* HERO */}
      <section className="bg-navy pt-32 pb-24 lg:pt-40 lg:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(var(--cream) 1px, transparent 1px), linear-gradient(90deg, var(--cream) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="max-w-8xl mx-auto px-6 lg:px-10 relative">
          <div className="max-w-4xl">
            <p className="section-label mb-6 animate-fadeup">{siteConfig.founded}</p>
            <h1 className="text-white font-semibold tracking-tight leading-[1.08] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 animate-fadeup animate-fadeup-delay-1" style={{ letterSpacing: "-0.025em" }}>
              {home.hero.headline}
            </h1>
            <p className="text-base lg:text-lg font-light text-white/60 max-w-2xl leading-relaxed mb-10 animate-fadeup animate-fadeup-delay-2">
              {home.hero.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeup animate-fadeup-delay-3">
              <Link href={home.hero.cta1.href} className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-7 py-4 bg-gold text-white hover:bg-gold-light transition-colors text-center">
                {home.hero.cta1.label}
              </Link>
              <Link href={home.hero.cta2.href} className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-7 py-4 border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-colors text-center">
                {home.hero.cta2.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy-light border-t border-white/10">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {home.stats.map((stat) => (
              <div key={stat.label} className="py-8 px-6 first:pl-0">
                <div className="font-light text-white mb-1" style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>{stat.number}</div>
                <div className="text-[13px] font-medium text-white mb-0.5">{stat.label}</div>
                <div className="text-[11px] font-light text-white/40">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="bg-cream-dark border-b border-border py-6">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">{home.clients.label}</span>
            {home.clients.logos.map((name) => (
              <span key={name} className="text-[11px] font-medium text-ink-secondary px-3 py-1 border border-border">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12 hairline pb-6">
            <div>
              <p className="section-label mb-3">{team.sectionLabel}</p>
              <h2 className="font-semibold text-navy text-3xl lg:text-4xl" style={{ letterSpacing: "-0.02em" }}>{team.headline}</h2>
            </div>
            <Link href={team.cta.href} className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors whitespace-nowrap">
              {team.cta.label}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {team.members.map((member) => (
              <div key={member.name} className="bg-cream p-6 card-hover">
                <div className="w-10 h-10 bg-navy/10 flex items-center justify-center mb-4">
                  <span className="text-base font-semibold text-navy">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-sm text-navy mb-1">{member.name}</h3>
                <p className="section-label mb-2">{member.role}</p>
                <p className="text-[12px] font-light text-ink-secondary leading-relaxed">{member.bio}</p>
              </div>
            ))}
            <div className="bg-navy p-6 flex flex-col justify-end">
              <Link href={team.cta.href} className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
                {team.cta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-cream-dark py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="mb-12 hairline pb-6">
            <p className="section-label mb-3">{home.pillars.sectionLabel}</p>
            <h2 className="font-semibold text-navy text-3xl lg:text-4xl max-w-2xl" style={{ letterSpacing: "-0.02em" }}>{home.pillars.headline}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {home.pillars.items.map((item) => (
              <div key={item.number} className="bg-cream-dark p-8 flex flex-col card-hover">
                <div className="text-5xl font-light text-navy/10 leading-none mb-6 select-none">{item.number}</div>
                <p className="section-label mb-2">{item.category}</p>
                <h3 className="font-semibold text-base text-navy mb-4 leading-snug">{item.title}</h3>
                <p className="text-[13px] font-light text-ink-secondary leading-relaxed flex-grow mb-6">{item.body}</p>
                <Link href={item.link.href} className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold hover:text-gold-light transition-colors mt-auto">
                  {item.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12 hairline-dark pb-6">
            <div>
              <p className="section-label mb-3">{home.results.sectionLabel}</p>
              <h2 className="font-semibold text-white text-3xl lg:text-4xl" style={{ letterSpacing: "-0.02em" }}>{home.results.headline}</h2>
            </div>
            <Link href={home.results.cta.href} className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors whitespace-nowrap">
              {home.results.cta.label}
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10">
            {home.results.items.map((item) => (
              <div key={item.client} className="bg-navy p-8 card-hover">
                <span className="tag border-white/10 text-white/30 mb-6 block">{item.industry}</span>
                <h3 className="font-semibold text-white text-xl leading-snug mb-4">{item.headline}</h3>
                <p className="text-[13px] font-light text-white/50 leading-relaxed mb-8">{item.body}</p>
                <Link href={item.link.href} className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
                  {item.link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEAS */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12 hairline pb-6">
            <div>
              <p className="section-label mb-3">{home.ideasPreview.sectionLabel}</p>
              <h2 className="font-semibold text-navy text-3xl lg:text-4xl" style={{ letterSpacing: "-0.02em" }}>{home.ideasPreview.headline}</h2>
            </div>
            <Link href={home.ideasPreview.cta.href} className="hidden sm:inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors whitespace-nowrap">
              {home.ideasPreview.cta.label}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {home.ideasPreview.featured.map((article) => (
              <Link key={article.title} href={article.href} className="bg-cream p-7 group card-hover block">
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag">{article.category}</span>
                  <span className="text-[11px] font-light text-ink-muted">{article.date}</span>
                </div>
                <h3 className="font-medium text-navy text-lg leading-snug group-hover:text-navy/70 transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMY CTA */}
      <section className="bg-cream-dark py-16 lg:py-20 border-y border-border">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block text-[10px] font-semibold tracking-[0.16em] uppercase bg-gold text-white px-3 py-1 mb-4">
                {home.academyCta.badge}
              </div>
              <h2 className="font-semibold text-navy text-2xl lg:text-3xl mb-4" style={{ letterSpacing: "-0.02em" }}>{home.academyCta.headline}</h2>
              <p className="text-[13px] font-light text-ink-secondary leading-relaxed mb-6">{home.academyCta.body}</p>
              <Link href={home.academyCta.cta.href} className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-7 py-4 bg-navy text-white hover:bg-navy-light transition-colors">
                {home.academyCta.cta.label}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {home.academyCta.modules.map((mod) => (
                <div key={mod.product} className="bg-cream-dark p-6">
                  <div className="font-semibold text-sm text-navy mb-1">{mod.product}</div>
                  <div className="section-label mb-1">{mod.count}</div>
                  <div className="text-[12px] font-light text-ink-secondary">{mod.topic}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-semibold text-white text-4xl lg:text-5xl xl:text-6xl max-w-3xl mx-auto mb-6" style={{ letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            {home.finalCta.headline}
          </h2>
          <p className="text-base font-light text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            {home.finalCta.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={home.finalCta.cta1.href} className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-8 py-4 bg-gold text-white hover:bg-gold-light transition-colors">
              {home.finalCta.cta1.label}
            </Link>
            <Link href={home.finalCta.cta2.href} className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase px-8 py-4 border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-colors">
              {home.finalCta.cta2.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
