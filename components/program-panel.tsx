"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProgramEntry } from "@/components/program-provider";
import { useProgram } from "@/components/program-provider";
import { useSiteData } from "@/components/site-data-provider";
import { ChevronIcon } from "@/components/chevron-icon";
import { useBodyScrollLock } from "@/components/use-body-scroll-lock";
import { useModalTransition } from "@/components/use-modal-transition";

type ProgramPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ProgramFilter = "all" | number;

function CloseIcon() {
  return (
    <svg
      className="size-6"
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

function parseSlotHour(slot: string) {
  const match = slot.match(/(\d{1,2})h/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function getVenueName(
  venueId: string,
  venues: { id: string; name: string }[],
) {
  return venues.find((venue) => venue.id === venueId)?.name ?? venueId;
}

function buildHourFilters(entries: ProgramEntry[]): ProgramFilter[] {
  if (entries.length === 0) return ["all"];

  const hours = entries.map((entry) => parseSlotHour(entry.slot));
  const minHour = Math.min(...hours);
  const maxHour = Math.max(...hours);
  const range: number[] = [];

  for (let hour = minHour; hour <= maxHour; hour += 1) {
    range.push(hour);
  }

  return ["all", ...range];
}

function formatFilterLabel(filter: ProgramFilter) {
  return filter === "all" ? "Tous" : `${filter}h`;
}

type ProgramEntryCardProps = {
  entry: ProgramEntry;
  onRemove: () => void;
};

function ProgramEntryCard({ entry, onRemove }: ProgramEntryCardProps) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-2xl border-2 border-brand-black bg-white px-3 py-3 shadow-[2px_2px_0_0_#0a0a0a]">
      <div className="min-w-0 text-left">
        <span className="font-display inline-block rounded-full bg-brand-black px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-yellow uppercase">
          {entry.genre}
        </span>
        <p className="mt-1.5 font-display text-lg leading-none uppercase">
          {entry.artistName}
        </p>
        <p className="mt-1 text-xs uppercase text-brand-black/70">
          {entry.slot} · {entry.venueName}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 font-display text-xs uppercase text-brand-black/50 underline"
        aria-label={`Retirer ${entry.artistName} du programme`}
      >
        Retirer
      </button>
    </li>
  );
}

type ProgramSuggestion = {
  artistId: string;
  name: string;
  slot: string;
  genre: string;
  venueName: string;
};

type ProgramSuggestionCardProps = {
  suggestion: ProgramSuggestion;
  onAdd: () => void;
};

function ProgramSuggestionCard({ suggestion, onAdd }: ProgramSuggestionCardProps) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-2xl border-2 border-dashed border-brand-black/35 bg-white/80 px-3 py-3">
      <div className="min-w-0 text-left">
        <span className="font-display inline-block rounded-full border border-brand-black/20 bg-brand-black/5 px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-black/70 uppercase">
          Proposition
        </span>
        <p className="mt-1.5 font-display text-lg leading-none uppercase">
          {suggestion.name}
        </p>
        <p className="mt-1 text-xs uppercase text-brand-black/70">
          {suggestion.slot} · {suggestion.venueName}
        </p>
        <p className="mt-0.5 text-xs uppercase text-brand-black/50">
          {suggestion.genre}
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="shrink-0 rounded-full border-2 border-brand-black bg-brand-yellow px-2.5 py-1.5 font-display text-xs uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
      >
        Ajouter
      </button>
    </li>
  );
}

type ProgramHourFilterProps = {
  label: string;
  canNavigate: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

function ProgramHourFilter({
  label,
  canNavigate,
  onPrevious,
  onNext,
}: ProgramHourFilterProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-1"
      aria-label="Filtrer par tranche horaire"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canNavigate}
        aria-label="Tranche précédente"
        className="inline-flex size-11 shrink-0 items-center justify-center transition-transform active:scale-95 disabled:opacity-35"
      >
        <ChevronIcon direction="left" className="size-6" />
      </button>

      <span className="min-w-0 flex-1 text-center font-display text-2xl leading-none uppercase tabular-nums">
        {label}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNavigate}
        aria-label="Tranche suivante"
        className="inline-flex size-11 shrink-0 items-center justify-center transition-transform active:scale-95 disabled:opacity-35"
      >
        <ChevronIcon direction="right" className="size-6" />
      </button>
    </div>
  );
}

export function ProgramPanel({ isOpen, onClose }: ProgramPanelProps) {
  const { artists, venues, eventInfo } = useSiteData();
  const { entries, removeFromProgram, addToProgram, isInProgram } = useProgram();
  const [filterIndex, setFilterIndex] = useState(0);

  const filters = useMemo(() => buildHourFilters(entries), [entries]);
  const safeFilterIndex =
    filters.length === 0 ? 0 : Math.min(filterIndex, filters.length - 1);
  const currentFilter = filters[safeFilterIndex] ?? "all";
  const currentLabel = formatFilterLabel(currentFilter);

  const filteredEntries = useMemo(() => {
    if (currentFilter === "all") return entries;
    return entries.filter((entry) => parseSlotHour(entry.slot) === currentFilter);
  }, [currentFilter, entries]);

  const suggestions = useMemo(() => {
    if (currentFilter === "all") return [];

    return artists
      .filter((artist) => parseSlotHour(artist.slot) === currentFilter)
      .map((artist) => ({
        artistId: artist.id,
        name: artist.name,
        slot: artist.slot,
        genre: artist.genre,
        venueName: getVenueName(artist.venueId, venues),
      }))
      .filter((artist) => !isInProgram(artist.artistId));
  }, [artists, venues, currentFilter, isInProgram]);

  const { isMounted, isVisible } = useModalTransition(isOpen);

  useBodyScrollLock(isMounted);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function goToPreviousFilter() {
    setFilterIndex((current) =>
      current <= 0 ? filters.length - 1 : current - 1,
    );
  }

  function goToNextFilter() {
    setFilterIndex((current) =>
      current >= filters.length - 1 ? 0 : current + 1,
    );
  }

  function handleBrowseAgenda() {
    onClose();
    requestAnimationFrame(() => {
      document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleAddSuggestion(suggestion: ProgramSuggestion) {
    void addToProgram({
      artistId: suggestion.artistId,
      artistName: suggestion.name,
      slot: suggestion.slot,
      genre: suggestion.genre,
      venueName: suggestion.venueName,
    });
  }

  if (!isMounted) return null;

  const showSuggestions =
    currentFilter !== "all" &&
    filteredEntries.length === 0 &&
    suggestions.length > 0;

  const showEmptyHourSlot =
    currentFilter !== "all" &&
    filteredEntries.length === 0 &&
    suggestions.length === 0;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 top-[var(--mobile-header-height)] z-40 bg-brand-black/45 transition-opacity duration-300 ease-out md:hidden ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={false}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-panel-title"
        className="pointer-events-none fixed inset-x-0 bottom-0 top-[var(--mobile-header-height)] z-50 flex items-center justify-center px-4 md:hidden"
      >
        <div
          className={`pointer-events-auto w-full max-w-[min(88vw,20rem)] origin-center rotate-[-3deg] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-3xl border-2 border-brand-black bg-brand-yellow shadow-[8px_8px_0_0_#0a0a0a]">
            <div className="border-b-2 border-brand-black bg-brand-black px-5 py-4 text-brand-yellow">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xs tracking-[0.2em] uppercase opacity-70">
                    {eventInfo.dateShort} 2026
                  </p>
                  <h2
                    id="program-panel-title"
                    className="mt-1 font-display text-3xl leading-none uppercase"
                  >
                    Mon programme
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow transition-transform active:scale-95"
                  aria-label="Fermer mon programme"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="flex min-h-[280px] flex-col justify-between gap-4 p-5 text-brand-black">
              {entries.length > 0 ? (
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  <ProgramHourFilter
                    label={currentLabel}
                    canNavigate={filters.length > 1}
                    onPrevious={goToPreviousFilter}
                    onNext={goToNextFilter}
                  />

                  <ul className="flex max-h-[240px] flex-col gap-2 overflow-y-auto">
                    {filteredEntries.map((entry) => (
                      <ProgramEntryCard
                        key={entry.id}
                        entry={entry}
                        onRemove={() => removeFromProgram(entry.id)}
                      />
                    ))}

                    {showSuggestions
                      ? suggestions.map((suggestion) => (
                          <ProgramSuggestionCard
                            key={`${suggestion.name}-${suggestion.venueName}`}
                            suggestion={suggestion}
                            onAdd={() => handleAddSuggestion(suggestion)}
                          />
                        ))
                      : null}

                    {showEmptyHourSlot ? (
                      <li className="rounded-2xl border-2 border-dashed border-brand-black/30 bg-white/70 px-4 py-6 text-center">
                        <p className="font-display text-base uppercase">
                          Rien sur cette tranche
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-brand-black/70">
                          Aucun concert ni proposition pour {currentLabel}.
                        </p>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-brand-black/30 bg-white px-4 py-8 text-center">
                  <p className="font-display text-xl leading-tight uppercase">
                    Ton programme est vide
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-black/70">
                    Parcours l&apos;agenda et ajoute tes concerts pour les
                    retrouver ici.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleBrowseAgenda}
                className="w-full shrink-0 rounded-full border-2 border-brand-black bg-brand-black px-4 py-3 font-display text-lg tracking-wide text-brand-yellow uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
              >
                Voir l&apos;agenda
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
