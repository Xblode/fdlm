import type { Venue } from "@/config/event";
import type { DbVenue } from "@/lib/data/db-types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function mapVenue(row: DbVenue): Venue {
  return {
    id: row.id,
    cityId: row.city_id,
    name: row.name,
    venueType: row.venue_type,
    address: row.address,
    hoursStart: row.hours_start,
    hoursEnd: row.hours_end,
    musicStyles: row.music_styles ?? [],
    mapsUrl: row.maps_url,
    cardImage: row.card_image ?? undefined,
  };
}

export function mapVenueToDb(
  venue: Omit<Venue, "id"> & { id?: string; published?: boolean },
) {
  return {
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
    published: venue.published ?? true,
  };
}

export async function getVenues(options?: { cityId?: string; publishedOnly?: boolean }) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("venues").select("*").order("name");

  if (options?.cityId) {
    query = query.eq("city_id", options.cityId);
  }

  if (options?.publishedOnly !== false) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as DbVenue[]).map(mapVenue);
}

export async function getVenueById(venueId: string, publishedOnly = true) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("venues").select("*").eq("id", venueId);

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapVenue(data as DbVenue);
}

export async function venueExists(venueId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("venues")
    .select("id")
    .eq("id", venueId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function createVenue(
  venue: Omit<Venue, "id"> & { id: string; published?: boolean },
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("venues")
    .insert(mapVenueToDb(venue))
    .select("*")
    .single();

  if (error) throw error;

  return mapVenue(data as DbVenue);
}

export async function updateVenue(venueId: string, updates: Partial<Venue>) {
  const supabase = createServerSupabaseClient();
  const payload: Partial<DbVenue> = {};

  if (updates.cityId !== undefined) payload.city_id = updates.cityId;
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.venueType !== undefined) payload.venue_type = updates.venueType;
  if (updates.address !== undefined) payload.address = updates.address;
  if (updates.hoursStart !== undefined) payload.hours_start = updates.hoursStart;
  if (updates.hoursEnd !== undefined) payload.hours_end = updates.hoursEnd;
  if (updates.musicStyles !== undefined) payload.music_styles = updates.musicStyles;
  if (updates.mapsUrl !== undefined) payload.maps_url = updates.mapsUrl;
  if (updates.cardImage !== undefined) payload.card_image = updates.cardImage ?? null;

  const { data, error } = await supabase
    .from("venues")
    .update(payload)
    .eq("id", venueId)
    .select("*")
    .single();

  if (error) throw error;

  return mapVenue(data as DbVenue);
}

export async function deleteVenue(venueId: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("venues").delete().eq("id", venueId);

  if (error) throw error;
}

export async function findVenueByName(cityId: string, name: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("city_id", cityId)
    .ilike("name", name.trim())
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapVenue(data as DbVenue);
}
