"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSiteData } from "@/components/site-data-provider";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { ChevronIcon } from "@/components/chevron-icon";
import { MusicStyleFilters } from "@/components/music-style-filters";
import { SearchBar } from "@/components/search-bar";
import { VenueCard } from "@/components/venue-card";

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

export function LocationSection({
  selectedCityId,
}: {
  selectedCityId: string;
}) {
  const { venues, artists, musicFilterStyles, eventInfo } = useSiteData();
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
  }, [selectedCityId, selectedStyle, searchQuery, venues]);

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
  }, [selectedCityId, selectedStyle, searchQuery, venues, artists, eventInfo]);

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
      </div>

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
        <h2 className="font-display text-3xl leading-none uppercase">Lieux</h2>
      </div>

      {filteredVenues.length > 0 ? (
        <>
          <div className="flex flex-col gap-5">
            {paginatedVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
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
    </section>
  );
}
