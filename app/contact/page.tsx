import { contact, siteConfig } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.hero.body,
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{contact.hero.label}</p>
          <h1 className="display-heading text-white text-5xl lg:text-6xl xl:text-7xl mb-6 max-w-3xl">
            {contact.hero.headline}
          </h1>
          <p className="text-base font-sans font-300 text-white/60 max-w-xl leading-relaxed">
            {contact.hero.body}
          </p>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Info column */}
            <div>
              <div className="hairline pb-6 mb-8">
                <p className="section-label mb-3">Get in touch</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-sans font-400 text-navy hover:text-gold transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-1">
                    Location
                  </p>
                  <p className="text-sm font-sans font-400 text-navy">{contact.location}</p>
                </div>
                <div>
                  <p className="text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-1">
                    Founded
                  </p>
                  <p className="text-sm font-sans font-400 text-navy">1988</p>
                </div>
              </div>

              {/* What to expect */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-4">
                  What to expect
                </p>
                <ul className="space-y-3">
                  {[
                    "A direct response from the lateralworks team",
                    "No sales pitch — a candid conversation about your program",
                    "Typically respond within one business day",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 shrink-0 bg-gold rounded-full" />
                      <span className="text-[12px] font-sans font-300 text-ink-secondary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-2">
              <div className="bg-cream-dark p-8 lg:p-10">
                <p className="text-[13px] font-sans font-300 text-ink-secondary mb-8 leading-relaxed">
                  {contact.prompt}
                </p>
                <form
                  action={`mailto:${contact.email}`}
                  method="get"
                  encType="text/plain"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-cream border border-border px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-navy transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-cream border border-border px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-navy transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-2">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      className="w-full bg-cream border border-border px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-navy transition-colors"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans font-600 uppercase tracking-widest text-ink-muted mb-2">
                      What are you working on?
                    </label>
                    <textarea
                      name="body"
                      rows={6}
                      required
                      className="w-full bg-cream border border-border px-4 py-3 text-sm font-sans text-ink focus:outline-none focus:border-navy transition-colors resize-none"
                      placeholder="Tell us about your program, challenge, or question."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto text-[12px] font-sans font-600 tracking-wider uppercase px-8 py-4 bg-navy text-white hover:bg-navy-light transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
