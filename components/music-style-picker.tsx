"use client";

import { useEffect, useId, useState } from "react";
import { BottomSheetPortal } from "@/components/bottom-sheet-portal";
import { useBodyScrollLock } from "@/components/use-body-scroll-lock";
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

type MusicStylePickerProps = {
  styles: readonly string[];
  value: string | null;
  onChange: (style: string | null) => void;
};

export function MusicStylePicker({
  styles,
  value,
  onChange,
}: MusicStylePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const { isMounted, isVisible } = useModalTransition(isOpen);
  const visibleStyles = styles.filter((style) => style.trim().length > 0);
  const isFiltered = value !== null;

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

  function selectStyle(style: string | null) {
    onChange(style);
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
        Filtre
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
                    Filtrer par style
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
                    aria-label="Fermer le filtre"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="max-h-[50dvh] overflow-y-auto p-4">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <button
                        type="button"
                        onClick={() => selectStyle(null)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left font-display text-lg uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                          value === null
                            ? "border-brand-black bg-brand-black text-brand-yellow"
                            : "border-brand-black bg-white text-brand-black"
                        }`}
                      >
                        <span>Tous</span>
                        {value === null ? (
                          <span className="shrink-0 rounded-full bg-brand-yellow px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-black">
                            Actif
                          </span>
                        ) : null}
                      </button>
                    </li>

                    {visibleStyles.map((style) => {
                      const isActive = value === style;

                      return (
                        <li key={style}>
                          <button
                            type="button"
                            onClick={() => selectStyle(style)}
                            className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left font-display text-lg uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98] ${
                              isActive
                                ? "border-brand-black bg-brand-black text-brand-yellow"
                                : "border-brand-black bg-white text-brand-black"
                            }`}
                          >
                            <span>{style}</span>
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
                </div>
              </div>
            </div>
          </div>
        </BottomSheetPortal>
      ) : null}
    </>
  );
}
