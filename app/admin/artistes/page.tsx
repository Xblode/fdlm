import type { Metadata } from "next";
import { ArtistsManager } from "@/components/admin/artists-manager";
import { getArtists } from "@/lib/data/artists";
import { getVenues } from "@/lib/data/venues";

export const metadata: Metadata = {
  title: "Artistes — Administration FDLM 2026",
};

export default async function AdminArtistesPage() {
  const [artists, venues] = await Promise.all([
    getArtists({ publishedOnly: false }),
    getVenues({ publishedOnly: false }),
  ]);

  return (
    <section className="rounded-3xl border-2 border-brand-black bg-brand-yellow p-5 shadow-[6px_6px_0_0_#0a0a0a]">
      <ArtistsManager initialArtists={artists} venues={venues} />
    </section>
  );
}
