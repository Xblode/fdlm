"use client";

import { useRouter } from "next/navigation";
import type { Venue } from "@/config/event";
import { VenueDetailSection } from "@/components/venue-detail-section";
import { ArtistsSection } from "@/components/artists-section";
import { TransportSection } from "@/components/transport-section";
import { AddEventCtaSection } from "@/components/add-event-cta-section";
import { RdrSection } from "@/components/rdr-section";
import { MobileFooter } from "@/components/mobile-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

type VenuePageContentProps = {
  venue: Venue;
};

export function VenuePageContent({ venue }: VenuePageContentProps) {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col">
      <VenueDetailSection venue={venue} />
      <ArtistsSection venue={venue} />
      <RdrSection />
      <TransportSection />
      <AddEventCtaSection selectedCityId={venue.cityId} />
      <MobileFooter
        selectedCityId={venue.cityId}
        onCityChange={() => router.push("/")}
      />
      <ScrollToTopButton />
    </main>
  );
}
