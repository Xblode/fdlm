import { config } from "dotenv";

config({ path: ".env.local" });
import { cities } from "../config/cities";
import { artists as seedArtists, venues as seedVenues } from "../config/event";
import { createServerSupabaseClient } from "../lib/supabase/server";

async function seed() {
  const supabase = createServerSupabaseClient();

  const { error: citiesError } = await supabase.from("cities").upsert(
    cities.map((city) => ({
      id: city.id,
      name: city.name,
      available: city.available ?? false,
    })),
    { onConflict: "id" },
  );

  if (citiesError) throw citiesError;

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

  console.log("Seed completed successfully.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
