"use client";

import Image from "next/image";
import { useState } from "react";
import {
  preventionPosters,
  rdrContent,
} from "@/config/prevention";

const FAN_ROTATE_DEG = 12;
const FAN_OFFSET_X = 40;
const FAN_OFFSET_Y = 10;

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

export function RdrSection() {
  const posters = preventionPosters;
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (posters.length === 0) return null;

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const dx = touchStartX - touchEndX;

    if (dx > 40) {
      // swipe gauche -> carte suivante
      setActiveIndex((c) => (c + 1) % posters.length);
    } else if (dx < -40) {
      // swipe droite -> carte précédente
      setActiveIndex((c) => (c - 1 + posters.length) % posters.length);
    }
    setTouchStartX(null);
  }

  return (
    <section
      id="rdr"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 rounded-t-3xl bg-brand-black px-4 pt-8 pb-20 text-brand-yellow"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-yellow text-brand-black">
          <ShieldIcon className="size-4" />
        </span>
        <p className="font-display text-sm tracking-[0.2em] uppercase text-brand-yellow/70">
          {rdrContent.eyebrow}
        </p>
      </div>

      <h2 className="mt-3 font-display text-4xl leading-[0.95] uppercase">
        {rdrContent.title}
      </h2>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-brand-yellow/80">
        {rdrContent.description}
      </p>

      <div className="mt-8 flex flex-col items-center">
        <div
          className="relative h-[290px] w-full max-w-[20rem] touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {posters.map((poster, index) => {
            const n = posters.length;
            let diff = index - activeIndex;

            // Calcul circulaire pour que la boucle soit parfaite
            if (diff > Math.floor(n / 2)) diff -= n;
            if (diff < -Math.floor(n / 2)) diff += n;

            const distance = Math.abs(diff);
            const isActive = diff === 0;

            const translateY = isActive ? -25 : distance * FAN_OFFSET_Y;
            const translateX = diff * FAN_OFFSET_X;
            const rotate = diff * FAN_ROTATE_DEG;

            const style: React.CSSProperties = {
              transform: `translateX(-50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${isActive ? 1.05 : 0.95})`,
              transformOrigin: "bottom center",
              zIndex: 10 - distance,
              opacity: distance > 2 ? 0 : 1,
            };

            return (
              <button
                key={poster.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                style={style}
                aria-label={`Voir l'affiche ${poster.title}`}
                className={`absolute bottom-0 left-1/2 block aspect-[2/3] w-[11rem] overflow-hidden rounded-2xl border-2 border-brand-yellow bg-brand-black shadow-[4px_4px_0_0_#ffdf24] transition-all duration-500 ease-out will-change-transform ${
                  isActive ? "cursor-default" : "cursor-pointer brightness-90 hover:brightness-100 hover:-translate-y-2"
                }`}
              >
                <Image
                  src={poster.image}
                  alt=""
                  fill
                  sizes="176px"
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/90 to-transparent px-3 pt-10 pb-4 transition-opacity duration-300">
                  <span className="font-display block text-lg leading-none text-brand-yellow uppercase">
                    {poster.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2" aria-hidden="true">
          {posters.map((poster, index) => (
            <button
              key={poster.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "w-8 bg-brand-yellow"
                  : "w-2 bg-brand-yellow/30"
              }`}
            />
          ))}
        </div>

        <p className="mt-4 text-center text-[0.65rem] tracking-[0.1em] text-brand-yellow/50 uppercase">
          {rdrContent.hint}
        </p>
      </div>

      <a
        href={rdrContent.orderHref}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-brand-yellow bg-brand-yellow px-5 text-center font-display text-lg tracking-wide text-brand-black uppercase transition-transform active:scale-[0.98]"
      >
        <ShieldIcon className="size-5" />
        {rdrContent.orderLabel}
      </a>
    </section>
  );
}
