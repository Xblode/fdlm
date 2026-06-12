"use client";

import { useEffect, useId, useState } from "react";
import { BottomSheetPortal } from "@/components/bottom-sheet-portal";
import type { City } from "@/config/cities";
import { cities as defaultCities, getCityById } from "@/config/cities";
import { useBodyScrollLock } from "@/components/use-body-scroll-lock";
import { ChevronIcon } from "@/components/chevron-icon";
import { useModalTransition } from "@/components/use-modal-transition";

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

type CityPickerProps = {
  cities?: City[];
  value: string;
  onChange: (cityId: string) => void;
};

export function CityPicker({
  cities = defaultCities,
  value,
  onChange,
}: CityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const selectedCity = getCityById(value);
  const { isMounted, isVisible } = useModalTransition(isOpen);

  useBodyScrollLock(isMounted);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectCity(cityId: string) {
    const city = cities.find((item) => item.id === cityId);
    if (!city?.available) return;

    onChange(cityId);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={titleId}
        className="mt-6 flex h-12 w-full items-center gap-3 rounded-full border-2 border-brand-yellow px-4 text-left shadow-[3px_3px_0_0_#ffdf24] transition-transform active:scale-[0.98]"
      >
        <span className="min-w-0 flex-1 truncate font-display text-xl leading-none uppercase text-brand-yellow">
          {selectedCity.name}
        </span>

        <ChevronIcon direction="down" className="size-5 shrink-0" />
      </button>

      {isMounted ? (
        <BottomSheetPortal>
          <div
            className={`fixed inset-x-0 bottom-0 top-[var(--mobile-header-height)] z-40 bg-brand-black/55 transition-opacity duration-300 ease-out md:hidden ${
              isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsOpen(false)}
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
              <div className="overflow-hidden rounded-3xl border-2 border-brand-black bg-brand-yellow shadow-[8px_8px_0_0_#0a0a0a]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-brand-black bg-brand-black px-5 py-4 text-brand-yellow">
              <h2 id={titleId} className="font-display text-2xl leading-none uppercase">
                Choisir une ville
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
                aria-label="Fermer le sélecteur de ville"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="max-h-[50dvh] overflow-y-auto p-4">
              <ul className="flex flex-col gap-2">
                {cities.map((city) => {
                  const isAvailable = city.available === true;

                  return (
                    <li key={city.id}>
                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => selectCity(city.id)}
                        aria-disabled={!isAvailable}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left font-display text-lg uppercase ${
                          isAvailable
                            ? "border-brand-black bg-white text-brand-black shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
                            : "cursor-not-allowed border-brand-black/15 bg-brand-black/5 text-brand-black/35 shadow-none"
                        }`}
                      >
                        <span className={isAvailable ? "" : "opacity-80"}>
                          {city.name}
                        </span>
                        {isAvailable ? (
                          <span className="shrink-0 rounded-full bg-brand-black px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-yellow">
                            Actif
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-brand-black/10 px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-black/45">
                            Non disponible
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
              </div>
            </div>
          </div>
        </BottomSheetPortal>
      ) : null}
    </>
  );
}
