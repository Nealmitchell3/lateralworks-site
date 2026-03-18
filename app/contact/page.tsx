import { contact } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: contact.hero.body };

export default function ContactPage() {
  return (
    <>
      <section className="bg-white pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">{contact.hero.label}</p>
          <h1 className="mb-6 max-w-2xl" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: "var(--ink)" }}>{contact.hero.headline}</h1>
          <p className="text-base font-sans font-300 leading-relaxed max-w-xl" style={{ color: "var(--ink-secondary)" }}>{contact.hero.body}</p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-8xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div>
              <div className="pb-6 mb-8 hairline">
                <p className="section-label mb-3">Get in touch</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-sans font-600 uppercase tracking-widest mb-1" style={{ color: "var(--ink-muted)" }}>Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm font-sans font-400 transition-colors" style={{ color: "var(--navy)" }}>{contact.email}</a>
                </div>
                <div>
                  <p className="text-[10px] font-sans font-600 uppercase tracking-widest mb-1" style={{ color: "var(--ink-muted)" }}>Location</p>
                  <p className="text-sm font-sans font-400" style={{ color: "var(--ink)" }}>{contact.location}</p>
                </div>
              </div>
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-[10px] font-sans font-600 uppercase tracking-widest mb-4" style={{ color: "var(--ink-muted)" }}>What to expect</p>
                <ul className="space-y-3">
                  {["A direct response from the lateralworks team","No sales pitch — a candid conversation","Typically respond within one business day"].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--navy)" }} />
                      <span className="text-[12px] font-sans font-300" style={{ color: "var(--ink-secondary)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="p-8 lg:p-10" style={{ backgroundColor: "var(--gray-50)", border: "1px solid var(--border)" }}>
                <p className="text-[13px] font-sans font-300 mb-8 leading-relaxed" style={{ color: "var(--ink-secondary)" }}>{contact.prompt}</p>
                <form action={`mailto:${contact.email}`} method="get" encType="text/plain" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-sans font-600 uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Name</label>
                      <input type="text" name="name" required placeholder="Your name"
                        className="w-full bg-white px-4 py-3 text-sm font-sans focus:outline-none transition-colors"
                        style={{ border: "1px solid var(--border)", color: "var(--ink)" }} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-600 uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Email</label>
                      <input type="email" name="email" required placeholder="your@email.com"
                        className="w-full bg-white px-4 py-3 text-sm font-sans focus:outline-none transition-colors"
                        style={{ border: "1px solid var(--border)", color: "var(--ink)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-600 uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>Company</label>
                    <input type="text" name="company" placeholder="Your company"
                      className="w-full bg-white px-4 py-3 text-sm font-sans focus:outline-none"
                      style={{ border: "1px solid var(--border)", color: "var(--ink)" }} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-600 uppercase tracking-widest mb-2" style={{ color: "var(--ink-muted)" }}>What are you working on?</label>
                    <textarea name="body" rows={6} required placeholder="Tell us about your program, challenge, or question."
                      className="w-full bg-white px-4 py-3 text-sm font-sans focus:outline-none resize-none"
                      style={{ border: "1px solid var(--border)", color: "var(--ink)" }} />
                  </div>
                  <button type="submit" className="btn-primary w-full sm:w-auto">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
