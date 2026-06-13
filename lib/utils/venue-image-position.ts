export const DEFAULT_VENUE_IMAGE_FOCUS = {
  x: 50,
  y: 40,
} as const;

export function clampVenueImageFocus(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function normalizeVenueImageFocus(
  x?: number | null,
  y?: number | null,
) {
  return {
    x: clampVenueImageFocus(x ?? DEFAULT_VENUE_IMAGE_FOCUS.x),
    y: clampVenueImageFocus(y ?? DEFAULT_VENUE_IMAGE_FOCUS.y),
  };
}

export function formatVenueImageObjectPosition(x: number, y: number) {
  const focus = normalizeVenueImageFocus(x, y);
  return `${focus.x}% ${focus.y}%`;
}

export function pointerToVenueImageFocus(
  clientX: number,
  clientY: number,
  rect: DOMRect,
) {
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;

  return normalizeVenueImageFocus(x, y);
}
