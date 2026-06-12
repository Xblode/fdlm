"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Venue } from "@/config/event";
import {
  artists,
  eventInfo,
  getArtistsForVenue,
  musicFilterStyles,
  venues,
} from "@/config/event";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { ChevronIcon } from "@/components/chevron-icon";
import { MusicStyleFilters } from "@/components/music-style-filters";
import { SearchBar } from "@/components/search-bar";
import { VenueCard } from "@/components/venue-card";
import { VenueCardMedia } from "@/components/venue-card-media";

const VENUES_PER_PAGE = 4;

type VenuePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function VenuePagination({
  currentPage,
  totalPages,
  onPageChange,
}: VenuePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination des lieux"
      className="mt-6 flex items-center justify-between gap-3"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Page précédente"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-black bg-white px-4 py-2 font-display text-sm uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        <ChevronIcon direction="left" />
        Préc.
      </button>

      <p className="font-display text-sm uppercase tabular-nums">
        {currentPage} / {totalPages}
      </p>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Page suivante"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-black bg-white px-4 py-2 font-display text-sm uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        Suiv.
        <ChevronIcon direction="right" />
      </button>
    </nav>
  );
}

function matchesSearch(query: string, values: string[]) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return values.some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

function VenueDetail({ venue }: { venue: Venue }) {
  const hours = `${venue.hoursStart.toLowerCase()} – ${venue.hoursEnd.toLowerCase()}`;
  const concertCount = getArtistsForVenue(venue.id).length;
  const concertLabel = concertCount <= 1 ? "concert" : "concerts";

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl shadow-[6px_6px_0_0_#0a0a0a]">
        <VenueCardMedia imageSrc={venue.cardImage} rounded="all" />
        <div className="relative z-10 flex min-h-[220px] flex-col justify-end gap-3 p-6">
          <p className="font-display w-fit rounded-full bg-brand-black px-3 py-1 text-xs tracking-[0.2em] text-brand-yellow uppercase">
            {venue.venueType}
          </p>
          <h3 className="font-display text-5xl leading-[0.9] text-brand-yellow uppercase">
            {venue.name}
          </h3>
          <p className="text-sm leading-relaxed text-brand-yellow/90">
            {venue.address}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-brand-black bg-brand-black p-4 text-brand-yellow shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]">
          <p className="font-display text-xs tracking-[0.2em] uppercase opacity-70">
            Concerts
          </p>
          <p className="mt-2 font-display text-2xl leading-none uppercase tabular-nums">
            {concertCount}
          </p>
          <p className="mt-1 text-xs uppercase opacity-70">{concertLabel}</p>
        </div>

        <div className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]">
          <p className="font-display text-xs tracking-[0.2em] uppercase opacity-60">
            Horaires
          </p>
          <p className="mt-2 font-display text-2xl leading-none uppercase">
            {hours}
          </p>
          <p className="mt-1 text-xs uppercase opacity-60">Accès libre</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {venue.musicStyles.map((style, index) => (
          <span
            key={style}
            className={`rounded-full border-2 border-brand-black px-3 py-1 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
              index % 2 === 0
                ? "bg-white text-brand-black"
                : "bg-brand-black text-brand-yellow"
            }`}
          >
            {style}
          </span>
        ))}
      </div>

      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 flex h-14 w-full items-center justify-between rounded-2xl border-2 border-brand-black bg-white px-5 font-display text-lg tracking-wide text-brand-black uppercase shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
      >
        <span>Y aller sur Maps</span>
        <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </a>
    </>
  );
}

export function LocationSection({
  selectedVenue,
  onSelectVenue,
  onCloseVenue,
  selectedCityId,
}: {
  selectedVenue: Venue | null;
  onSelectVenue: (venue: Venue) => void;
  onCloseVenue: () => void;
  selectedCityId: string;
}) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filterKey = `${selectedCityId}|${selectedStyle ?? ""}|${searchQuery}`;
  const [pageState, setPageState] = useState({ filterKey, page: 1 });

  if (pageState.filterKey !== filterKey) {
    setPageState({ filterKey, page: 1 });
  }

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesCity = venue.cityId === selectedCityId;

      const matchesStyle =
        !selectedStyle ||
        venue.musicStyles.some(
          (style) => style.toLowerCase() === selectedStyle.toLowerCase(),
        );

      const matchesQuery = matchesSearch(searchQuery, [
        venue.name,
        venue.venueType,
        venue.address,
        ...venue.musicStyles,
      ]);

      return matchesCity && matchesStyle && matchesQuery;
    });
  }, [selectedCityId, selectedStyle, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVenues.length / VENUES_PER_PAGE),
  );

  const currentPage = Math.min(pageState.page, totalPages);

  if (currentPage !== pageState.page) {
    setPageState({ filterKey, page: currentPage });
  }

  const paginatedVenues = useMemo(() => {
    const start = (currentPage - 1) * VENUES_PER_PAGE;
    return filteredVenues.slice(start, start + VENUES_PER_PAGE);
  }, [currentPage, filteredVenues]);

  const filteredArtists = useMemo(() => {
    const cityVenueIds = new Set(
      venues
        .filter((venue) => venue.cityId === selectedCityId)
        .map((venue) => venue.id),
    );

    return artists.filter((artist) => {
      if (!cityVenueIds.has(artist.venueId)) return false;

      const matchesStyle =
        !selectedStyle ||
        artist.genre.toLowerCase() === selectedStyle.toLowerCase();

      const matchesQuery = matchesSearch(searchQuery, [
        artist.name,
        artist.genre,
        artist.slot,
        eventInfo.venue,
      ]);

      return matchesStyle && matchesQuery;
    });
  }, [selectedCityId, selectedStyle, searchQuery]);

  function selectVenue(venue: Venue) {
    onSelectVenue(venue);
  }

  function closeVenue() {
    onCloseVenue();
  }

  useEffect(() => {
    if (!selectedVenue) return;

    requestAnimationFrame(() => {
      const section = document.getElementById("location-section");
      const header = document.querySelector(".mobile-app > header");
      if (!section || !header) return;

      const top =
        section.getBoundingClientRect().top +
        window.scrollY -
        header.getBoundingClientRect().height;

      // Scroll instantané : le smooth scroll + remontage du DOM lag sur mobile
      window.scrollTo({ top, behavior: "auto" });
    });
  }, [selectedVenue]);

  function goToPage(page: number) {
    setPageState({ filterKey, page });

    requestAnimationFrame(() => {
      document
        .getElementById("location-venues-list")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section
      id="location-section"
      className="scroll-mt-[var(--mobile-header-height)] rounded-tl-3xl bg-brand-yellow px-4 pt-6 pb-10 text-brand-black"
    >
      <div className="location-sticky-toolbar sticky top-[var(--mobile-header-height)] z-[15] -mx-4 bg-brand-yellow px-4 pb-2">
        {selectedVenue ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/1x/Fichier 4.webp"
                alt=""
                width={49}
                height={49}
                className="h-5 w-auto shrink-0 object-contain"
                aria-hidden
              />
              <h2 className="font-display text-3xl leading-none uppercase">
                Lieux
              </h2>
            </div>
            <button
              type="button"
              onClick={closeVenue}
              className="group inline-flex shrink-0 items-center gap-2 bg-transparent font-display text-lg tracking-wide text-brand-black uppercase"
            >
              Fermer
              <ChevronIcon direction="down" className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div
              id="location-search"
              className="scroll-mt-[var(--mobile-header-height)]"
            >
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <MusicStyleFilters
              styles={musicFilterStyles}
              selectedStyle={selectedStyle}
              onSelect={setSelectedStyle}
            />
          </>
        )}
      </div>

      {selectedVenue ? (
        <div id="venue-detail" className="pt-2">
          <VenueDetail venue={selectedVenue} />
        </div>
      ) : (
        <>
          <div className="mt-2">
            <FeaturedCarousel artists={filteredArtists} />
          </div>

          <div
            id="location-venues-list"
            className="mt-2 mb-5 flex scroll-mt-[calc(var(--mobile-header-height)+7rem)] items-center gap-3"
          >
            <Image
              src="/1x/Fichier 4.webp"
              alt=""
              width={49}
              height={49}
              className="h-5 w-auto shrink-0 object-contain"
              aria-hidden
            />
            <h2 className="font-display text-3xl leading-none uppercase">
              Lieux
            </h2>
          </div>

          {filteredVenues.length > 0 ? (
            <>
              <div className="flex flex-col gap-5">
                {paginatedVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onSelect={() => selectVenue(venue)}
                  />
                ))}
              </div>
              <VenuePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          ) : (
            <p className="rounded-2xl border-2 border-dashed border-brand-black/30 bg-white px-4 py-8 text-center font-display text-xl uppercase">
              Aucun résultat
            </p>
          )}
        </>
      )}
    </section>
  );
}
