import Image from "next/image";
import type { Venue } from "@/config/event";
import { getArtistsForVenue } from "@/config/event";
import { ArtistCard } from "@/components/artist-card";

type ArtistsSectionProps = {
  venue: Venue;
};

export function ArtistsSection({ venue }: ArtistsSectionProps) {
  const venueArtists = getArtistsForVenue(venue.id);

  return (
    <section
      id="agenda"
      className="scroll-mt-[var(--mobile-header-height)] bg-[#f5f2eb] px-4 pt-6 pb-10 text-brand-black"
    >
      <div className="agenda-sticky-toolbar sticky top-[var(--mobile-header-height)] z-[15] -mx-4 bg-[#f5f2eb] px-4 py-2">
        <div className="flex items-center gap-3">
          <Image
            src="/1x/Fichier 2.webp"
            alt=""
            width={44}
            height={49}
            className="h-5 w-auto shrink-0 object-contain"
            aria-hidden
          />
          <h2 className="font-display text-3xl leading-none uppercase">Agenda</h2>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-2">
        {venueArtists.map((artist) => (
          <ArtistCard
            key={artist.name}
            artist={artist}
            venueName={venue.name}
          />
        ))}
      </div>
    </section>
  );
}
