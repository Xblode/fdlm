import Image from "next/image";
import type { Artist, Venue } from "@/lib/data/types";
import { ArtistCard } from "@/components/artist-card";

type ArtistsSectionProps = {
  venue: Venue;
  artists: Artist[];
};

export function ArtistsSection({ venue, artists }: ArtistsSectionProps) {
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
        {artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              venueName={venue.name}
            />
          ))
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center font-display text-xl uppercase">
            Aucun résultat
          </p>
        )}
      </div>
    </section>
  );
}
