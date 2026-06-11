"use client";

import { useState } from "react";
import type { Venue } from "@/config/event";
import { defaultCityId } from "@/config/cities";
import { ArtistsSection } from "@/components/artists-section";
import { LocationSection } from "@/components/location-section";
import { MobileFooter } from "@/components/mobile-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

export function HomeContent() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCityId, setSelectedCityId] = useState(defaultCityId);

  function handleCityChange(cityId: string) {
    setSelectedCityId(cityId);
    setSelectedVenue(null);
  }

  return (
    <main className="flex flex-1 flex-col">
      <LocationSection
        selectedVenue={selectedVenue}
        onSelectVenue={setSelectedVenue}
        onCloseVenue={() => setSelectedVenue(null)}
        selectedCityId={selectedCityId}
      />
      {selectedVenue ? <ArtistsSection venue={selectedVenue} /> : null}
      <MobileFooter
        selectedCityId={selectedCityId}
        onCityChange={handleCityChange}
      />
      <ScrollToTopButton />
    </main>
  );
}
