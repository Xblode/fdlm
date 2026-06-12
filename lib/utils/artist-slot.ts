export function formatArtistSlot(artist: { slot: string; slotEnd?: string }) {
  const start = artist.slot.trim();
  const end = artist.slotEnd?.trim() ?? "";

  if (start && end) return `${start} – ${end}`;
  return start || end;
}
