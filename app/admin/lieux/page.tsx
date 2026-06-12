import type { Metadata } from "next";
import { VenuesManager } from "@/components/admin/venues-manager";
import { getArtists } from "@/lib/data/artists";
import { getVenues } from "@/lib/data/venues";

export const metadata: Metadata = {
  title: "Lieux — Administration FDLM 2026",
};

export default async function AdminLieuxPage() {
  const [venues, artists] = await Promise.all([
    getVenues({ publishedOnly: false }),
    getArtists({ publishedOnly: false }),
  ]);

  return (
    <section className="rounded-3xl border-2 border-brand-black bg-brand-yellow p-5 shadow-[6px_6px_0_0_#0a0a0a]">
      <VenuesManager initialVenues={venues} artists={artists} />
    </section>
  );
}
