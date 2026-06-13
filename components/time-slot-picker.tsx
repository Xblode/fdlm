"use client";

import { useEffect, useId, useState } from "react";
import { BottomSheetPortal } from "@/components/bottom-sheet-portal";
import { useBodyScrollLock } from "@/components/use-body-scroll-lock";
import { useModalTransition } from "@/components/use-modal-transition";
import type { TimeFilter } from "@/lib/utils/time-filter";

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

type TimeSlotPickerProps = {
  hours: readonly string[];
  value: TimeFilter | null;
  onChange: (value: TimeFilter | null) => void;
};

export function TimeSlotPicker({ hours, value, onChange }: TimeSlotPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState("");
  const titleId = useId();
  const { isMounted, isVisible } = useModalTransition(isOpen);
  const isFiltered = value !== null;

  useBodyScrollLock(isMounted);

  useEffect(() => {
    if (!isOpen) return;

    setDraftFrom(value?.from ?? hours[0] ?? "");
    setDraftTo(value?.to ?? "");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hours, isOpen, value]);

  function selectAll() {
    onChange(null);
    setIsOpen(false);
  }

  function selectHour(hour: string) {
    onChange({ from: hour, to: null });
    setIsOpen(false);
  }

  function applyCustomRange() {
    if (!draftFrom) return;

    onChange({
      from: draftFrom,
      to: draftTo && draftTo !== draftFrom ? draftTo : null,
    });
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
        className={`shrink-0 rounded-full border-2 border-brand-black px-3 py-1.5 font-display text-sm uppercase leading-none shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
          isFiltered
            ? "bg-brand-black text-brand-yellow"
            : "bg-white text-brand-black"
        }`}
      >
        Horaire
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
              className={`pointer-events-auto w-full max-w-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isVisible ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="overflow-hidden rounded-3xl border-2 border-brand-black bg-brand-yellow shadow-[8px_8px_0_0_#0a0a0a]">
                <div className="flex items-center justify-between gap-3 border-b-2 border-brand-black bg-brand-black px-5 py-4 text-brand-yellow">
                  <h2 id={titleId} className="font-display text-2xl leading-none uppercase">
                    Filtrer par horaire
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
                    aria-label="Fermer le filtre horaire"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="max-h-[60dvh] overflow-y-auto p-4">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <button
                        type="button"
                        onClick={selectAll}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left font-display text-lg uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                          value === null
                            ? "border-brand-black bg-brand-black text-brand-yellow"
                            : "border-brand-black bg-white text-brand-black"
                        }`}
                      >
                        <span>Toutes les heures</span>
                        {value === null ? (
                          <span className="shrink-0 rounded-full bg-brand-yellow px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-black">
                            Actif
                          </span>
                        ) : null}
                      </button>
                    </li>

                    {hours.map((hour) => {
                      const isActive =
                        value?.from === hour &&
                        (value.to === null || value.to === hour);

                      return (
                        <li key={hour}>
                          <button
                            type="button"
                            onClick={() => selectHour(hour)}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left font-display text-lg uppercase tabular-nums shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                              isActive
                                ? "border-brand-black bg-brand-black text-brand-yellow"
                                : "border-brand-black bg-white text-brand-black"
                            }`}
                          >
                            <span>{hour}</span>
                            {isActive ? (
                              <span className="shrink-0 rounded-full bg-brand-yellow px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-black">
                                Actif
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {hours.length > 0 ? (
                    <div className="mt-4 rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]">
                      <p className="font-display text-sm uppercase">
                        Tranche horaire
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase text-brand-black/70">
                            De
                          </span>
                          <select
                            value={draftFrom}
                            onChange={(event) => setDraftFrom(event.target.value)}
                            className="rounded-xl border-2 border-brand-black bg-brand-yellow px-3 py-2 font-display text-sm uppercase tabular-nums"
                          >
                            {hours.map((hour) => (
                              <option key={`from-${hour}`} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase text-brand-black/70">
                            À
                          </span>
                          <select
                            value={draftTo}
                            onChange={(event) => setDraftTo(event.target.value)}
                            className="rounded-xl border-2 border-brand-black bg-brand-yellow px-3 py-2 font-display text-sm uppercase tabular-nums"
                          >
                            <option value="">—</option>
                            {hours.map((hour) => (
                              <option key={`to-${hour}`} value={hour}>
                                {hour}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={applyCustomRange}
                        className="mt-3 w-full rounded-full border-2 border-brand-black bg-brand-black px-4 py-2.5 font-display text-sm uppercase text-brand-yellow shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
                      >
                        Appliquer la tranche
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </BottomSheetPortal>
      ) : null}
    </>
  );
}
