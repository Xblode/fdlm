import { config } from "dotenv";
import { createServerSupabaseClient } from "../lib/supabase/server";

config({ path: ".env.local" });

async function clearContent() {
  const supabase = createServerSupabaseClient();

  const { error: artistsError } = await supabase
    .from("artists")
    .delete()
    .gte("created_at", "1970-01-01T00:00:00Z");

  if (artistsError) throw artistsError;

  const { error: venuesError } = await supabase
    .from("venues")
    .delete()
    .gte("created_at", "1970-01-01T00:00:00Z");

  if (venuesError) throw venuesError;

  console.log("Lieux et artistes supprimés de Supabase.");
}

clearContent().catch((error) => {
  console.error("Clear content failed:", error);
  process.exit(1);
});
