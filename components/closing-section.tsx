"use client";

import Image from "next/image";
import { eventInfo } from "@/config/event";

const highlights = [
  {
    id: "free",
    label: "Gratuit",
    detail: "Entrée libre",
  },
  {
    id: "date",
    label: eventInfo.dateShort,
    detail: "2026",
  },
  {
    id: "city",
    label: eventInfo.city,
    detail: "Multi-lieux",
  },
] as const;

function scrollToLocation() {
  document
    .getElementById("location-section")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ClosingSection() {
  return (
    <section
      id="closing"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 rounded-t-3xl bg-brand-yellow px-4 pt-7 pb-12 text-brand-black"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/1x/Fichier 4.webp"
          alt=""
          width={44}
          height={49}
          className="h-5 w-auto shrink-0 object-contain"
          aria-hidden
        />
        <p className="font-display text-sm tracking-[0.2em] uppercase text-brand-black/60">
          Infos pratiques
        </p>
      </div>

      <h2 className="mt-3 font-display text-3xl leading-none uppercase">
        Prêt pour le 21 juin ?
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-brand-black/75">
        {eventInfo.tagline}. Retrouve les horaires, les lieux et construis ton
        programme avant le grand soir.
      </p>

      <ul className="mt-5 grid grid-cols-3 gap-2">
        {highlights.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border-2 border-brand-black bg-white/70 px-2 py-3 text-center shadow-[3px_3px_0_0_#0a0a0a]"
          >
            <p className="font-display text-lg leading-none uppercase">
              {item.label}
            </p>
            <p className="mt-1 text-[0.65rem] tracking-wide text-brand-black/60 uppercase">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={scrollToLocation}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-full border-2 border-brand-black bg-brand-black px-4 font-display text-base tracking-wide text-brand-yellow uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
      >
        Explorer les lieux
      </button>
    </section>
  );
}
