"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { BottomSheetPortal } from "@/components/bottom-sheet-portal";
import { useBodyScrollLock } from "@/components/use-body-scroll-lock";
import { useModalTransition } from "@/components/use-modal-transition";

const VISIT_COUNT_KEY = "fdlm-visit-count";
const DISMISS_KEY = "fdlm-install-prompt-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

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

function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true)
  );
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const titleId = useId();
  const isIos = isIosDevice();
  const { isMounted, isVisible } = useModalTransition(isOpen);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, "1");
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (isStandaloneMode()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const visitCount = Number(localStorage.getItem(VISIT_COUNT_KEY) ?? "0") + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(visitCount));

    if (visitCount >= 2) {
      void Promise.resolve().then(() => setIsOpen(true));
    }
  }, []);

  useBodyScrollLock(isMounted);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dismiss]);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  async function handleAddApp() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        dismiss();
      }

      setDeferredPrompt(null);
      return;
    }

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Fête de la musique 2026",
          text: "Agenda, lieux et artistes",
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }

      return;
    }
  }

  if (!isMounted) return null;

  return (
    <BottomSheetPortal>
      <div
        className={`fixed inset-x-0 bottom-0 top-[var(--mobile-header-height)] z-40 bg-brand-black/55 transition-opacity duration-300 ease-out md:hidden ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={dismiss}
        aria-hidden={false}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pointer-events-none fixed inset-x-0 bottom-0 top-[var(--mobile-header-height)] z-50 flex items-center justify-center px-4 md:hidden"
      >
        <div
          className={`pointer-events-auto w-full max-w-[min(88vw,20rem)] origin-center rotate-[-2deg] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-3xl border-2 border-brand-black bg-brand-yellow shadow-[8px_8px_0_0_#0a0a0a]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-brand-black bg-brand-black px-5 py-4 text-brand-yellow">
              <h2 id={titleId} className="font-display text-2xl leading-none uppercase">
                Ajouter l&apos;app
              </h2>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
                aria-label="Fermer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4 p-5 text-brand-black">
              <p className="text-sm leading-relaxed text-brand-black/75">
                Installe le site sur ton écran d&apos;accueil pour y accéder
                comme à une application.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleAddApp}
                  className="w-full rounded-full border-2 border-brand-black bg-brand-black px-4 py-3 font-display text-base uppercase text-brand-yellow shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
                >
                  Ajouter l&apos;application
                </button>

                {isIos ? (
                  <p className="text-center text-xs leading-relaxed text-brand-black/60">
                    Le menu de partage s&apos;ouvrira — choisis « Sur
                    l&apos;écran d&apos;accueil ».
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full rounded-full border-2 border-brand-black bg-white px-4 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
