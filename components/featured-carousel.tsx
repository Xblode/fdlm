"use client";

import Image from "next/image";
import type { Artist } from "@/config/event";
import { venues } from "@/config/event";
import { useProgram } from "@/components/program-provider";

type FeaturedCarouselProps = {
  artists: Artist[];
};

function getVenueName(venueId: string) {
  return venues.find((venue) => venue.id === venueId)?.name ?? venueId;
}

function FeaturedArtistCard({ artist }: { artist: Artist }) {
  const venueName = getVenueName(artist.venueId);
  const { addToProgram, removeFromProgramByArtist, isInProgram } = useProgram();
  const alreadyAdded = isInProgram(artist.name, venueName);

  function handleToggleProgram() {
    if (alreadyAdded) {
      removeFromProgramByArtist(artist.name, venueName);
      return;
    }

    addToProgram({
      artistName: artist.name,
      slot: artist.slot,
      genre: artist.genre,
      venueName,
    });
  }

  return (
    <article className="relative aspect-square w-[42vw] max-w-[11rem] shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-brand-black bg-[url('/fond-0.png')] bg-cover bg-center text-left shadow-[4px_4px_0_0_#0a0a0a]">
      <div className="flex h-full flex-col p-4">
        <span className="font-display w-fit rounded-full bg-brand-black px-2.5 py-1 text-[0.65rem] tracking-[0.15em] text-brand-yellow uppercase">
          {artist.genre}
        </span>

        <div className="mt-auto">
          <p className="font-display text-2xl leading-none text-brand-yellow uppercase">
            {artist.name}
          </p>
          <p className="mt-1.5 text-xs text-brand-yellow/90 uppercase">
            {artist.slot} · {venueName}
          </p>

          <button
            type="button"
            onClick={handleToggleProgram}
            aria-label={
              alreadyAdded
                ? `Retirer ${artist.name} du programme`
                : `Ajouter ${artist.name} au programme`
            }
            className={`mt-3 w-full rounded-full border-2 border-brand-black px-3 py-2 text-center font-display text-xs leading-none tracking-wide uppercase transition-transform active:scale-[0.98] ${
              alreadyAdded
                ? "bg-brand-black/20 text-brand-yellow/70 shadow-none"
                : "bg-brand-yellow text-brand-black shadow-[2px_2px_0_0_#0a0a0a]"
            }`}
          >
            {alreadyAdded ? "Ajouté" : "Ajouter"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function FeaturedCarousel({ artists }: FeaturedCarouselProps) {
  if (artists.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="mb-2 flex items-center gap-3">
        <Image
          src="/1x/Fichier 2.png"
          alt=""
          width={44}
          height={49}
          className="h-5 w-auto shrink-0 object-contain"
          aria-hidden
        />
        <h2 className="font-display text-3xl leading-none uppercase">
          Artistes
        </h2>
      </div>

      <div className="hide-scrollbar -mx-4 overflow-x-auto py-3">
        <div className="flex w-max snap-x snap-mandatory gap-4 px-4">
          {artists.map((artist) => (
            <FeaturedArtistCard key={artist.name} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
}
