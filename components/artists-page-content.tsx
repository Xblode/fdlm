"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cities, defaultCityId } from "@/config/cities";
import { FeaturedArtistCard } from "@/components/featured-carousel";
import { ChevronIcon } from "@/components/chevron-icon";
import { MusicStylePicker } from "@/components/music-style-picker";
import { TimeSlotPicker } from "@/components/time-slot-picker";
import { MobileFooter } from "@/components/mobile-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { useSiteData } from "@/components/site-data-provider";
import { buildListPageParams } from "@/lib/utils/list-page-params";
import { musicStylesMatch } from "@/lib/utils/music-style";
import {
  collectDisplayTimes,
  compareDisplayTimes,
  matchesTimeFilter,
  parseTimeFilterFromSearchParams,
} from "@/lib/utils/time-filter";
import type { TimeFilter } from "@/lib/utils/time-filter";

const ARTISTS_PER_PAGE = 12;

type ArtistPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function ArtistPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ArtistPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination des artistes"
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

function pickCityId(cityParam: string | null, availableCityIds: string[]) {
  if (cityParam && availableCityIds.includes(cityParam)) {
    return cityParam;
  }

  if (availableCityIds.includes(defaultCityId)) {
    return defaultCityId;
  }

  return availableCityIds[0] ?? defaultCityId;
}

export function ArtistsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { venues, artists, availableCityIds, musicFilterStyles } = useSiteData();
  const selectedCityId = pickCityId(searchParams.get("ville"), availableCityIds);
  const styleParam = searchParams.get("style");
  const selectedStyle = useMemo(() => {
    if (!styleParam) return null;
    return (
      musicFilterStyles.find((style) => musicStylesMatch(style, styleParam)) ??
      null
    );
  }, [musicFilterStyles, styleParam]);
  const timeFilter = parseTimeFilterFromSearchParams(
    searchParams.get("de"),
    searchParams.get("a"),
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [selectedCityId, selectedStyle, timeFilter?.from, timeFilter?.to]);

  const pickerCities = useMemo(
    () =>
      cities.map((city) => ({
        ...city,
        available: availableCityIds.includes(city.id),
      })),
    [availableCityIds],
  );

  const cityVenueIds = useMemo(
    () =>
      new Set(
        venues
          .filter((venue) => venue.cityId === selectedCityId)
          .map((venue) => venue.id),
      ),
    [selectedCityId, venues],
  );

  const availableHours = useMemo(() => {
    const values: string[] = [];

    for (const artist of artists) {
      if (!cityVenueIds.has(artist.venueId)) continue;
      values.push(artist.slot, artist.slotEnd);
    }

    return collectDisplayTimes(values);
  }, [artists, cityVenueIds]);

  const cityArtists = useMemo(() => {
    return artists
      .filter((artist) => {
        if (!cityVenueIds.has(artist.venueId)) return false;
        if (selectedStyle && !musicStylesMatch(artist.genre, selectedStyle)) {
          return false;
        }
        return matchesTimeFilter(artist.slot, artist.slotEnd, timeFilter);
      })
      .sort((a, b) => compareDisplayTimes(a.slot, b.slot));
  }, [artists, cityVenueIds, selectedStyle, timeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(cityArtists.length / ARTISTS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * ARTISTS_PER_PAGE;
    return cityArtists.slice(start, start + ARTISTS_PER_PAGE);
  }, [cityArtists, currentPage]);

  function getVenueName(venueId: string) {
    return venues.find((venue) => venue.id === venueId)?.name ?? venueId;
  }

  function pushWithParams(
    nextCityId: string,
    nextStyle: string | null,
    nextTimeFilter: TimeFilter | null,
  ) {
    const params = buildListPageParams(nextCityId, nextStyle, nextTimeFilter);
    router.push(`/artistes?${params.toString()}`);
  }

  function handleCityChange(cityId: string) {
    setPage(1);
    pushWithParams(cityId, selectedStyle, timeFilter);
  }

  function handleStyleChange(style: string | null) {
    setPage(1);
    pushWithParams(selectedCityId, style, timeFilter);
  }

  function handleTimeChange(nextTimeFilter: TimeFilter | null) {
    setPage(1);
    pushWithParams(selectedCityId, selectedStyle, nextTimeFilter);
  }

  function goToPage(nextPage: number) {
    setPage(nextPage);

    requestAnimationFrame(() => {
      document
        .getElementById("artists-page-list")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <section
        id="artists-page"
        className="scroll-mt-[var(--mobile-header-height)] bg-brand-yellow px-4 pt-6 pb-10 text-brand-black"
      >
        <div
          id="artists-page-list"
          className="mb-5 flex scroll-mt-[var(--mobile-header-height)] items-center justify-between gap-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/1x/Fichier 2.webp"
              alt=""
              width={44}
              height={49}
              className="h-5 w-auto shrink-0 object-contain"
              aria-hidden
            />
            <h1 className="font-display text-3xl leading-none uppercase">
              Artistes
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <TimeSlotPicker
              hours={availableHours}
              value={timeFilter}
              onChange={handleTimeChange}
            />
            <MusicStylePicker
              styles={musicFilterStyles}
              value={selectedStyle}
              onChange={handleStyleChange}
            />
          </div>
        </div>

        {paginatedArtists.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {paginatedArtists.map((artist) => (
                <FeaturedArtistCard
                  key={artist.id}
                  artist={artist}
                  venueName={getVenueName(artist.venueId)}
                />
              ))}
            </div>
            <ArtistPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-brand-black bg-white px-4 py-8 text-center font-display text-xl uppercase">
            Aucun résultat
          </p>
        )}
      </section>

      <MobileFooter
        selectedCityId={selectedCityId}
        onCityChange={handleCityChange}
        cities={pickerCities}
      />
      <ScrollToTopButton />
    </main>
  );
}
