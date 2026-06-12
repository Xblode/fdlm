"use client";

import { useMemo, useState } from "react";
import { cities } from "@/config/cities";
import type { Venue } from "@/lib/data/types";
import { ImageUpload } from "@/components/admin/image-upload";

type VenuesManagerProps = {
  initialVenues: Venue[];
};

const emptyVenue = (): Partial<Venue> => ({
  cityId: "le-havre",
  name: "",
  venueType: "Bar",
  address: "",
  hoursStart: "18H00",
  hoursEnd: "02H00",
  musicStyles: [],
  mapsUrl: "",
  cardImage: "",
});

export function VenuesManager({ initialVenues }: VenuesManagerProps) {
  const [venues, setVenues] = useState(initialVenues);
  const [draft, setDraft] = useState<Partial<Venue>>(emptyVenue());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stylesInput, setStylesInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sortedVenues = useMemo(
    () => [...venues].sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [venues],
  );

  function startEdit(venue: Venue) {
    setEditingId(venue.id);
    setDraft(venue);
    setStylesInput(venue.musicStyles.join(", "));
  }

  function resetForm() {
    setEditingId(null);
    setDraft(emptyVenue());
    setStylesInput("");
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...draft,
      musicStyles: stylesInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(
        editingId ? `/api/admin/venues/${editingId}` : "/api/admin/venues",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Erreur");
      }

      if (editingId) {
        setVenues((current) =>
          current.map((venue) =>
            venue.id === editingId ? result.data : venue,
          ),
        );
      } else {
        setVenues((current) => [...current, result.data]);
      }

      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible d'enregistrer le lieu.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(venueId: string) {
    if (!window.confirm("Supprimer ce lieu ?")) return;

    const response = await fetch(`/api/admin/venues/${venueId}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (!response.ok || !result.ok) {
      setError(result.message ?? "Suppression impossible.");
      return;
    }

    setVenues((current) => current.filter((venue) => venue.id !== venueId));
    if (editingId === venueId) resetForm();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]"
      >
        <h3 className="font-display text-xl uppercase">
          {editingId ? "Modifier un lieu" : "Nouveau lieu"}
        </h3>

        <div className="mt-4 grid gap-3">
          <input
            value={draft.name ?? ""}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Nom"
            required
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          />
          <select
            value={draft.cityId ?? "le-havre"}
            onChange={(event) =>
              setDraft((current) => ({ ...current, cityId: event.target.value }))
            }
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <input
            value={draft.venueType ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                venueType: event.target.value,
              }))
            }
            placeholder="Type de lieu"
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          />
          <input
            value={draft.address ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
            placeholder="Adresse"
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={draft.hoursStart ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  hoursStart: event.target.value,
                }))
              }
              placeholder="Ouverture (20H00)"
              className="rounded-xl border-2 border-brand-black px-3 py-2"
            />
            <input
              value={draft.hoursEnd ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  hoursEnd: event.target.value,
                }))
              }
              placeholder="Fermeture (02H00)"
              className="rounded-xl border-2 border-brand-black px-3 py-2"
            />
          </div>
          <input
            value={stylesInput}
            onChange={(event) => setStylesInput(event.target.value)}
            placeholder="Styles (Techno, House...)"
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          />
          <input
            value={draft.mapsUrl ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                mapsUrl: event.target.value,
              }))
            }
            placeholder="Lien Google Maps"
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          />
          <ImageUpload
            value={draft.cardImage}
            onChange={(url) =>
              setDraft((current) => ({ ...current, cardImage: url }))
            }
          />
        </div>

        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full border-2 border-brand-black bg-brand-yellow px-4 py-2 font-display text-sm uppercase"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border-2 border-brand-black px-4 py-2 font-display text-sm uppercase"
            >
              Annuler
            </button>
          ) : null}
        </div>
      </form>

      <ul className="space-y-3">
        {sortedVenues.map((venue) => (
          <li
            key={venue.id}
            className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[2px_2px_0_0_#0a0a0a]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg uppercase">{venue.name}</p>
                <p className="text-sm text-brand-black/70">
                  {venue.venueType} · {venue.cityId}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(venue)}
                  className="font-display text-xs uppercase underline"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(venue.id)}
                  className="font-display text-xs uppercase text-red-700 underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
