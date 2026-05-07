"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xqendqba", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div>
        <h3 className="font-semibold tracking-tight text-navy text-2xl mb-3">
          Thanks — we&apos;ll be in touch shortly.
        </h3>
        <p className="text-sm font-light text-ink-secondary leading-relaxed">
          We typically respond within one business day.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-cream border border-border px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-navy mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Your name</label>
          <input
            id="cf-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>Email</label>
          <input
            id="cf-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-company" className={labelClass}>Company (optional)</label>
        <input
          id="cf-company"
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="cf-message" className={labelClass}>Message</label>
        <textarea
          id="cf-message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>
      {status === "error" && (
        <p className="text-sm font-light text-ink-secondary leading-relaxed">
          Something went wrong. Email{" "}
          <a
            href="mailto:neal.mitchell@lateralworks.com"
            className="text-navy hover:text-gold underline transition-colors"
          >
            neal.mitchell@lateralworks.com
          </a>{" "}
          directly while we look into this.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto text-[12px] font-semibold tracking-wider uppercase px-8 py-4 bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
