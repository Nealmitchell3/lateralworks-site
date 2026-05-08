"use client";

import { useEffect, useRef, useState } from "react";
import { representativeExperience } from "@/content/representative-experience";

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className="ml-1.5 inline-block"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function ExperienceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const { intro, subline, projects } = representativeExperience;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-[11px] font-semibold tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors"
      >
        More representative client projects<ArrowRight />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-navy/70"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-modal-title"
            className="relative bg-cream rounded-lg w-[95vw] max-w-7xl max-h-[90vh] flex flex-col mx-auto my-[5vh] shadow-xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — sticky at top of panel */}
            <div className="sticky top-0 bg-navy text-cream px-6 md:px-10 py-6 z-10 rounded-t-lg shadow-md">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold mb-2">
                {intro}
              </p>
              <h2
                id="experience-modal-title"
                className="text-2xl md:text-3xl font-semibold tracking-tight text-cream pr-12"
              >
                {subline}
              </h2>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gold hover:text-gold-light transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr>
                      {[
                        "Project",
                        "Client",
                        "Type",
                        "Problem",
                        "Solution",
                        "lateralworks Role",
                        "Outcomes",
                      ].map((h) => (
                        <th
                          key={h}
                          className="sticky top-0 bg-cream-dark text-[11px] font-semibold tracking-[0.12em] uppercase text-navy text-left align-bottom py-3 px-4 border-b border-navy/20"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, i) => (
                      <tr
                        key={p.project}
                        className={i % 2 === 1 ? "bg-cream-dark/30" : ""}
                      >
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-navy font-semibold">
                          {p.project}
                        </td>
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-ink">
                          {p.client}
                        </td>
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-ink">
                          {p.type}
                        </td>
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-ink">
                          {p.problem}
                        </td>
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-ink">
                          {p.solution}
                        </td>
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-ink">
                          {p.role}
                        </td>
                        <td className="align-top py-5 px-4 border-b border-navy/10 text-sm leading-relaxed text-ink">
                          {p.outcomes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="block md:hidden space-y-8 text-left">
                {projects.map((p) => (
                  <article
                    key={p.project}
                    className="border border-navy/10 rounded-md overflow-hidden"
                  >
                    <div className="bg-cream-dark px-4 py-3">
                      <p className="font-semibold text-navy text-base">{p.project}</p>
                      <p className="text-xs uppercase tracking-wide text-ink/60 mt-1">{p.client}</p>
                      <p className="text-xs uppercase tracking-wide text-ink/60">{p.type}</p>
                    </div>
                    <div className="px-4 py-5 space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">Problem</p>
                        <p className="text-sm leading-relaxed text-ink mt-1">{p.problem}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">Solution</p>
                        <p className="text-sm leading-relaxed text-ink mt-1">{p.solution}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">lateralworks Role</p>
                        <p className="text-sm leading-relaxed text-ink mt-1">{p.role}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">Outcomes</p>
                        <p className="text-sm leading-relaxed text-ink mt-1">{p.outcomes}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
