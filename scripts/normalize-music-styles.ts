import { config } from "dotenv";

config({ path: ".env.local" });

import { normalizeGenreField } from "../lib/utils/music-style";
import { syncVenueMusicStyles } from "../lib/data/venues";
import { createServerSupabaseClient } from "../lib/supabase/server";

async function normalizeExistingMusicStyles() {
  const supabase = createServerSupabaseClient();

  const { data: artists, error: artistsError } = await supabase
    .from("artists")
    .select("id, genre");

  if (artistsError) throw artistsError;

  for (const artist of artists ?? []) {
    const genre = normalizeGenreField(artist.genre ?? "");
    if (genre === artist.genre) continue;

    const { error } = await supabase
      .from("artists")
      .update({ genre })
      .eq("id", artist.id);

    if (error) throw error;
  }

  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select("id");

  if (venuesError) throw venuesError;

  for (const venue of venues ?? []) {
    await syncVenueMusicStyles(venue.id);
  }

  console.log(
    `Styles normalisés pour ${artists?.length ?? 0} artiste(s) et ${venues?.length ?? 0} lieu(x).`,
  );
}

normalizeExistingMusicStyles().catch((error) => {
  console.error(error);
  process.exit(1);
});
