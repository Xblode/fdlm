"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Venue } from "@/lib/data/types";
import { ChevronIcon } from "@/components/chevron-icon";
import { VenuePlaceholderGradient } from "@/components/venue-placeholder-gradient";
import { GradientMapImage } from "@/components/gradient-map-image";

const SCROLL_THRESHOLD_PX = 8;

function VenueImageSeparator({
  venueId,
  imageSrc,
}: {
  venueId: string;
  imageSrc?: string;
}) {
  return (
    <div
      className="relative w-full flex-1 overflow-hidden border-y-2 border-brand-black"
      aria-hidden="true"
    >
      {imageSrc ? (
        <GradientMapImage src={imageSrc} alt="" />
      ) : (
        <VenuePlaceholderGradient venueId={venueId} className="absolute inset-0" />
      )}
    </div>
  );
}

function VenueHoursBadge({
  hoursStart,
  hoursEnd,
}: {
  hoursStart: string;
  hoursEnd: string;
}) {
  return (
    <div className="shrink-0 rounded-xl border-2 border-brand-black bg-brand-yellow px-2 py-1 font-display text-lg leading-none tabular-nums text-brand-black uppercase shadow-[2px_2px_0_0_#0a0a0a]">
      {hoursStart} | {hoursEnd}
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
      className="flex h-[280px] w-full flex-col overflow-hidden rounded-3xl border-2 border-brand-black bg-white text-left shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 p-5">
        <h3 className="min-w-0 flex-1 font-display text-3xl leading-none text-brand-black uppercase">
          {venue.name}
        </h3>

        <VenueHoursBadge
          hoursStart={venue.hoursStart}
          hoursEnd={venue.hoursEnd}
        />
      </div>

      <VenueImageSeparator venueId={venue.id} imageSrc={venue.cardImage} />

      <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-4 pb-5">
        <div className="hide-scrollbar flex min-w-0 gap-2 overflow-x-auto pb-1 pr-1">
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
        <ChevronIcon className="size-5 shrink-0 text-brand-black" />
      </div>
    </Link>
  );
}
