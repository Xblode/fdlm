"use client";

import { useState } from "react";
import { defaultCityId } from "@/config/cities";
import { LocationSection } from "@/components/location-section";
import { TransportSection } from "@/components/transport-section";
import { AddEventCtaSection } from "@/components/add-event-cta-section";
import { RdrSection } from "@/components/rdr-section";
import { MobileFooter } from "@/components/mobile-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

export function HomeContent() {
  const [selectedCityId, setSelectedCityId] = useState(defaultCityId);

  return (
    <main className="flex flex-1 flex-col">
      <LocationSection selectedCityId={selectedCityId} />
      <RdrSection />
      <TransportSection />
      <AddEventCtaSection selectedCityId={selectedCityId} />
      <MobileFooter
        selectedCityId={selectedCityId}
        onCityChange={setSelectedCityId}
      />
      <ScrollToTopButton />
    </main>
  );
}
