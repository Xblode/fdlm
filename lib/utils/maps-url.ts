import { normalizeDisplayText } from "@/lib/utils/display-text";

export function buildMapsSearchUrl(query: string) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return "https://www.google.com/maps";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalizedQuery)}`;
}

export function resolveVenueMapsUrl(venue: {
  mapsUrl: string;
  address: string;
  name: string;
}) {
  if (venue.mapsUrl.trim()) return venue.mapsUrl.trim();
  if (venue.address.trim()) return buildMapsSearchUrl(venue.address);
  if (venue.name.trim()) return buildMapsSearchUrl(venue.name);

  return "https://www.google.com/maps";
}

export function resolveVenueMapsUrlForSave(venue: {
  mapsUrl?: string;
  address?: string;
  name?: string;
}) {
  if (venue.mapsUrl?.trim()) return venue.mapsUrl.trim();

  const address = venue.address?.trim()
    ? normalizeDisplayText(venue.address)
    : "";
  if (address) return buildMapsSearchUrl(address);

  const name = venue.name?.trim() ? normalizeDisplayText(venue.name) : "";
  if (name) return buildMapsSearchUrl(name);

  return "";
}
