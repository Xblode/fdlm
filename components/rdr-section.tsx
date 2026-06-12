"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  preventionPosters,
  rdrContent,
} from "@/config/prevention";

const POSTER_TILTS = [-4, 3, -2, 5, -3];

function ShieldIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function TapeCorner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute size-7 bg-brand-yellow/35 backdrop-blur-[1px] ${className}`}
      aria-hidden="true"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 35% 100%, 0 100%)" }}
    />
  );
}

function scrollToPoster(container: HTMLDivElement, index: number) {
  const card = container.querySelector<HTMLElement>(
    `[data-poster-index="${index}"]`,
  );
  if (!card) return;

  const maxScroll = container.scrollWidth - container.clientWidth;
  const target = Math.min(
    Math.max(card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2, 0),
    maxScroll,
  );

  container.scrollTo({ left: target, behavior: "smooth" });
}

export function RdrSection() {
  const posters = preventionPosters;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || posters.length === 0) return;

    const cards = container.querySelectorAll("[data-poster-index]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = Number(visible.target.getAttribute("data-poster-index"));
        if (!Number.isNaN(index)) {
          setActiveIndex(index);
        }
      },
      { root: container, threshold: [0.45, 0.65, 0.85] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [posters.length]);

  if (posters.length === 0) return null;

  const activePoster = posters[activeIndex];

  function goTo(index: number) {
    const container = scrollRef.current;
    if (!container) return;
    scrollToPoster(container, index);
  }

  function goPrev() {
    goTo((activeIndex - 1 + posters.length) % posters.length);
  }

  function goNext() {
    goTo((activeIndex + 1) % posters.length);
  }

  return (
    <section
      id="rdr"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 overflow-hidden rounded-t-3xl bg-brand-black px-4 pt-8 pb-20 text-brand-yellow"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent 0, transparent 28px, #ffdf24 28px, #ffdf24 30px)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <Image
            src="/1x/Fichier 6.png"
            alt=""
            width={69}
            height={69}
            className="h-5 w-auto shrink-0 object-contain"
            aria-hidden
          />
          <h2 className="font-display text-4xl leading-[0.95] uppercase">
            {rdrContent.title}
          </h2>
        </div>

        <p className="mt-3 max-w-prose text-sm leading-relaxed text-brand-yellow/80">
          {rdrContent.description}
        </p>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[0.65rem] tracking-[0.25em] text-brand-yellow/45 uppercase">
              Affiche {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(posters.length).padStart(2, "0")}
            </p>
            <p
              key={activePoster.id}
              className="mt-1 font-display text-2xl leading-none uppercase transition-opacity duration-300"
            >
              {activePoster.title}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Affiche précédente"
              className="inline-flex size-11 items-center justify-center rounded-full border-2 border-brand-yellow/40 text-brand-yellow transition-transform active:scale-95"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Affiche suivante"
              className="inline-flex size-11 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-yellow text-brand-black transition-transform active:scale-95"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="hide-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[11vw] py-4"
        >
          {posters.map((poster, index) => {
            const isActive = index === activeIndex;
            const tilt = POSTER_TILTS[index % POSTER_TILTS.length];

            return (
              <article
                key={poster.id}
                data-poster-index={index}
                className="w-[72vw] max-w-[16.5rem] shrink-0 snap-center"
              >
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Voir ${poster.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block w-full transition-transform duration-500 ease-out active:scale-[0.98] ${
                    isActive ? "scale-100" : "scale-[0.92] opacity-80"
                  }`}
                  style={{ transform: `rotate(${tilt}deg)` }}
                >
                  <TapeCorner className="-top-2 -left-2 rotate-[-8deg]" />
                  <TapeCorner className="-top-2 -right-2 rotate-[98deg]" />

                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-brand-yellow bg-brand-black shadow-[6px_6px_0_0_#ffdf24]">
                    <Image
                      src={poster.image}
                      alt={poster.title}
                      fill
                      quality={60}
                      sizes="(max-width: 767px) 72vw, 264px"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-transparent px-4 pt-16 pb-4">
                      <span className="font-display text-3xl leading-none text-brand-yellow/20 uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>

        <a
          href={rdrContent.orderHref}
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-brand-yellow bg-brand-yellow px-5 text-center font-display text-lg tracking-wide text-brand-black uppercase transition-transform active:scale-[0.98]"
        >
          <ShieldIcon className="size-5" />
          {rdrContent.orderLabel}
        </a>
      </div>
    </section>
  );
}
