import { getArtists } from "@/lib/data/artists";
import { buildEventInfo, buildMusicFilterStyles } from "@/lib/data/event-info";
import {
  filterVenuesWithArtists,
  getAvailableCityIds,
} from "@/lib/data/public-content";
import { getVenues } from "@/lib/data/venues";

export async function getSiteData() {
  const [allVenues, artists] = await Promise.all([
    getVenues({ publishedOnly: true }),
    getArtists({ publishedOnly: true }),
  ]);

  const venues = filterVenuesWithArtists(allVenues, artists);
  const visibleVenueIds = new Set(venues.map((venue) => venue.id));
  const publicArtists = artists.filter((artist) =>
    visibleVenueIds.has(artist.venueId),
  );
  const availableCityIds = getAvailableCityIds(allVenues, artists);
  const featuredVenue = venues[0];

  return {
    venues,
    artists: publicArtists,
    availableCityIds,
    musicFilterStyles: buildMusicFilterStyles(venues, publicArtists),
    eventInfo: featuredVenue
      ? buildEventInfo(featuredVenue)
      : {
          venue: "Fête de la musique",
          venueType: "Événement",
          city: "Le Havre",
          date: "21 juin 2026",
          dateShort: "21 JUIN",
          dateNumeric: "21/06",
          hours: "18h00 – 02h00",
          tagline: "Vivre de techno et d'eau fraîches",
          address: "",
          mapsUrl: "https://maps.google.com",
          venueMusicStyles: [],
        },
  };
}

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;
