import { config } from "dotenv";
import { cities } from "../config/cities";
import { createServerSupabaseClient } from "../lib/supabase/server";

config({ path: ".env.local" });

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

  console.log("Seed villes terminé.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
