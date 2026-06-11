"use client";

import Image from "next/image";
import { useState } from "react";
import {
  preventionPosters,
  rdrContent,
} from "@/config/prevention";

const FAN_ROTATE_DEG = 7;
const FAN_OFFSET_X = 34;
const FAN_DROP_Y = 9;

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
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(posters.length / 2),
  );

  if (posters.length === 0) return null;

  function showNext() {
    setActiveIndex((current) => (current + 1) % posters.length);
  }

  return (
    <section
      id="rdr"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 rounded-t-3xl bg-brand-yellow px-4 pt-8 pb-20 text-brand-black"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-black bg-brand-black text-brand-yellow">
          <ShieldIcon className="size-4" />
        </span>
        <p className="font-display text-sm tracking-[0.2em] uppercase text-brand-black/70">
          {rdrContent.eyebrow}
        </p>
      </div>

      <h2 className="mt-3 font-display text-4xl leading-[0.95] uppercase">
        {rdrContent.title}
      </h2>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-brand-black/80">
        {rdrContent.description}
      </p>

      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={showNext}
          aria-label="Afficher l'affiche suivante"
          className="relative h-[280px] w-full max-w-[20rem] [perspective:1000px]"
        >
          {posters.map((poster, index) => {
            const diff = index - activeIndex;
            const distance = Math.abs(diff);
            const isActive = diff === 0;

            const style: React.CSSProperties = {
              transform: `translateX(-50%) translateX(${
                diff * FAN_OFFSET_X
              }px) translateY(${distance * FAN_DROP_Y}px) rotate(${
                diff * FAN_ROTATE_DEG
              }deg) scale(${isActive ? 1 : 0.94})`,
              transformOrigin: "bottom center",
              zIndex: posters.length - distance,
              opacity: distance > 3 ? 0 : 1,
            };

            return (
              <span
                key={poster.id}
                style={style}
                className={`absolute bottom-0 left-1/2 block aspect-[2/3] w-[10.5rem] overflow-hidden rounded-2xl border-2 border-brand-black bg-white shadow-[4px_4px_0_0_#0a0a0a] transition-all duration-300 ease-out ${
                  isActive ? "" : "brightness-95"
                }`}
              >
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  sizes="170px"
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/85 to-transparent px-3 pt-8 pb-3">
                  <span className="font-display block text-base leading-none text-brand-yellow uppercase">
                    {poster.title}
                  </span>
                </span>
              </span>
            );
          })}
        </button>

        <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
          {posters.map((poster, index) => (
            <span
              key={poster.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-5 bg-brand-black"
                  : "w-1.5 bg-brand-black/30"
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-xs tracking-wide text-brand-black/55 uppercase">
          {rdrContent.hint}
        </p>
      </div>

      <a
        href={rdrContent.orderHref}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-brand-black bg-brand-black px-5 text-center font-display text-lg tracking-wide text-brand-yellow uppercase shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
      >
        <ShieldIcon className="size-5" />
        {rdrContent.orderLabel}
      </a>
    </section>
  );
}
