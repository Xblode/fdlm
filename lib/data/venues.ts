import type { Venue } from "@/lib/data/types";
import type { DbVenue } from "@/lib/data/db-types";
import {
  collectArtistGenres,
  getActiveStyleNames,
  mergeStyleConfig,
  parseStyleConfig,
} from "@/lib/data/venue-styles";
import { normalizeMusicStyle } from "@/lib/utils/music-style";
import { normalizeDisplayText } from "@/lib/utils/display-text";
import { resolveVenueMapsUrl, resolveVenueMapsUrlForSave } from "@/lib/utils/maps-url";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function mapVenue(row: DbVenue): Venue {
  const styleConfig = parseStyleConfig(row.style_config);
  const musicStyles = getActiveStyleNames(styleConfig);
  const name = normalizeDisplayText(row.name);
  const address = normalizeDisplayText(row.address);

  return {
    id: row.id,
    cityId: row.city_id,
    name,
    venueType: normalizeDisplayText(row.venue_type),
    address,
    hoursStart: row.hours_start,
    hoursEnd: row.hours_end,
    musicStyles:
      musicStyles.length > 0
        ? musicStyles
        : (row.music_styles ?? [])
            .map((styleName) => normalizeMusicStyle(styleName))
            .filter(Boolean),
    styleConfig,
    mapsUrl: resolveVenueMapsUrl({
      mapsUrl: row.maps_url ?? "",
      address,
      name,
    }),
    cardImage: row.card_image ?? undefined,
  };
}

export function mapVenueToDb(
  venue: Omit<Venue, "id"> & { id?: string; published?: boolean },
) {
  const name = normalizeDisplayText(venue.name);
  const address = normalizeDisplayText(venue.address);

  return {
    id: venue.id,
    city_id: venue.cityId,
    name,
    venue_type: normalizeDisplayText(venue.venueType),
    address,
    hours_start: venue.hoursStart,
    hours_end: venue.hoursEnd,
    music_styles: venue.musicStyles,
    maps_url: resolveVenueMapsUrlForSave({
      mapsUrl: venue.mapsUrl,
      address,
      name,
    }),
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

  let venues = (data as DbVenue[]).map(mapVenue);

  if (options?.publishedOnly !== false) {
    const { data: artists, error: artistsError } = await supabase
      .from("artists")
      .select("venue_id")
      .eq("published", true);

    if (artistsError) throw artistsError;

    const venueIdsWithArtists = new Set(
      (artists ?? []).map((artist) => artist.venue_id),
    );

    venues = venues.filter((venue) => venueIdsWithArtists.has(venue.id));
  }

  return venues;
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
  const existing = await getVenueById(venueId, false);
  if (!existing) throw new Error("Lieu introuvable.");

  const merged = { ...existing, ...updates };
  const name = normalizeDisplayText(merged.name);
  const address = normalizeDisplayText(merged.address);

  const supabase = createServerSupabaseClient();
  const payload: Partial<DbVenue> = {};

  if (updates.cityId !== undefined) payload.city_id = updates.cityId;
  if (
    updates.name !== undefined ||
    updates.venueType !== undefined ||
    updates.address !== undefined ||
    updates.mapsUrl !== undefined
  ) {
    payload.name = name;
    payload.venue_type = normalizeDisplayText(merged.venueType);
    payload.address = address;
    payload.maps_url = resolveVenueMapsUrlForSave({
      mapsUrl: merged.mapsUrl,
      address,
      name,
    });
  }
  if (updates.hoursStart !== undefined) payload.hours_start = updates.hoursStart;
  if (updates.hoursEnd !== undefined) payload.hours_end = updates.hoursEnd;
  if (updates.musicStyles !== undefined) payload.music_styles = updates.musicStyles;
  if (updates.styleConfig !== undefined) {
    payload.style_config = updates.styleConfig;
    payload.music_styles = getActiveStyleNames(updates.styleConfig);
  }
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

export async function syncVenueMusicStyles(venueId: string) {
  const supabase = createServerSupabaseClient();

  const { data: venueRow, error: venueError } = await supabase
    .from("venues")
    .select("music_styles, style_config")
    .eq("id", venueId)
    .maybeSingle();

  if (venueError) throw venueError;
  if (!venueRow) return [];

  const { data: artists, error: artistsError } = await supabase
    .from("artists")
    .select("genre")
    .eq("venue_id", venueId);

  if (artistsError) throw artistsError;

  const artistGenres = collectArtistGenres(
    (artists ?? []).map((artist) => artist.genre ?? ""),
  );

  const existingConfig = parseStyleConfig(venueRow.style_config);
  const styleConfig = mergeStyleConfig(
    existingConfig.length > 0
      ? existingConfig
      : (venueRow.music_styles ?? []).map((name: string) => ({
          name,
          active: true,
        })),
    artistGenres,
  );
  const musicStyles = getActiveStyleNames(styleConfig);
  const hasArtists = (artists ?? []).length > 0;

  const { error } = await supabase
    .from("venues")
    .update({
      music_styles: musicStyles,
      style_config: styleConfig,
      published: hasArtists,
    })
    .eq("id", venueId);

  if (error) throw error;

  return musicStyles;
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
