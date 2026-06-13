"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Venue } from "@/lib/data/types";
import { ChevronIcon } from "@/components/chevron-icon";
import { VenuePlaceholderGradient } from "@/components/venue-placeholder-gradient";
import { VenueCardImage } from "@/components/venue-card-image";
import { DEFAULT_VENUE_IMAGE_FOCUS } from "@/lib/utils/venue-image-position";

const SCROLL_THRESHOLD_PX = 8;

function VenueImageSeparator({
  venueId,
  imageSrc,
  focusX = DEFAULT_VENUE_IMAGE_FOCUS.x,
  focusY = DEFAULT_VENUE_IMAGE_FOCUS.y,
}: {
  venueId: string;
  imageSrc?: string;
  focusX?: number;
  focusY?: number;
}) {
  return (
    <div
      className="relative size-full overflow-hidden border-b-2 border-brand-black"
      aria-hidden="true"
    >
      {imageSrc ? (
        <VenueCardImage
          src={imageSrc}
          focusX={focusX}
          focusY={focusY}
        />
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
    <div className="absolute top-5 right-5 z-10 shrink-0 rounded-xl border-2 border-brand-black bg-brand-yellow px-2 py-1 font-display text-lg leading-none tabular-nums text-brand-black uppercase shadow-[2px_2px_0_0_#0a0a0a]">
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
      <div className="relative min-h-0 flex-1">
        <VenueImageSeparator
          venueId={venue.id}
          imageSrc={venue.cardImage}
          focusX={venue.cardImageFocusX}
          focusY={venue.cardImageFocusY}
        />

        <VenueHoursBadge
          hoursStart={venue.hoursStart}
          hoursEnd={venue.hoursEnd}
        />

        <h3 className="absolute inset-x-0 bottom-0 z-10 p-5 font-display text-3xl leading-none text-brand-yellow uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          {venue.name}
        </h3>
      </div>

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
