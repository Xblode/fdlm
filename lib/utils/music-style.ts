export function normalizeMusicStyle(value: string) {
  return value.trim().toUpperCase();
}

export function normalizeGenreField(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const parts = trimmed
    .split(/[,·/|]+/)
    .map((part) => normalizeMusicStyle(part))
    .filter(Boolean);

  if (parts.length === 0) return "";

  return parts.join(", ");
}

export function musicStylesMatch(a: string, b: string) {
  return normalizeMusicStyle(a) === normalizeMusicStyle(b);
}
