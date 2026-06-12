"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Artist, Venue } from "@/config/event";

export type EventInfo = {
  venue: string;
  venueType: string;
  city: string;
  date: string;
  dateShort: string;
  dateNumeric: string;
  hours: string;
  tagline: string;
  address: string;
  mapsUrl: string;
  venueMusicStyles: readonly string[];
};

type SiteDataContextValue = {
  venues: Venue[];
  artists: Artist[];
  musicFilterStyles: string[];
  eventInfo: EventInfo;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({
  venues,
  artists,
  musicFilterStyles,
  eventInfo,
  children,
}: SiteDataContextValue & { children: ReactNode }) {
  return (
    <SiteDataContext.Provider
      value={{ venues, artists, musicFilterStyles, eventInfo }}
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
