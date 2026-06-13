"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { getCityById } from "@/config/cities";
import type { Artist, Venue } from "@/lib/data/types";
import { initStyleConfig } from "@/lib/data/venue-styles";
import { useAdminCity } from "@/components/admin/admin-city-provider";
import {
  AdminFormModal,
  AdminModalPlusButton,
  adminFieldClassName,
} from "@/components/admin/admin-form-modal";
import { ImageUpload } from "@/components/admin/image-upload";
import { VenueImagePositionEditor } from "@/components/admin/venue-image-position-editor";
import { VenueStyleEditor } from "@/components/admin/venue-style-editor";
import { DEFAULT_VENUE_IMAGE_FOCUS, normalizeVenueImageFocus } from "@/lib/utils/venue-image-position";
import { SearchBar } from "@/components/search-bar";
import { matchesAdminSearch } from "@/lib/utils/admin-search";

type VenuesManagerProps = {
  initialVenues: Venue[];
  artists: Artist[];
};

type VenueDraft = Partial<Venue> & {
  styleConfig?: Venue["styleConfig"];
};

const fieldClassName = adminFieldClassName;

function getVenueArtistGenres(artists: Artist[], venueId: string) {
  return artists
    .filter((artist) => artist.venueId === venueId)
    .map((artist) => artist.genre)
    .filter(Boolean);
}

const emptyVenue = (cityId: string): VenueDraft => ({
  cityId,
  name: "",
  venueType: "Bar",
  address: "",
  hoursStart: "18H00",
  hoursEnd: "02H00",
  musicStyles: [],
  styleConfig: [],
  mapsUrl: "",
  cardImage: "",
  cardImageFocusX: DEFAULT_VENUE_IMAGE_FOCUS.x,
  cardImageFocusY: DEFAULT_VENUE_IMAGE_FOCUS.y,
});

export function VenuesManager({ initialVenues, artists }: VenuesManagerProps) {
  const router = useRouter();
  const { selectedCityId } = useAdminCity();
  const imageFocusRef = useRef<{ x: number; y: number }>({
    ...DEFAULT_VENUE_IMAGE_FOCUS,
  });
  const [venues, setVenues] = useState(initialVenues);
  const [draft, setDraft] = useState<VenueDraft>(emptyVenue(selectedCityId));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cityVenues = useMemo(
    () =>
      venues
        .filter((venue) => venue.cityId === selectedCityId)
        .filter((venue) =>
          matchesAdminSearch(searchQuery, [
            venue.name,
            venue.venueType,
            venue.address,
            venue.hoursStart,
            venue.hoursEnd,
            ...venue.musicStyles,
          ]),
        )
        .sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [venues, selectedCityId, searchQuery],
  );

  const totalCityVenues = useMemo(
    () => venues.filter((venue) => venue.cityId === selectedCityId).length,
    [venues, selectedCityId],
  );

  function openCreateModal() {
    setEditingId(null);
    imageFocusRef.current = { ...DEFAULT_VENUE_IMAGE_FOCUS };
    setDraft(emptyVenue(selectedCityId));
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(venue: Venue) {
    const focus = normalizeVenueImageFocus(
      venue.cardImageFocusX,
      venue.cardImageFocusY,
    );
    imageFocusRef.current = focus;

    setEditingId(venue.id);
    setDraft({
      ...venue,
      cardImageFocusX: focus.x,
      cardImageFocusY: focus.y,
      styleConfig: initStyleConfig(
        venue.styleConfig,
        venue.musicStyles,
        getVenueArtistGenres(artists, venue.id),
      ),
    });
    setError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    imageFocusRef.current = { ...DEFAULT_VENUE_IMAGE_FOCUS };
    setDraft(emptyVenue(selectedCityId));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const focus = normalizeVenueImageFocus(
      imageFocusRef.current.x,
      imageFocusRef.current.y,
    );

    const payload: VenueDraft = {
      name: draft.name,
      cityId: selectedCityId,
      venueType: draft.venueType,
      address: draft.address,
      hoursStart: draft.hoursStart,
      hoursEnd: draft.hoursEnd,
      mapsUrl: draft.mapsUrl,
      cardImage: draft.cardImage,
      cardImageFocusX: focus.x,
      cardImageFocusY: focus.y,
    };

    if (editingId) {
      payload.styleConfig = draft.styleConfig;
    }

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

      closeModal();
      router.refresh();
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
    if (editingId === venueId) closeModal();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-3xl leading-none uppercase">Lieux</h2>
        <AdminModalPlusButton label="Ajouter un lieu" onClick={openCreateModal} />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher un lieu..."
        className=""
      />

      {totalCityVenues === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center">
          <p className="font-display text-xl uppercase">Aucun lieu</p>
          <p className="mt-2 text-sm text-brand-black/70">
            Aucun lieu pour {getCityById(selectedCityId).name}.
          </p>
        </div>
      ) : cityVenues.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center">
          <p className="font-display text-xl uppercase">Aucun résultat</p>
          <p className="mt-2 text-sm text-brand-black/70">
            Aucun lieu ne correspond à « {searchQuery.trim()} ».
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {cityVenues.map((venue) => (
            <li
              key={venue.id}
              className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[2px_2px_0_0_#0a0a0a]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg uppercase">{venue.name}</p>
                  <p className="text-sm text-brand-black/70">
                    {venue.venueType} · {venue.hoursStart} – {venue.hoursEnd}
                  </p>
                  {venue.musicStyles.length > 0 ? (
                    <p className="mt-1 text-xs uppercase text-brand-black/50">
                      {venue.musicStyles.join(" · ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(venue)}
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
      )}

      <AdminFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Modifier un lieu" : "Nouveau lieu"}
        footer={
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              form="venue-form"
              disabled={isSaving}
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
        <form id="venue-form" onSubmit={(event) => void handleSubmit(event)}>
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
            <input
              value={draft.venueType ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  venueType: event.target.value.toUpperCase(),
                }))
              }
              placeholder="Type de lieu"
              className={fieldClassName}
            />
            <input
              value={draft.address ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  address: event.target.value.toUpperCase(),
                }))
              }
              placeholder="Adresse"
              className={fieldClassName}
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
                className={fieldClassName}
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
                className={fieldClassName}
              />
            </div>
            <input
              value={draft.mapsUrl ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  mapsUrl: event.target.value,
                }))
              }
              placeholder="Lien Google Maps (optionnel)"
              className={fieldClassName}
            />
            <ImageUpload
              value={draft.cardImage}
              onChange={(url) =>
                setDraft((current) => ({ ...current, cardImage: url }))
              }
            />

            <VenueImagePositionEditor
              imageUrl={draft.cardImage}
              focusX={draft.cardImageFocusX ?? DEFAULT_VENUE_IMAGE_FOCUS.x}
              focusY={draft.cardImageFocusY ?? DEFAULT_VENUE_IMAGE_FOCUS.y}
              onChange={({ x, y }) => {
                imageFocusRef.current = { x, y };
                setDraft((current) => ({
                  ...current,
                  cardImageFocusX: x,
                  cardImageFocusY: y,
                }));
              }}
            />

            {editingId ? (
              <VenueStyleEditor
                styles={draft.styleConfig ?? []}
                onChange={(styleConfig) =>
                  setDraft((current) => ({ ...current, styleConfig }))
                }
              />
            ) : null}
          </div>

          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        </form>
      </AdminFormModal>
    </div>
  );
}
