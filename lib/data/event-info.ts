import type { Venue, Artist } from "@/config/event";

const priorityMusicStyles = ["Techno", "Rock", "House"];

export function buildMusicFilterStyles(venues: Venue[], artists: Artist[]) {
  return [
    ...new Set([
      ...venues.flatMap((venue) => venue.musicStyles),
      ...artists.map((artist) => artist.genre),
    ]),
  ].sort((a, b) => {
    const aIndex = priorityMusicStyles.indexOf(a);
    const bIndex = priorityMusicStyles.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b, "fr");
  });
}

export const eventMeta = {
  city: "Le Havre",
  date: "21 juin 2026",
  dateShort: "21 JUIN",
  dateNumeric: "21/06",
  tagline: "Vivre de techno et d'eau fraîches",
} as const;

export function buildEventInfo(featuredVenue: Venue) {
  return {
    venue: featuredVenue.name,
    venueType: featuredVenue.venueType,
    city: eventMeta.city,
    date: eventMeta.date,
    dateShort: eventMeta.dateShort,
    dateNumeric: eventMeta.dateNumeric,
    hours: `${featuredVenue.hoursStart.toLowerCase()} – ${featuredVenue.hoursEnd.toLowerCase()}`,
    tagline: eventMeta.tagline,
    address: featuredVenue.address,
    mapsUrl: featuredVenue.mapsUrl,
    venueMusicStyles: featuredVenue.musicStyles,
  } as const;
}

export async function getFeaturedVenue(venues: Venue[]) {
  return venues[0] ?? null;
}
