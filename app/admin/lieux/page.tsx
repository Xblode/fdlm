import type { Metadata } from "next";
import { VenuesManager } from "@/components/admin/venues-manager";
import { getVenues } from "@/lib/data/venues";

export const metadata: Metadata = {
  title: "Lieux — Administration FDLM 2026",
};

export default async function AdminLieuxPage() {
  const venues = await getVenues({ publishedOnly: false });

  return (
    <section className="rounded-3xl border-2 border-brand-black bg-brand-yellow p-5 shadow-[6px_6px_0_0_#0a0a0a]">
      <h2 className="font-display text-3xl leading-none uppercase">Lieux</h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-black/70">
        Gère les lieux publiés sur le site et leurs images.
      </p>

      <div className="mt-5">
        <VenuesManager initialVenues={venues} />
      </div>
    </section>
  );
}
