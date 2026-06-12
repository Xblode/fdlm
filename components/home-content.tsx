"use client";

import { useEffect, useMemo, useState } from "react";
import { cities, defaultCityId } from "@/config/cities";
import { LocationSection } from "@/components/location-section";
import { TransportSection } from "@/components/transport-section";
import { AddEventCtaSection } from "@/components/add-event-cta-section";
import { RdrSection } from "@/components/rdr-section";
import { MobileFooter } from "@/components/mobile-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { useSiteData } from "@/components/site-data-provider";

function pickDefaultCityId(availableCityIds: string[]) {
  if (availableCityIds.includes(defaultCityId)) return defaultCityId;
  return availableCityIds[0] ?? defaultCityId;
}

export function HomeContent() {
  const { availableCityIds } = useSiteData();
  const [selectedCityId, setSelectedCityId] = useState(() =>
    pickDefaultCityId(availableCityIds),
  );

  const pickerCities = useMemo(
    () =>
      cities.map((city) => ({
        ...city,
        available: availableCityIds.includes(city.id),
      })),
    [availableCityIds],
  );

  useEffect(() => {
    if (
      availableCityIds.length > 0 &&
      !availableCityIds.includes(selectedCityId)
    ) {
      setSelectedCityId(pickDefaultCityId(availableCityIds));
    }
  }, [availableCityIds, selectedCityId]);

  return (
    <main className="flex flex-1 flex-col">
      <LocationSection selectedCityId={selectedCityId} />
      <RdrSection />
      <TransportSection />
      <AddEventCtaSection selectedCityId={selectedCityId} />
      <MobileFooter
        selectedCityId={selectedCityId}
        onCityChange={setSelectedCityId}
        cities={pickerCities}
      />
      <ScrollToTopButton />
    </main>
  );
}
