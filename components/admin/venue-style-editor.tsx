"use client";

import { useRef, useState } from "react";
import type { VenueStyleEntry } from "@/lib/data/venue-styles";

type VenueStyleEditorProps = {
  styles: VenueStyleEntry[];
  onChange: (styles: VenueStyleEntry[]) => void;
};

export function VenueStyleEditor({ styles, onChange }: VenueStyleEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragMovedRef = useRef(false);

  function handleDragStart(index: number) {
    dragMovedRef.current = false;
    setDraggedIndex(index);
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>, index: number) {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    dragMovedRef.current = true;
    const next = [...styles];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setDraggedIndex(index);
    onChange(next);
  }

  function handleToggle(index: number) {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }

    onChange(
      styles.map((style, currentIndex) =>
        currentIndex === index ? { ...style, active: !style.active } : style,
      ),
    );
  }

  if (styles.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-brand-black/30 bg-white px-4 py-5 text-sm text-brand-black/70">
        Ajoutez d&apos;abord des artistes avec un genre pour gérer les styles
        mis en avant.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="font-display text-sm uppercase">Styles mis en avant</p>
        <p className="mt-1 text-sm text-brand-black/70">
          Glissez pour réordonner. Cliquez pour activer ou désactiver un style
          sur le site.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {styles.map((style, index) => (
          <button
            key={style.name}
            type="button"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={() => setDraggedIndex(null)}
            onClick={() => handleToggle(index)}
            aria-pressed={style.active}
            className={`cursor-grab rounded-full border-2 border-brand-black px-3 py-1.5 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-opacity active:cursor-grabbing ${
              style.active
                ? "bg-brand-yellow text-brand-black"
                : "bg-white text-brand-black/45 line-through decoration-brand-black/30"
            } ${draggedIndex === index ? "opacity-60" : ""}`}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
}
