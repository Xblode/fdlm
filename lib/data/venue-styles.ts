import { normalizeMusicStyle } from "@/lib/utils/music-style";

export type VenueStyleEntry = {
  name: string;
  active: boolean;
};

function normalizeStyleName(name: string) {
  return normalizeMusicStyle(name);
}

function styleNamesMatch(a: string, b: string) {
  return normalizeStyleName(a) === normalizeStyleName(b);
}

function dedupeStyleConfig(entries: VenueStyleEntry[]) {
  const result: VenueStyleEntry[] = [];

  for (const entry of entries) {
    const name = normalizeStyleName(entry.name);
    if (!name) continue;

    const existingIndex = result.findIndex((item) => item.name === name);

    if (existingIndex === -1) {
      result.push({ name, active: entry.active });
      continue;
    }

    if (entry.active) {
      result[existingIndex] = { ...result[existingIndex], active: true };
    }
  }

  return result;
}

export function parseStyleConfig(raw: unknown): VenueStyleEntry[] {
  if (!Array.isArray(raw)) return [];

  return dedupeStyleConfig(
    raw
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const name = normalizeStyleName(
          (item as { name?: unknown }).name?.toString() ?? "",
        );
        const active = (item as { active?: unknown }).active;

        if (!name || typeof active !== "boolean") return null;

        return { name, active };
      })
      .filter((item): item is VenueStyleEntry => item !== null),
  );
}

export function getActiveStyleNames(config: VenueStyleEntry[]) {
  return config
    .filter((entry) => entry.active)
    .map((entry) => entry.name)
    .filter(Boolean);
}

export function buildStyleConfigFromLegacy(musicStyles: string[]) {
  return musicStyles
    .map((name) => normalizeStyleName(name))
    .filter(Boolean)
    .map((name) => ({ name, active: true }));
}

export function collectArtistGenres(genres: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const genre of genres) {
    const parts = genre
      .split(/[,·/|]+/)
      .map((part) => normalizeStyleName(part))
      .filter(Boolean);

    for (const name of parts.length > 0 ? parts : [normalizeStyleName(genre)]) {
      if (!name || seen.has(name)) continue;

      seen.add(name);
      result.push(name);
    }
  }

  return result;
}

export function mergeStyleConfig(
  existing: VenueStyleEntry[],
  artistGenres: string[],
) {
  const genres = collectArtistGenres(artistGenres);
  const result: VenueStyleEntry[] = [];

  for (const entry of existing) {
    if (!genres.some((genre) => styleNamesMatch(genre, entry.name))) continue;

    const name = normalizeStyleName(entry.name);
    const existingIndex = result.findIndex((item) => item.name === name);

    if (existingIndex === -1) {
      result.push({ name, active: entry.active });
      continue;
    }

    if (entry.active) {
      result[existingIndex] = { ...result[existingIndex], active: true };
    }
  }

  for (const genre of genres) {
    if (!result.some((entry) => styleNamesMatch(entry.name, genre))) {
      result.push({ name: genre, active: true });
    }
  }

  return dedupeStyleConfig(result);
}

export function initStyleConfig(
  styleConfig: VenueStyleEntry[] | undefined,
  musicStyles: string[],
  artistGenres: string[],
) {
  const base =
    styleConfig && styleConfig.length > 0
      ? styleConfig
      : buildStyleConfigFromLegacy(musicStyles);

  return mergeStyleConfig(base, artistGenres);
}
