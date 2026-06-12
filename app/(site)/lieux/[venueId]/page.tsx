import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueById, venues } from "@/config/event";
import { VenuePageContent } from "@/components/venue-page-content";

type VenuePageProps = {
  params: Promise<{ venueId: string }>;
};

export function generateStaticParams() {
  return venues.map((venue) => ({ venueId: venue.id }));
}

export async function generateMetadata({
  params,
}: VenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = getVenueById(venueId);

  if (!venue) {
    return { title: "Lieu introuvable" };
  }

  return {
    title: `${venue.name} — Fête de la musique`,
    description: `${venue.venueType} · ${venue.address}`,
  };
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { venueId } = await params;
  const venue = getVenueById(venueId);

  if (!venue) {
    notFound();
  }

  return <VenuePageContent venue={venue} />;
}
