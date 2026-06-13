"use client";

import Image from "next/image";
import Link from "next/link";
import type { Artist } from "@/lib/data/types";
import { useSiteData } from "@/components/site-data-provider";
import { useProgram } from "@/components/program-provider";
import { formatArtistSlot } from "@/lib/utils/artist-slot";

type FeaturedCarouselProps = {
  artists: Artist[];
  showShuffleButton?: boolean;
  onShuffle?: () => void;
  viewAllHref?: string;
};

export const FEATURED_ARTIST_COUNT = 4;

export function FeaturedArtistCard({
  artist,
  venueName,
}: {
  artist: Artist;
  venueName: string;
}) {
  const { addToProgram, removeFromProgramByArtist, isInProgram } = useProgram();
  const alreadyAdded = isInProgram(artist.id);

  async function handleToggleProgram() {
    if (alreadyAdded) {
      await removeFromProgramByArtist(artist.id);
      return;
    }

    await addToProgram({
      artistId: artist.id,
      artistName: artist.name,
      slot: artist.slot,
      genre: artist.genre,
      venueName,
    });
  }

  return (
    <article className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-brand-black bg-[url('/fond-0.webp')] bg-cover bg-center text-left shadow-[4px_4px_0_0_#0a0a0a]">
      <div className="flex h-full flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="font-display w-fit rounded-full bg-brand-black px-2.5 py-1 text-xs tracking-[0.1em] text-brand-yellow uppercase">
            {artist.genre}
          </span>
          <span className="shrink-0 font-display text-2xl leading-none text-brand-yellow uppercase">
            {formatArtistSlot(artist)}
          </span>
        </div>

        <div className="mt-auto">
          <p className="font-display line-clamp-2 text-3xl leading-none break-words text-brand-yellow uppercase">
            {artist.name}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[0.65rem] leading-none text-brand-yellow/90 uppercase">
            {venueName}
          </p>

          <button
            type="button"
            onClick={() => void handleToggleProgram()}
            aria-label={
              alreadyAdded
                ? `Retirer ${artist.name} du programme`
                : `Ajouter ${artist.name} au programme`
            }
            className={`mt-2 w-full rounded-full border-2 border-brand-black px-3 py-2.5 text-center font-display text-xl leading-none tracking-wide uppercase transition-transform active:scale-[0.98] ${
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

export function FeaturedCarousel({
  artists,
  showShuffleButton = false,
  onShuffle,
  viewAllHref,
}: FeaturedCarouselProps) {
  const { venues } = useSiteData();
  const featuredArtists = artists.slice(0, FEATURED_ARTIST_COUNT);

  function getVenueName(artist: Artist) {
    return (
      venues.find((venue) => venue.id === artist.venueId)?.name ?? artist.venueId
    );
  }

  return (
    <div className="mb-10">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/1x/Fichier 2.webp"
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

        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="shrink-0 rounded-full border-2 border-brand-black bg-white px-3 py-1.5 font-display text-sm uppercase leading-none text-brand-black shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
          >
            Tout voir
          </Link>
        ) : null}
      </div>

      {featuredArtists.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 py-3">
          {featuredArtists.map((artist) => (
            <FeaturedArtistCard
              key={artist.id}
              artist={artist}
              venueName={getVenueName(artist)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center font-display text-xl uppercase">
          Aucun résultat
        </p>
      )}

      {showShuffleButton && onShuffle ? (
        <button
          type="button"
          onClick={onShuffle}
          className="mt-3 w-full rounded-full border-2 border-brand-black bg-white px-4 py-2.5 font-display text-xl uppercase leading-none text-brand-black shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
        >
          Découvrir d&apos;autres ?
        </button>
      ) : null}
    </div>
  );
}
