export function matchesAdminSearch(query: string, values: string[]) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return values.some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}
