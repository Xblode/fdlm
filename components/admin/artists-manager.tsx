"use client";

import { useMemo, useState } from "react";
import type { Artist, Venue } from "@/lib/data/types";

type ArtistsManagerProps = {
  initialArtists: Artist[];
  venues: Venue[];
};

const emptyArtist = (): Partial<Artist> => ({
  name: "",
  slot: "20h00",
  genre: "",
  venueId: "",
});

export function ArtistsManager({ initialArtists, venues }: ArtistsManagerProps) {
  const [artists, setArtists] = useState(initialArtists);
  const [draft, setDraft] = useState<Partial<Artist>>(emptyArtist());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterVenueId, setFilterVenueId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredArtists = useMemo(() => {
    const list = filterVenueId
      ? artists.filter((artist) => artist.venueId === filterVenueId)
      : artists;

    return [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [artists, filterVenueId]);

  const venueNameById = useMemo(
    () => new Map(venues.map((venue) => [venue.id, venue.name])),
    [venues],
  );

  function startEdit(artist: Artist) {
    setEditingId(artist.id);
    setDraft(artist);
  }

  function resetForm() {
    setEditingId(null);
    setDraft(emptyArtist());
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        editingId ? `/api/admin/artists/${editingId}` : "/api/admin/artists",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Erreur");
      }

      if (editingId) {
        setArtists((current) =>
          current.map((artist) =>
            artist.id === editingId ? result.data : artist,
          ),
        );
      } else {
        setArtists((current) => [...current, result.data]);
      }

      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible d'enregistrer l'artiste.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(artistId: string) {
    if (!window.confirm("Supprimer cet artiste ?")) return;

    const response = await fetch(`/api/admin/artists/${artistId}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (!response.ok || !result.ok) {
      setError(result.message ?? "Suppression impossible.");
      return;
    }

    setArtists((current) => current.filter((artist) => artist.id !== artistId));
    if (editingId === artistId) resetForm();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="font-display text-sm uppercase">Filtrer par lieu</label>
        <select
          value={filterVenueId}
          onChange={(event) => setFilterVenueId(event.target.value)}
          className="rounded-xl border-2 border-brand-black px-3 py-2"
        >
          <option value="">Tous</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]"
      >
        <h3 className="font-display text-xl uppercase">
          {editingId ? "Modifier un artiste" : "Nouvel artiste"}
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
            value={draft.venueId ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                venueId: event.target.value,
              }))
            }
            required
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          >
            <option value="">Choisir un lieu</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          <input
            value={draft.slot ?? ""}
            onChange={(event) =>
              setDraft((current) => ({ ...current, slot: event.target.value }))
            }
            placeholder="Créneau (22h00)"
            className="rounded-xl border-2 border-brand-black px-3 py-2"
          />
          <input
            value={draft.genre ?? ""}
            onChange={(event) =>
              setDraft((current) => ({ ...current, genre: event.target.value }))
            }
            placeholder="Genre"
            className="rounded-xl border-2 border-brand-black px-3 py-2"
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
        {filteredArtists.map((artist) => (
          <li
            key={artist.id}
            className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[2px_2px_0_0_#0a0a0a]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg uppercase">{artist.name}</p>
                <p className="text-sm text-brand-black/70">
                  {artist.slot} · {artist.genre} ·{" "}
                  {venueNameById.get(artist.venueId) ?? artist.venueId}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(artist)}
                  className="font-display text-xs uppercase underline"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(artist.id)}
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
