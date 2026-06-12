import { config } from "dotenv";
import { seedArtists, seedVenues } from "./seed-data";
import { createServerSupabaseClient } from "../lib/supabase/server";

config({ path: ".env.local" });

async function seedDemo() {
  const supabase = createServerSupabaseClient();

  const { error: venuesError } = await supabase.from("venues").upsert(
    seedVenues.map((venue) => ({
      id: venue.id,
      city_id: venue.cityId,
      name: venue.name,
      venue_type: venue.venueType,
      address: venue.address,
      hours_start: venue.hoursStart,
      hours_end: venue.hoursEnd,
      music_styles: venue.musicStyles,
      maps_url: venue.mapsUrl,
      card_image: venue.cardImage ?? null,
      published: true,
    })),
    { onConflict: "id" },
  );

  if (venuesError) throw venuesError;

  for (const artist of seedArtists) {
    const { data: existing, error: findError } = await supabase
      .from("artists")
      .select("id")
      .eq("venue_id", artist.venueId)
      .eq("name", artist.name)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) continue;

    const { error: insertError } = await supabase.from("artists").insert({
      venue_id: artist.venueId,
      name: artist.name,
      slot: artist.slot,
      genre: artist.genre,
      published: true,
    });

    if (insertError) throw insertError;
  }

  console.log("Données de démo (lieux + artistes) insérées.");
}

seedDemo().catch((error) => {
  console.error("Seed demo failed:", error);
  process.exit(1);
});
