import type { ProgramEntry } from "@/components/program-provider";
import type { DbProgramEntry } from "@/lib/data/db-types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function mapProgramEntry(row: DbProgramEntry): ProgramEntry {
  return {
    id: row.artist_id,
    artistId: row.artist_id,
    artistName: row.artist_name,
    slot: row.slot,
    genre: row.genre,
    venueName: row.venue_name,
  };
}

export async function listProgramEntries(userUuid: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("user_programs")
    .select("*")
    .eq("user_uuid", userUuid)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data as DbProgramEntry[]).map(mapProgramEntry);
}

export async function addProgramEntry(
  userUuid: string,
  entry: {
    artistId: string;
    artistName: string;
    slot: string;
    genre: string;
    venueName: string;
  },
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("user_programs")
    .upsert(
      {
        user_uuid: userUuid,
        artist_id: entry.artistId,
        artist_name: entry.artistName,
        slot: entry.slot,
        genre: entry.genre,
        venue_name: entry.venueName,
      },
      { onConflict: "user_uuid,artist_id" },
    )
    .select("*")
    .single();

  if (error) throw error;

  return mapProgramEntry(data as DbProgramEntry);
}

export async function removeProgramEntry(userUuid: string, artistId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("user_programs")
    .delete()
    .eq("user_uuid", userUuid)
    .eq("artist_id", artistId);

  if (error) throw error;
}
