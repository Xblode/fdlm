import { config } from "dotenv";

config({ path: ".env.local" });

import { Client } from "pg";
import { normalizeGenreField } from "../lib/utils/music-style";
import { normalizeDisplayText } from "../lib/utils/display-text";
import { resolveVenueMapsUrlForSave } from "../lib/utils/maps-url";
import { syncVenueMusicStyles } from "../lib/data/venues";
import { createServerSupabaseClient } from "../lib/supabase/server";

async function normalizeContent() {
  const connectionString = (
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
  )?.replace(/[?&]sslmode=[^&]*/g, "");

  if (connectionString) {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query(
      "ALTER TABLE artists ADD COLUMN IF NOT EXISTS slot_end TEXT NOT NULL DEFAULT ''",
    );
    await client.end();
  }

  const supabase = createServerSupabaseClient();

  const { data: artists, error: artistsError } = await supabase
    .from("artists")
    .select("id, name, genre, slot, slot_end");

  if (artistsError) throw artistsError;

  for (const artist of artists ?? []) {
    const name = normalizeDisplayText(artist.name ?? "");
    const genre = normalizeGenreField(artist.genre ?? "");
    const slot = (artist.slot ?? "").trim().toUpperCase();
    const slotEnd = (artist.slot_end ?? "").trim().toUpperCase();

    if (
      name === artist.name &&
      genre === artist.genre &&
      slot === artist.slot &&
      slotEnd === (artist.slot_end ?? "")
    ) {
      continue;
    }

    const { error } = await supabase
      .from("artists")
      .update({ name, genre, slot, slot_end: slotEnd })
      .eq("id", artist.id);

    if (error) throw error;
  }

  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select("id, name, venue_type, address, maps_url");

  if (venuesError) throw venuesError;

  for (const venue of venues ?? []) {
    const name = normalizeDisplayText(venue.name ?? "");
    const venueType = normalizeDisplayText(venue.venue_type ?? "");
    const address = normalizeDisplayText(venue.address ?? "");
    const mapsUrl = resolveVenueMapsUrlForSave({
      mapsUrl: venue.maps_url ?? "",
      address,
      name,
    });

    const { error } = await supabase
      .from("venues")
      .update({
        name,
        venue_type: venueType,
        address,
        maps_url: mapsUrl,
      })
      .eq("id", venue.id);

    if (error) throw error;

    await syncVenueMusicStyles(venue.id);
  }

  console.log(
    `Contenu normalisé : ${artists?.length ?? 0} artiste(s), ${venues?.length ?? 0} lieu(x).`,
  );
}

normalizeContent().catch((error) => {
  console.error(error);
  process.exit(1);
});
