import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtistsForVenue } from "@/lib/data/artists";
import { getVenueById, getVenues } from "@/lib/data/venues";
import { VenuePageContent } from "@/components/venue-page-content";

export const revalidate = 60;

type VenuePageProps = {
  params: Promise<{ venueId: string }>;
};

export async function generateStaticParams() {
  const venues = await getVenues({ publishedOnly: true });
  return venues.map((venue) => ({ venueId: venue.id }));
}

export async function generateMetadata({
  params,
}: VenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = await getVenueById(venueId);

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
  const [venue, artists] = await Promise.all([
    getVenueById(venueId),
    getArtistsForVenue(venueId),
  ]);

  if (!venue) {
    notFound();
  }

  return <VenuePageContent venue={venue} artists={artists} />;
}
