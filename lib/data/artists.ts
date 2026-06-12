import type { Artist } from "@/lib/data/types";
import type { DbArtist } from "@/lib/data/db-types";
import { normalizeDisplayText } from "@/lib/utils/display-text";
import { normalizeGenreField } from "@/lib/utils/music-style";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function mapArtist(row: DbArtist): Artist {
  return {
    id: row.id,
    name: normalizeDisplayText(row.name),
    slot: row.slot,
    slotEnd: row.slot_end ?? "",
    genre: normalizeGenreField(row.genre),
    venueId: row.venue_id,
  };
}

export function mapArtistToDb(
  artist: Omit<Artist, "id"> & { id?: string; published?: boolean },
) {
  return {
    ...(artist.id ? { id: artist.id } : {}),
    venue_id: artist.venueId,
    name: normalizeDisplayText(artist.name),
    slot: artist.slot,
    slot_end: artist.slotEnd ?? "",
    genre: normalizeGenreField(artist.genre),
    published: artist.published ?? true,
  };
}

export async function getArtists(options?: {
  venueId?: string;
  cityId?: string;
  publishedOnly?: boolean;
}) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("artists").select("*").order("slot");

  if (options?.venueId) {
    query = query.eq("venue_id", options.venueId);
  }

  if (options?.publishedOnly !== false) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) throw error;

  let artists = (data as DbArtist[]).map(mapArtist);

  if (options?.cityId) {
    const venues = await supabase
      .from("venues")
      .select("id")
      .eq("city_id", options.cityId);

    if (venues.error) throw venues.error;

    const venueIds = new Set((venues.data ?? []).map((row) => row.id));
    artists = artists.filter((artist) => venueIds.has(artist.venueId));
  }

  return artists;
}

export async function getArtistsForVenue(venueId: string) {
  return getArtists({ venueId });
}

export async function getArtistById(artistId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", artistId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapArtist(data as DbArtist);
}

export async function createArtist(
  artist: Omit<Artist, "id"> & { id?: string; published?: boolean },
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .insert(mapArtistToDb(artist))
    .select("*")
    .single();

  if (error) throw error;

  return mapArtist(data as DbArtist);
}

export async function createArtists(
  artists: Array<Omit<Artist, "id"> & { published?: boolean }>,
) {
  if (artists.length === 0) return [];

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .insert(artists.map((artist) => mapArtistToDb(artist)))
    .select("*");

  if (error) throw error;

  return (data as DbArtist[]).map(mapArtist);
}

export async function updateArtist(artistId: string, updates: Partial<Artist>) {
  const supabase = createServerSupabaseClient();
  const payload: Partial<DbArtist> = {};

  if (updates.name !== undefined) payload.name = normalizeDisplayText(updates.name);
  if (updates.slot !== undefined) payload.slot = updates.slot;
  if (updates.slotEnd !== undefined) payload.slot_end = updates.slotEnd;
  if (updates.genre !== undefined) {
    payload.genre = normalizeGenreField(updates.genre);
  }
  if (updates.venueId !== undefined) payload.venue_id = updates.venueId;

  const { data, error } = await supabase
    .from("artists")
    .update(payload)
    .eq("id", artistId)
    .select("*")
    .single();

  if (error) throw error;

  return mapArtist(data as DbArtist);
}

export async function deleteArtist(artistId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("artists").delete().eq("id", artistId);

  if (error) throw error;
}
