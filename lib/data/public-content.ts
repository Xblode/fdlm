import type { Artist, Venue } from "@/lib/data/types";

export function filterVenuesWithArtists(venues: Venue[], artists: Artist[]) {
  const venueIdsWithArtists = new Set(artists.map((artist) => artist.venueId));

  return venues.filter((venue) => venueIdsWithArtists.has(venue.id));
}

export function getAvailableCityIds(venues: Venue[], artists: Artist[]) {
  return [
    ...new Set(
      filterVenuesWithArtists(venues, artists).map((venue) => venue.cityId),
    ),
  ];
}
