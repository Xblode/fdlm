export const VENUE_PLACEHOLDER_GRADIENT_COUNT = 3;

function hashVenueId(venueId: string) {
  let hash = 0;

  for (let index = 0; index < venueId.length; index += 1) {
    hash = (hash * 31 + venueId.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function getVenuePlaceholderGradientIndex(venueId: string) {
  return hashVenueId(venueId) % VENUE_PLACEHOLDER_GRADIENT_COUNT;
}

export function getVenuePlaceholderGradientClass(venueId: string) {
  return `venue-placeholder-gradient--${getVenuePlaceholderGradientIndex(venueId)}`;
}
