import type { EventSubmission } from "@/config/submissions";
import { createArtists } from "@/lib/data/artists";
import {
  createVenue,
  findVenueByName,
  syncVenueMusicStyles,
  venueExists,
} from "@/lib/data/venues";
import { ensureUniqueVenueId } from "@/lib/utils/slugify";
import { normalizeDisplayText } from "@/lib/utils/display-text";
import { buildMapsSearchUrl } from "@/lib/utils/maps-url";
import { normalizeGenreField } from "@/lib/utils/music-style";

function formatHoursForDisplay(time: string) {
  return time.replace(":", "H");
}

function buildMapsUrl(name: string, cityName = "Le Havre") {
  return buildMapsSearchUrl(`${normalizeDisplayText(name)} ${cityName}`);
}

async function resolveVenueId(cityId: string, venueName: string) {
  const existing = await findVenueByName(cityId, venueName);
  if (existing) return existing.id;

  const id = await ensureUniqueVenueId(venueName, venueExists);

  await createVenue({
    id,
    cityId,
    name: normalizeDisplayText(venueName),
    venueType: "LIEU",
    address: "ADRESSE À COMPLÉTER",
    hoursStart: "18H00",
    hoursEnd: "02H00",
    musicStyles: [],
    mapsUrl: buildMapsUrl(venueName),
    published: true,
  });

  return id;
}

export async function publishApprovedSubmission(payload: EventSubmission) {
  if (payload.type === "venue") {
    const existingVenue = await findVenueByName(payload.cityId, payload.venueName);
    const venueId =
      existingVenue?.id ??
      (await ensureUniqueVenueId(payload.venueName, venueExists));

    if (!existingVenue) {
      await createVenue({
        id: venueId,
        cityId: payload.cityId,
        name: normalizeDisplayText(payload.venueName),
        venueType: "LIEU",
        address: "ADRESSE À COMPLÉTER",
        hoursStart: formatHoursForDisplay(payload.hoursStart),
        hoursEnd: formatHoursForDisplay(payload.hoursEnd),
        musicStyles: [],
        mapsUrl: buildMapsUrl(payload.venueName),
        published: true,
      });
    }

    await createArtists(
      payload.artists.map((artist) => ({
        venueId,
        name: normalizeDisplayText(artist.name),
        slot: formatHoursForDisplay(artist.hoursStart),
        slotEnd: formatHoursForDisplay(artist.hoursEnd),
        genre: normalizeGenreField(artist.style),
        published: true,
      })),
    );

    await syncVenueMusicStyles(venueId);

    return { venueId };
  }

  const venueId = await resolveVenueId(payload.cityId, payload.venue);

  const artist = await createArtists([
    {
      venueId,
      name: normalizeDisplayText(payload.name),
      slot: formatHoursForDisplay(payload.hoursStart),
      slotEnd: formatHoursForDisplay(payload.hoursEnd),
      genre: normalizeGenreField(payload.style),
      published: true,
    },
  ]);

  await syncVenueMusicStyles(venueId);

  return { venueId, artistId: artist[0]?.id };
}
