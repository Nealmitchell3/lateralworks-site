"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { team } from "@/content/site-data";

type TeamMember = (typeof team.members)[number];

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedMember) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMember(null);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [selectedMember]);

  return (
    <section className="bg-cream-dark py-20 lg:py-28">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="hairline pb-6 mb-12">
          <p className="section-label mb-3">{team.sectionLabel}</p>
          <h2 className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl">{team.headline}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {team.members.map((member) => (
            <button
              key={member.name}
              type="button"
              onClick={() => setSelectedMember(member)}
              className="flex flex-col bg-cream-dark p-8 text-left w-full border-0 cursor-pointer transition-all duration-200 hover:bg-cream hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream-dark"
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="mb-5 object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-navy flex items-center justify-center mb-5">
                  <span className="font-display text-3xl font-medium text-white">{member.name.charAt(0)}</span>
                </div>
              )}
              <h3 className="font-semibold text-base text-navy mb-1">{member.name}</h3>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gold mb-3">{member.role}</p>
              <p className="text-[13px] font-light text-ink-secondary leading-relaxed">{member.bio}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-name"
            className="bg-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 lg:p-12 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close"
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-navy hover:bg-cream-dark transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {selectedMember.photo ? (
              <Image
                src={selectedMember.photo}
                alt={selectedMember.name}
                width={128}
                height={128}
                className="mb-6 object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-navy flex items-center justify-center mb-6">
                <span className="font-display text-5xl font-medium text-white">{selectedMember.name.charAt(0)}</span>
              </div>
            )}
            <h2
              id="team-modal-name"
              className="font-semibold tracking-tight text-navy text-3xl lg:text-4xl mb-2"
            >
              {selectedMember.name}
            </h2>
            <p className="section-label mb-8">{selectedMember.role}</p>
            {selectedMember.detailBio.map((paragraph, i) => (
              <p
                key={i}
                className="text-base font-sans font-light text-ink-secondary leading-relaxed mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
