"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { cities } from "@/config/cities";
import type { Artist, Venue } from "@/lib/data/types";
import { VenueDetailSection } from "@/components/venue-detail-section";
import { ArtistsSection } from "@/components/artists-section";
import { TransportSection } from "@/components/transport-section";
import { AddEventCtaSection } from "@/components/add-event-cta-section";
import { RdrSection } from "@/components/rdr-section";
import { MobileFooter } from "@/components/mobile-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { useSiteData } from "@/components/site-data-provider";

type VenuePageContentProps = {
  venue: Venue;
  artists: Artist[];
};

export function VenuePageContent({ venue, artists }: VenuePageContentProps) {
  const router = useRouter();
  const { availableCityIds } = useSiteData();

  const pickerCities = useMemo(
    () =>
      cities.map((city) => ({
        ...city,
        available: availableCityIds.includes(city.id),
      })),
    [availableCityIds],
  );

  return (
    <main className="flex flex-1 flex-col">
      <VenueDetailSection venue={venue} artistCount={artists.length} />
      <ArtistsSection venue={venue} artists={artists} />
      <RdrSection />
      <TransportSection />
      <AddEventCtaSection selectedCityId={venue.cityId} />
      <MobileFooter
        selectedCityId={venue.cityId}
        onCityChange={() => router.push("/")}
        cities={pickerCities}
      />
      <ScrollToTopButton />
    </main>
  );
}
