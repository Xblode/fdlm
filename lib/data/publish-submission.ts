import type { EventSubmission } from "@/config/submissions";
import { createArtists } from "@/lib/data/artists";
import { createVenue, findVenueByName, venueExists } from "@/lib/data/venues";
import { ensureUniqueVenueId } from "@/lib/utils/slugify";

function formatHoursForDisplay(time: string) {
  return time.replace(":", "H");
}

function buildMapsUrl(name: string, cityName = "Le Havre") {
  return `https://maps.google.com/?q=${encodeURIComponent(`${name} ${cityName}`)}`;
}

async function resolveVenueId(cityId: string, venueName: string) {
  const existing = await findVenueByName(cityId, venueName);
  if (existing) return existing.id;

  const id = await ensureUniqueVenueId(venueName, venueExists);

  await createVenue({
    id,
    cityId,
    name: venueName.trim(),
    venueType: "Lieu",
    address: "Adresse à compléter",
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
    const venueId = await ensureUniqueVenueId(payload.venueName, venueExists);

    await createVenue({
      id: venueId,
      cityId: payload.cityId,
      name: payload.venueName.trim(),
      venueType: "Lieu",
      address: "Adresse à compléter",
      hoursStart: formatHoursForDisplay(payload.hoursStart),
      hoursEnd: formatHoursForDisplay(payload.hoursEnd),
      musicStyles: [
        ...new Set(payload.artists.map((artist) => artist.style).filter(Boolean)),
      ],
      mapsUrl: buildMapsUrl(payload.venueName),
      published: true,
    });

    await createArtists(
      payload.artists.map((artist) => ({
        venueId,
        name: artist.name.trim(),
        slot: formatHoursForDisplay(artist.hoursStart),
        genre: artist.style.trim(),
        published: true,
      })),
    );

    return { venueId };
  }

  const venueId = await resolveVenueId(payload.cityId, payload.venue);

  const artist = await createArtists([
    {
      venueId,
      name: payload.name.trim(),
      slot: formatHoursForDisplay(payload.hoursStart),
      genre: payload.style.trim(),
      published: true,
    },
  ]);

  return { venueId, artistId: artist[0]?.id };
}
