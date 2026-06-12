"use client";

import { useMemo, useState } from "react";
import { getCityById } from "@/config/cities";
import type { Artist, Venue } from "@/lib/data/types";
import { useAdminCity } from "@/components/admin/admin-city-provider";
import {
  AdminFormModal,
  AdminModalPlusButton,
  adminFieldClassName,
} from "@/components/admin/admin-form-modal";
import { SearchBar } from "@/components/search-bar";
import { matchesAdminSearch } from "@/lib/utils/admin-search";
import { formatArtistSlot } from "@/lib/utils/artist-slot";

type ArtistsManagerProps = {
  initialArtists: Artist[];
  venues: Venue[];
};

const fieldClassName = adminFieldClassName;

const emptyArtist = (): Partial<Artist> => ({
  name: "",
  slot: "20H00",
  slotEnd: "",
  genre: "",
  venueId: "",
});

export function ArtistsManager({ initialArtists, venues }: ArtistsManagerProps) {
  const { selectedCityId } = useAdminCity();
  const [artists, setArtists] = useState(initialArtists);
  const [draft, setDraft] = useState<Partial<Artist>>(emptyArtist());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cityVenues = useMemo(
    () => venues.filter((venue) => venue.cityId === selectedCityId),
    [venues, selectedCityId],
  );

  const cityVenueIds = useMemo(
    () => new Set(cityVenues.map((venue) => venue.id)),
    [cityVenues],
  );

  const venueNameById = useMemo(
    () => new Map(cityVenues.map((venue) => [venue.id, venue.name])),
    [cityVenues],
  );

  const filteredArtists = useMemo(
    () =>
      artists
        .filter((artist) => cityVenueIds.has(artist.venueId))
        .filter((artist) =>
          matchesAdminSearch(searchQuery, [
            artist.name,
            artist.slot,
            artist.slotEnd,
            artist.genre,
            venueNameById.get(artist.venueId) ?? "",
          ]),
        )
        .sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [artists, cityVenueIds, searchQuery, venueNameById],
  );

  const totalCityArtists = useMemo(
    () => artists.filter((artist) => cityVenueIds.has(artist.venueId)).length,
    [artists, cityVenueIds],
  );

  function openCreateModal() {
    setEditingId(null);
    setDraft({
      ...emptyArtist(),
      venueId: cityVenues[0]?.id ?? "",
    });
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(artist: Artist) {
    setEditingId(artist.id);
    setDraft(artist);
    setError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
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

      closeModal();
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
    if (editingId === artistId) closeModal();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl leading-none uppercase">Artistes</h2>
        <AdminModalPlusButton
          label="Ajouter un artiste"
          onClick={openCreateModal}
        />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher un artiste..."
        className=""
      />

      {cityVenues.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center">
          <p className="font-display text-xl uppercase">Aucun lieu</p>
          <p className="mt-2 text-sm text-brand-black/70">
            Ajoutez d&apos;abord un lieu à {getCityById(selectedCityId).name}.
          </p>
        </div>
      ) : totalCityArtists === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center">
          <p className="font-display text-xl uppercase">Aucun artiste</p>
          <p className="mt-2 text-sm text-brand-black/70">
            Aucun artiste pour {getCityById(selectedCityId).name}.
          </p>
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center">
          <p className="font-display text-xl uppercase">Aucun résultat</p>
          <p className="mt-2 text-sm text-brand-black/70">
            Aucun artiste ne correspond à « {searchQuery.trim()} ».
          </p>
        </div>
      ) : (
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
                    {formatArtistSlot(artist)} · {artist.genre} ·{" "}
                    {venueNameById.get(artist.venueId) ?? artist.venueId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(artist)}
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
      )}

      <AdminFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Modifier un artiste" : "Nouvel artiste"}
        footer={
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              form="artist-form"
              disabled={isSaving || cityVenues.length === 0}
              className="rounded-full border-2 border-brand-black bg-brand-yellow px-4 py-2 font-display text-sm uppercase text-brand-black shadow-[2px_2px_0_0_#0a0a0a] disabled:opacity-60"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => void handleDelete(editingId)}
                className="rounded-full border-2 border-brand-black bg-white px-4 py-2 font-display text-sm uppercase text-red-700"
              >
                Supprimer
              </button>
            ) : null}
          </div>
        }
      >
        <form id="artist-form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="grid gap-3">
            <input
              value={draft.name ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value.toUpperCase(),
                }))
              }
              placeholder="Nom"
              required
              className={fieldClassName}
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
              className={fieldClassName}
            >
              <option value="">Choisir un lieu</option>
              {cityVenues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={draft.slot ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    slot: event.target.value.toUpperCase(),
                  }))
                }
                placeholder="Début (22H00)"
                className={fieldClassName}
              />
              <input
                value={draft.slotEnd ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    slotEnd: event.target.value.toUpperCase(),
                  }))
                }
                placeholder="Fin (23H30)"
                className={fieldClassName}
              />
            </div>
            <input
              value={draft.genre ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  genre: event.target.value.toUpperCase(),
                }))
              }
              placeholder="Genre"
              className={fieldClassName}
            />
          </div>

          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        </form>
      </AdminFormModal>
    </div>
  );
}
