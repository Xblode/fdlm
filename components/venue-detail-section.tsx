import Image from "next/image";
import Link from "next/link";
import type { Venue } from "@/lib/data/types";
import { ChevronIcon } from "@/components/chevron-icon";
import { VenueCardMedia } from "@/components/venue-card-media";

type VenueDetailSectionProps = {
  venue: Venue;
  artistCount: number;
};

function VenueDetail({ venue, artistCount }: VenueDetailSectionProps) {
  const hours = `${venue.hoursStart.toLowerCase()} – ${venue.hoursEnd.toLowerCase()}`;
  const concertLabel = artistCount <= 1 ? "concert" : "concerts";

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl shadow-[6px_6px_0_0_#0a0a0a]">
        <VenueCardMedia imageSrc={venue.cardImage} rounded="all" />
        <div className="relative z-10 flex min-h-[220px] flex-col justify-end gap-3 p-6">
          <p className="font-display w-fit rounded-full bg-brand-black px-3 py-1 text-xs tracking-[0.2em] text-brand-yellow uppercase">
            {venue.venueType}
          </p>
          <h1 className="font-display text-5xl leading-[0.9] text-brand-yellow uppercase">
            {venue.name}
          </h1>
          <p className="text-sm leading-relaxed text-brand-yellow/90">
            {venue.address}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-brand-black bg-brand-black p-4 text-brand-yellow shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]">
          <p className="font-display text-xs tracking-[0.2em] uppercase opacity-70">
            Concerts
          </p>
          <p className="mt-2 font-display text-2xl leading-none uppercase tabular-nums">
            {artistCount}
          </p>
          <p className="mt-1 text-xs uppercase opacity-70">{concertLabel}</p>
        </div>

        <div className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]">
          <p className="font-display text-xs tracking-[0.2em] uppercase opacity-60">
            Horaires
          </p>
          <p className="mt-2 font-display text-2xl leading-none uppercase">
            {hours}
          </p>
          <p className="mt-1 text-xs uppercase opacity-60">Accès libre</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {venue.musicStyles.map((style, index) => (
          <span
            key={style}
            className={`rounded-full border-2 border-brand-black px-3 py-1 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
              index % 2 === 0
                ? "bg-white text-brand-black"
                : "bg-brand-black text-brand-yellow"
            }`}
          >
            {style}
          </span>
        ))}
      </div>

      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 flex h-14 w-full items-center justify-between rounded-2xl border-2 border-brand-black bg-white px-5 font-display text-lg tracking-wide text-brand-black uppercase shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
      >
        <span>Y aller sur Maps</span>
        <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </a>
    </>
  );
}

export function VenueDetailSection({ venue, artistCount }: VenueDetailSectionProps) {
  return (
    <section
      id="location-section"
      className="scroll-mt-[var(--mobile-header-height)] bg-brand-yellow px-4 pt-6 pb-10 text-brand-black"
    >
      <div className="location-sticky-toolbar sticky top-[var(--mobile-header-height)] z-[15] -mx-4 bg-brand-yellow px-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/1x/Fichier 4.webp"
              alt=""
              width={49}
              height={49}
              className="h-5 w-auto shrink-0 object-contain"
              aria-hidden
            />
            <h2 className="font-display text-3xl leading-none uppercase">Lieux</h2>
          </div>
          <Link
            href="/"
            className="group inline-flex shrink-0 items-center gap-2 bg-transparent font-display text-lg tracking-wide text-brand-black uppercase"
          >
            Fermer
            <ChevronIcon direction="down" className="size-4" />
          </Link>
        </div>
      </div>

      <div id="venue-detail" className="pt-2">
        <VenueDetail venue={venue} artistCount={artistCount} />
      </div>
    </section>
  );
}
