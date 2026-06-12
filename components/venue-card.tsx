"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Venue } from "@/config/event";
import { ChevronIcon } from "@/components/chevron-icon";
import { GradientMapImage } from "@/components/gradient-map-image";

const SCROLL_THRESHOLD_PX = 8;

function VenueImageSeparator({ imageSrc }: { imageSrc?: string }) {
  const src = imageSrc ?? "/fond-0.webp";

  return (
    <div
      className="relative w-full flex-1 overflow-hidden border-y-2 border-brand-black transition-all duration-300 ease-out"
      aria-hidden="true"
    >
      <GradientMapImage src={src} alt="" />
    </div>
  );
}

type VenueCardProps = {
  venue: Venue;
};

export function VenueCard({ venue }: VenueCardProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <Link
      href={`/lieux/${venue.id}`}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) touchStartRef.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStartRef.current;
        if (!start) return;
        const t = e.changedTouches[0];
        if (t) {
          const dx = Math.abs(t.clientX - start.x);
          const dy = Math.abs(t.clientY - start.y);
          if (dx > SCROLL_THRESHOLD_PX || dy > SCROLL_THRESHOLD_PX) {
            e.preventDefault();
          }
        }
        touchStartRef.current = null;
      }}
      className="group flex h-[280px] w-full flex-col overflow-hidden rounded-3xl border-2 border-brand-black bg-white text-left shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
    >
      <div className="flex shrink-0 items-start justify-between gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="grid grid-rows-[1fr_auto_1fr] transition-all duration-300">
            <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-[50px] group-hover:opacity-100">
              <p className="font-display w-fit rounded-full bg-brand-black px-3 py-1 text-xs tracking-[0.2em] text-brand-yellow uppercase">
                {venue.venueType}
              </p>
            </div>
            <h3 className="mt-0 font-display text-3xl leading-none text-brand-black uppercase transition-all duration-300 group-hover:mt-3">
              {venue.name}
            </h3>
            <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-[50px] group-hover:opacity-100">
              <p className="mt-2 text-sm text-brand-black/70">{venue.address}</p>
            </div>
          </div>
        </div>

        <div className="relative flex w-fit shrink-0 flex-col gap-2 overflow-hidden rounded-2xl border-0 border-brand-black bg-[url('/fond-0.webp')] bg-cover bg-center p-0 text-brand-yellow opacity-0 shadow-none transition-all duration-300 max-h-0 group-hover:max-h-[120px] group-hover:border-2 group-hover:p-2 group-hover:opacity-100 group-hover:shadow-[2px_2px_0_0_#0a0a0a]">
          <p className="font-display text-center text-2xl leading-none tabular-nums uppercase">
            {venue.hoursStart}
          </p>
          <div className="h-px w-full bg-brand-yellow/40" />
          <p className="font-display text-center text-2xl leading-none tabular-nums uppercase">
            {venue.hoursEnd}
          </p>
        </div>
      </div>

      <VenueImageSeparator imageSrc={venue.cardImage} />

      <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-4 pb-5">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 min-w-0 pb-1 pr-1">
          {venue.musicStyles.map((style, index) => (
            <span
              key={style}
              className={`shrink-0 rounded-full border-2 border-brand-black px-3 py-1 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
                index % 2 === 0
                  ? "bg-white text-brand-black"
                  : "bg-brand-black text-brand-yellow"
              }`}
            >
              {style}
            </span>
          ))}
        </div>
        <ChevronIcon className="size-5 shrink-0 text-brand-black transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
      </div>
    </Link>
  );
}
