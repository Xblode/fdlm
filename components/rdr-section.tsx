"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  preventionPosters,
  rdrContent,
} from "@/config/prevention";
import { ChevronIcon } from "@/components/chevron-icon";

const POSTER_TILTS = [-4, 3, -2, 5, -3, 4, -5, 2];

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
          <div
            aria-hidden
            className="size-[22px] shrink-0 bg-brand-yellow [mask-image:url('/1x/Fichier%206.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"
          />
          <h2 className="translate-y-[2px] font-display text-4xl leading-[0.95] uppercase">
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
              className="mt-1 min-h-12 font-display text-2xl leading-none uppercase transition-opacity duration-300"
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
              <ChevronIcon direction="left" className="size-4 text-brand-yellow" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Affiche suivante"
              className="inline-flex size-11 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-yellow text-brand-black transition-transform active:scale-95"
            >
              <ChevronIcon direction="right" className="size-4 text-brand-black" />
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

                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-brand-yellow bg-white">
                    <Image
                      src={poster.image}
                      alt={poster.title}
                      fill
                      quality={75}
                      sizes="(max-width: 767px) 72vw, 264px"
                      className="object-contain"
                      priority={index === 0}
                    />
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
          {rdrContent.orderLabel}
        </a>
      </div>
    </section>
  );
}
