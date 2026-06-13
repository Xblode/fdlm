"use client";

import { useRef } from "react";
import {
  DEFAULT_VENUE_IMAGE_FOCUS,
  clampVenueImageFocus,
  formatVenueImageObjectPosition,
  normalizeVenueImageFocus,
  pointerToVenueImageFocus,
} from "@/lib/utils/venue-image-position";

type VenueImagePositionEditorProps = {
  imageUrl?: string;
  focusX: number;
  focusY: number;
  onChange: (focus: { x: number; y: number }) => void;
};

export function VenueImagePositionEditor({
  imageUrl,
  focusX,
  focusY,
  onChange,
}: VenueImagePositionEditorProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const focus = normalizeVenueImageFocus(focusX, focusY);

  function updateFromPointer(clientX: number, clientY: number) {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;

    onChange(pointerToVenueImageFocus(clientX, clientY, rect));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageUrl) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX, event.clientY);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageUrl || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    updateFromPointer(event.clientX, event.clientY);
  }

  if (!imageUrl) {
    return (
      <p className="text-sm text-brand-black/60">
        Ajoute une image pour régler son cadrage.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm uppercase">Cadrage de l&apos;image</p>
        <p className="font-display text-xs uppercase tabular-nums text-brand-black/60">
          {focus.x}% · {focus.y}%
        </p>
      </div>

      <div
        ref={previewRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative aspect-[16/10] cursor-crosshair overflow-hidden rounded-2xl border-2 border-brand-black bg-brand-black shadow-[3px_3px_0_0_#0a0a0a]"
      >
        <img
          src={imageUrl}
          alt=""
          className="size-full object-cover"
          style={{ objectPosition: formatVenueImageObjectPosition(focus.x, focus.y) }}
          draggable={false}
        />

        <div
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-yellow bg-brand-black/70 shadow-[0_0_0_2px_#0a0a0a]"
          style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
          aria-hidden="true"
        />
      </div>

      <p className="text-xs text-brand-black/60">
        Clique ou fais glisser sur l&apos;aperçu pour choisir la zone visible.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase text-brand-black/70">Horizontal</span>
          <input
            type="range"
            min={0}
            max={100}
            value={focus.x}
            onChange={(event) =>
              onChange({
                x: clampVenueImageFocus(Number(event.target.value)),
                y: focus.y,
              })
            }
            className="w-full accent-brand-black"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase text-brand-black/70">Vertical</span>
          <input
            type="range"
            min={0}
            max={100}
            value={focus.y}
            onChange={(event) =>
              onChange({
                x: focus.x,
                y: clampVenueImageFocus(Number(event.target.value)),
              })
            }
            className="w-full accent-brand-black"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => onChange({ ...DEFAULT_VENUE_IMAGE_FOCUS })}
        className="font-display text-xs uppercase underline"
      >
        Réinitialiser le cadrage
      </button>
    </div>
  );
}
