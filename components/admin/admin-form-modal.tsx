"use client";

import { useEffect, useId } from "react";
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

type AdminFormModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const adminFieldClassName =
  "w-full rounded-2xl border-2 border-brand-black bg-white px-3 py-3 font-display text-base uppercase text-brand-black shadow-[3px_3px_0_0_#0a0a0a] outline-none placeholder:text-brand-black/40 focus:ring-2 focus:ring-brand-black/20";

export function AdminFormModal({
  isOpen,
  title,
  onClose,
  children,
  footer,
}: AdminFormModalProps) {
  const titleId = useId();
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

  if (!isMounted) return null;

  return (
    <BottomSheetPortal>
      <div
        className={`fixed inset-0 z-40 bg-brand-black/55 transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={false}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center"
      >
        <div
          className={`pointer-events-auto w-full max-w-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "translate-y-0 md:scale-100"
              : "translate-y-full md:translate-y-0 md:scale-95"
          }`}
        >
          <div className="flex max-h-[min(90dvh,40rem)] flex-col overflow-hidden rounded-3xl border-2 border-brand-black bg-brand-yellow shadow-[8px_8px_0_0_#0a0a0a]">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-brand-black bg-brand-black px-5 py-4 text-brand-yellow">
              <h2
                id={titleId}
                className="font-display text-2xl leading-none uppercase"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow transition-transform active:scale-95"
                aria-label="Fermer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto p-4 text-brand-black [color-scheme:light]">
              {children}
            </div>

            {footer ? (
              <div className="shrink-0 border-t-2 border-brand-black/10 p-4 text-brand-black [color-scheme:light]">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}

export function AdminModalPlusButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-black bg-white font-display text-2xl leading-none text-brand-black shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
    >
      +
    </button>
  );
}
