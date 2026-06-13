"use client";

import { useEffect, useId, useState } from "react";
import {
  rdrContent,
} from "@/config/prevention";
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

export function RdrPrintSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={titleId}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-brand-yellow bg-brand-black px-5 text-center font-display text-lg tracking-wide text-brand-yellow uppercase shadow-[4px_4px_0_0_#ffdf24] transition-transform active:scale-[0.98]"
      >
        {rdrContent.resourcesLabel}
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
                    {rdrContent.resourcesLabel}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
                    aria-label="Fermer"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="max-h-[65dvh] overflow-y-auto p-4">
                  <div className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[3px_3px_0_0_#0a0a0a]">
                    <p className="font-display text-sm uppercase text-brand-black">
                      Conseils d&apos;impression
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brand-black/80">
                      {rdrContent.printingTips.map((tip) => (
                        <li key={tip} className="flex gap-2">
                          <span aria-hidden="true">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={rdrContent.printBundleFile}
                    download={rdrContent.printBundleDownloadName}
                    className="mt-4 flex w-full items-center justify-center rounded-full border-2 border-brand-black bg-brand-black px-4 py-3.5 text-center font-display text-lg uppercase text-brand-yellow shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
                  >
                    {rdrContent.printBundleLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </BottomSheetPortal>
      ) : null}
    </>
  );
}
