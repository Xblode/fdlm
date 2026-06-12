"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { BottomSheetPortal } from "@/components/bottom-sheet-portal";
import { cities, getCityById } from "@/config/cities";
import { useSiteData } from "@/components/site-data-provider";
import { useBodyScrollLock } from "@/components/use-body-scroll-lock";
import { useModalTransition } from "@/components/use-modal-transition";
import type {
  EventSubmission,
  SubmissionType,
  VenueArtistEntry,
} from "@/config/submissions";

function CloseIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    </svg>
  );
}

const availableCities = cities.filter((city) => city.available === true);

function emptyArtistEntry(): VenueArtistEntry {
  return { name: "", hoursStart: "", hoursEnd: "", style: "" };
}

const timeInputClassName =
  "w-full rounded-2xl border-2 border-brand-black bg-white px-3 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] outline-none";

function ClockIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

type StyledTimeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function StyledTimeInput({
  id,
  value,
  onChange,
  required,
}: StyledTimeInputProps) {
  const display = value ? value.slice(0, 5) : "--:--";

  return (
    <div className="relative w-full rounded-2xl focus-within:ring-2 focus-within:ring-brand-black/20">
      <div
        className={`${timeInputClassName} pointer-events-none flex items-center justify-between gap-2`}
        aria-hidden="true"
      >
        <span
          className={`tabular-nums ${value ? "" : "text-brand-black/45"}`}
        >
          {display}
        </span>
        <ClockIcon className="size-4 shrink-0 text-brand-black/70" />
      </div>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        step={900}
        className="time-input-overlay absolute inset-0 z-10 h-full w-full cursor-pointer"
      />
    </div>
  );
}

type TimeRangeFieldProps = {
  id: string;
  label: string;
  start: string;
  end: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  required?: boolean;
};

function TimeRangeField({
  id,
  label,
  start,
  end,
  onStartChange,
  onEndChange,
  required,
}: TimeRangeFieldProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-0.5 font-display text-sm uppercase text-brand-black/70">
        {label}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-start`} className="text-xs uppercase text-brand-black/55">
            Début
          </label>
          <StyledTimeInput
            id={`${id}-start`}
            value={start}
            onChange={onStartChange}
            required={required}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}-end`} className="text-xs uppercase text-brand-black/55">
            Fin
          </label>
          <StyledTimeInput
            id={`${id}-end`}
            value={end}
            onChange={onEndChange}
            required={required}
          />
        </div>
      </div>
    </fieldset>
  );
}

type SuggestInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
};

function SuggestInput({
  id,
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  required,
}: SuggestInputProps) {
  const listId = `${id}-suggestions`;
  const normalized = value.trim().toLowerCase();
  const filtered = suggestions.filter((item) =>
    item.toLowerCase().includes(normalized),
  );
  const showCustomHint =
    normalized.length > 0 &&
    !suggestions.some((item) => item.toLowerCase() === normalized);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-sm uppercase text-brand-black/70">
        {label}
      </label>
      <input
        id={id}
        type="text"
        list={listId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full rounded-2xl border-2 border-brand-black bg-white px-4 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] outline-none placeholder:text-brand-black/30 focus:ring-2 focus:ring-brand-black/20"
      />
      <datalist id={listId}>
        {filtered.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
      {showCustomHint ? (
        <p className="text-xs text-brand-black/55">
          Nouveau — sera lié s&apos;il existe déjà, sinon créé après validation.
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-sm uppercase text-brand-black/70">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border-2 border-brand-black bg-white px-4 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] outline-none placeholder:text-brand-black/30 focus:ring-2 focus:ring-brand-black/20"
      />
    </div>
  );
}

type CitySelectProps = {
  id: string;
  value: string;
  onChange: (cityId: string) => void;
};

function CitySelect({ id, value, onChange }: CitySelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-sm uppercase text-brand-black/70">
        Ville
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full appearance-none rounded-2xl border-2 border-brand-black bg-white px-4 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] outline-none focus:ring-2 focus:ring-brand-black/20"
      >
        {availableCities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}

type AddEventSheetProps = {
  defaultCityId: string;
};

export function AddEventSheet({ defaultCityId }: AddEventSheetProps) {
  const { venues, musicFilterStyles } = useSiteData();
  const venueSuggestions = useMemo(
    () => venues.map((venue) => venue.name),
    [venues],
  );
  const [isOpen, setIsOpen] = useState(false);
  const { isMounted, isVisible } = useModalTransition(isOpen);
  const [submissionType, setSubmissionType] = useState<SubmissionType>("artist");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [hoursStart, setHoursStart] = useState("");
  const [hoursEnd, setHoursEnd] = useState("");
  const [style, setStyle] = useState("");
  const [cityId, setCityId] = useState(defaultCityId);

  const [venueName, setVenueName] = useState("");
  const [venueHoursStart, setVenueHoursStart] = useState("");
  const [venueHoursEnd, setVenueHoursEnd] = useState("");
  const [venueCityId, setVenueCityId] = useState(defaultCityId);
  const [venueArtists, setVenueArtists] = useState<VenueArtistEntry[]>([
    emptyArtistEntry(),
  ]);

  const titleId = useId();
  const formId = useId();

  useBodyScrollLock(isMounted);

  const resetForm = useCallback(() => {
    setSubmissionType("artist");
    setName("");
    setVenue("");
    setHoursStart("");
    setHoursEnd("");
    setStyle("");
    setCityId(defaultCityId);
    setVenueName("");
    setVenueHoursStart("");
    setVenueHoursEnd("");
    setVenueCityId(defaultCityId);
    setVenueArtists([emptyArtistEntry()]);
    setSubmitError(null);
    setIsSuccess(false);
    setIsSubmitting(false);
  }, [defaultCityId]);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSheet();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeSheet]);

  function openSheet() {
    resetForm();
    setIsOpen(true);
  }

  function switchType(type: SubmissionType) {
    setSubmissionType(type);
    setSubmitError(null);
  }

  function updateVenueArtist(index: number, patch: Partial<VenueArtistEntry>) {
    setVenueArtists((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, ...patch } : entry,
      ),
    );
  }

  function addVenueArtist() {
    setVenueArtists((current) => [...current, emptyArtistEntry()]);
  }

  function removeVenueArtist(index: number) {
    setVenueArtists((current) =>
      current.length <= 1 ? current : current.filter((_, i) => i !== index),
    );
  }

  function buildPayload(): EventSubmission | null {
    if (submissionType === "artist") {
      if (
        !name.trim() ||
        !venue.trim() ||
        !hoursStart ||
        !hoursEnd ||
        !style.trim()
      ) {
        return null;
      }

      return {
        type: "artist",
        name: name.trim(),
        venue: venue.trim(),
        hoursStart,
        hoursEnd,
        style: style.trim(),
        cityId,
      };
    }

    const validArtists = venueArtists.filter(
      (artist) =>
        artist.name.trim() &&
        artist.hoursStart &&
        artist.hoursEnd &&
        artist.style.trim(),
    );

    if (
      !venueName.trim() ||
      !venueHoursStart ||
      !venueHoursEnd ||
      validArtists.length === 0
    ) {
      return null;
    }

    return {
      type: "venue",
      venueName: venueName.trim(),
      hoursStart: venueHoursStart,
      hoursEnd: venueHoursEnd,
      cityId: venueCityId,
      artists: validArtists.map((artist) => ({
        name: artist.name.trim(),
        hoursStart: artist.hoursStart,
        hoursEnd: artist.hoursEnd,
        style: artist.style.trim(),
      })),
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const payload = buildPayload();
    if (!payload) {
      setSubmitError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/event-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message ?? "La soumission a échoué.");
      }

      setIsSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "La soumission a échoué.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedCityName = getCityById(
    submissionType === "artist" ? cityId : venueCityId,
  ).name;

  return (
    <div className="col-span-2">
      <button
        type="button"
        onClick={openSheet}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={titleId}
        className="flex h-12 w-full items-center justify-center rounded-full border-2 border-brand-black bg-brand-yellow px-4 text-center font-display text-lg tracking-wide text-brand-black uppercase shadow-[4px_4px_0_0_#0a0a0a] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#0a0a0a]"
      >
        Ajouter mon Events
      </button>

      {isMounted ? (
        <BottomSheetPortal>
          <div
            className={`fixed inset-x-0 bottom-0 top-[var(--mobile-header-height)] z-40 bg-brand-black/55 transition-opacity duration-300 ease-out md:hidden ${
              isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={closeSheet}
            aria-hidden={false}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-6 md:hidden"
          >
            <div
              className={`pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0" : "pointer-events-none translate-y-full"
              }`}
            >
              <div className="flex max-h-[calc(100dvh-var(--mobile-header-height)-1.5rem)] flex-col overflow-hidden rounded-3xl border-2 border-brand-black bg-brand-yellow shadow-[8px_8px_0_0_#0a0a0a]">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-brand-black bg-brand-black px-5 py-4 text-brand-yellow">
            <h2 id={titleId} className="font-display text-2xl leading-none uppercase">
              Ajouter mon event
            </h2>
            <button
              type="button"
              onClick={closeSheet}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
              aria-label="Fermer le formulaire"
            >
              <CloseIcon />
            </button>
          </div>

          {isSuccess ? (
            <div className="space-y-4 p-5">
              <p className="font-display text-xl uppercase text-brand-black">
                Merci !
              </p>
              <p className="text-sm leading-relaxed text-brand-black/75">
                Votre soumission pour{" "}
                <span className="font-display uppercase">{selectedCityName}</span>{" "}
                a bien été enregistrée. Elle sera examinée avant publication sur
                l&apos;agenda.
              </p>
              <button
                type="button"
                onClick={closeSheet}
                className="w-full rounded-full border-2 border-brand-black bg-brand-black px-4 py-3 font-display text-base uppercase text-brand-yellow shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form
              id={formId}
              onSubmit={handleSubmit}
              className={
                submissionType === "artist"
                  ? "flex flex-col p-4"
                  : "hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-4"
              }
            >
              <div className="mb-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => switchType("artist")}
                  className={`rounded-2xl border-2 border-brand-black px-3 py-2.5 font-display text-sm uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                    submissionType === "artist"
                      ? "bg-brand-black text-brand-yellow"
                      : "bg-white text-brand-black"
                  }`}
                >
                  Groupe / Artiste
                </button>
                <button
                  type="button"
                  onClick={() => switchType("venue")}
                  className={`rounded-2xl border-2 border-brand-black px-3 py-2.5 font-display text-sm uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                    submissionType === "venue"
                      ? "bg-brand-black text-brand-yellow"
                      : "bg-white text-brand-black"
                  }`}
                >
                  Lieu
                </button>
              </div>

              <p className="mb-3 text-xs leading-relaxed text-brand-black/60">
                Chaque ajout est soumis à validation. Les lieux et styles
                personnalisés seront reliés s&apos;ils existent déjà.
              </p>

              {submissionType === "artist" ? (
                <div className="flex flex-col gap-3">
                  <TextField
                    id={`${formId}-artist-name`}
                    label="Nom"
                    value={name}
                    onChange={setName}
                    placeholder="Nom du groupe ou artiste"
                    required
                  />
                  <SuggestInput
                    id={`${formId}-artist-venue`}
                    label="Lieu"
                    value={venue}
                    onChange={setVenue}
                    suggestions={venueSuggestions}
                    placeholder="Choisir ou saisir un lieu"
                    required
                  />
                  <TimeRangeField
                    id={`${formId}-artist-hours`}
                    label="Horaire"
                    start={hoursStart}
                    end={hoursEnd}
                    onStartChange={setHoursStart}
                    onEndChange={setHoursEnd}
                    required
                  />
                  <SuggestInput
                    id={`${formId}-artist-style`}
                    label="Style"
                    value={style}
                    onChange={setStyle}
                    suggestions={[...musicFilterStyles]}
                    placeholder="Choisir ou saisir un style"
                    required
                  />
                  <CitySelect
                    id={`${formId}-artist-city`}
                    value={cityId}
                    onChange={setCityId}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 rounded-2xl border-2 border-brand-black/15 bg-white/40 p-4">
                    <p className="font-display text-sm uppercase text-brand-black">
                      Informations du lieu
                    </p>
                    <TextField
                      id={`${formId}-venue-name`}
                      label="Nom"
                      value={venueName}
                      onChange={setVenueName}
                      placeholder="Nom du lieu"
                      required
                    />
                    <TimeRangeField
                      id={`${formId}-venue-hours`}
                      label="Horaire"
                      start={venueHoursStart}
                      end={venueHoursEnd}
                      onStartChange={setVenueHoursStart}
                      onEndChange={setVenueHoursEnd}
                      required
                    />
                    <CitySelect
                      id={`${formId}-venue-city`}
                      value={venueCityId}
                      onChange={setVenueCityId}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-display text-sm uppercase text-brand-black">
                        Artistes au programme
                      </p>
                      <button
                        type="button"
                        onClick={addVenueArtist}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-black bg-white px-3 py-1.5 font-display text-xs uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
                      >
                        <PlusIcon />
                        Ajouter
                      </button>
                    </div>

                    {venueArtists.map((artist, index) => (
                      <div
                        key={`venue-artist-${index}`}
                        className="relative flex flex-col gap-3 rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]"
                      >
                        {venueArtists.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeVenueArtist(index)}
                            className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full border border-brand-black/20 text-brand-black/50 transition-colors hover:text-brand-black"
                            aria-label={`Retirer l'artiste ${index + 1}`}
                          >
                            <TrashIcon />
                          </button>
                        ) : null}

                        <p className="font-display text-xs uppercase text-brand-black/50">
                          Artiste {index + 1}
                        </p>
                        <TextField
                          id={`${formId}-venue-artist-name-${index}`}
                          label="Nom"
                          value={artist.name}
                          onChange={(value) =>
                            updateVenueArtist(index, { name: value })
                          }
                          placeholder="Nom de l'artiste"
                          required
                        />
                        <TimeRangeField
                          id={`${formId}-venue-artist-hours-${index}`}
                          label="Horaire"
                          start={artist.hoursStart}
                          end={artist.hoursEnd}
                          onStartChange={(value) =>
                            updateVenueArtist(index, { hoursStart: value })
                          }
                          onEndChange={(value) =>
                            updateVenueArtist(index, { hoursEnd: value })
                          }
                          required
                        />
                        <SuggestInput
                          id={`${formId}-venue-artist-style-${index}`}
                          label="Style"
                          value={artist.style}
                          onChange={(value) =>
                            updateVenueArtist(index, { style: value })
                          }
                          suggestions={[...musicFilterStyles]}
                          placeholder="Style musical"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submitError ? (
                <p className="mt-4 text-sm text-brand-black/80" role="alert">
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full shrink-0 rounded-full border-2 border-brand-black bg-brand-black px-4 py-3 font-display text-base uppercase text-brand-yellow shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Envoi…" : "Soumettre pour validation"}
              </button>
            </form>
          )}
              </div>
            </div>
          </div>
        </BottomSheetPortal>
      ) : null}
    </div>
  );
}
