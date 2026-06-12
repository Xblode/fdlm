"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Artist, EventInfo, Venue } from "@/lib/data/types";

type SiteDataContextValue = {
  venues: Venue[];
  artists: Artist[];
  availableCityIds: string[];
  musicFilterStyles: string[];
  eventInfo: EventInfo;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({
  venues,
  artists,
  availableCityIds,
  musicFilterStyles,
  eventInfo,
  children,
}: SiteDataContextValue & { children: ReactNode }) {
  return (
    <SiteDataContext.Provider
      value={{
        venues,
        artists,
        availableCityIds,
        musicFilterStyles,
        eventInfo,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);

  if (!context) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }

  return context;
}

export type { EventInfo };
