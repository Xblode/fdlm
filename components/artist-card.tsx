"use client";

import type { Artist } from "@/lib/data/types";
import { useSiteData } from "@/components/site-data-provider";
import { useProgram } from "@/components/program-provider";
import { formatArtistSlot } from "@/lib/utils/artist-slot";

type ArtistCardProps = {
  artist: Artist;
  venueName?: string;
};

export function ArtistCard({ artist, venueName }: ArtistCardProps) {
  const { eventInfo } = useSiteData();
  const location = venueName ?? eventInfo.venue;
  const { addToProgram, removeFromProgramByArtist, isInProgram } = useProgram();
  const alreadyAdded = isInProgram(artist.id);

  const slotLabel = formatArtistSlot(artist);

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
      venueName: location,
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl border-2 border-brand-black bg-white shadow-[4px_4px_0_0_#0a0a0a]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[url('/fond-0.webp')] bg-cover bg-center">
        <div className="absolute top-4 left-4 flex w-fit flex-col gap-2 rounded-2xl bg-white px-2 py-2 text-brand-black shadow-md">
          <p className="font-display text-center text-2xl leading-none tabular-nums">
            {eventInfo.dateNumeric}
          </p>
          <div className="h-px w-full bg-brand-black/20" />
          <p className="font-display text-center text-2xl leading-none uppercase">
            {slotLabel}
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="font-display text-center text-4xl leading-none text-brand-yellow uppercase drop-shadow-sm">
            {artist.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t-2 border-brand-black p-4 text-brand-black">
        <div className="min-w-0 flex-1 text-left">
          <span className="font-display inline-block rounded-full bg-brand-black px-2.5 py-1 text-[0.65rem] tracking-[0.15em] text-brand-yellow uppercase">
            {artist.genre}
          </span>
          <h3 className="mt-2 font-display text-2xl leading-none uppercase">
            {artist.name}
          </h3>
          <p className="mt-1 text-sm font-medium uppercase">{location}</p>
          <p className="mt-0.5 text-xs uppercase text-brand-black/60">
            {slotLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleProgram}
          aria-label={
            alreadyAdded
              ? `Retirer ${artist.name} du programme`
              : `Ajouter ${artist.name} au programme`
          }
          className={`shrink-0 rounded-full border-2 border-brand-black px-3 py-2 font-display text-sm leading-none uppercase transition-transform active:scale-[0.98] ${
            alreadyAdded
              ? "bg-brand-black/10 text-brand-black/45 shadow-none"
              : "bg-brand-yellow text-brand-black shadow-[2px_2px_0_0_#0a0a0a]"
          }`}
        >
          {alreadyAdded ? "Ajouté" : "Ajouter"}
        </button>
      </div>
    </article>
  );
}
