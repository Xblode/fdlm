"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { eventInfo } from "@/config/event";

function subscribe() {
  return () => {};
}

function PhoneIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2.5" />
    </svg>
  );
}

export function DesktopMobilePrompt() {
  const pageUrl = useSyncExternalStore(
    subscribe,
    () => window.location.href,
    () => "",
  );

  const qrSrc = pageUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pageUrl)}&bgcolor=0a0a0a&color=ffdf24&margin=12`
    : null;

  return (
    <div className="relative flex min-h-full w-full flex-1 flex-col overflow-hidden bg-brand-black text-brand-yellow">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent 0, transparent 38px, #ffdf24 38px, #ffdf24 41px)",
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 flex h-[var(--mobile-header-height)] shrink-0 items-center justify-center border-b-2 border-brand-black bg-brand-yellow px-8">
        <Image
          src="/logo.webp"
          alt="Fête de la musique"
          width={3354}
          height={784}
          priority
          className="h-10 w-auto max-w-[280px] object-contain brightness-0"
        />
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 py-12 text-center lg:flex-row lg:items-center lg:gap-16 lg:px-16 lg:text-left">
        <div className="flex max-w-md flex-col items-center lg:items-start">
          <div className="inline-grid text-brand-yellow drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            <p className="w-full text-center font-display text-5xl leading-none uppercase lg:text-left">
              {eventInfo.dateShort}
            </p>
            <p className="mt-1 w-full text-center font-year text-8xl leading-[0.85] uppercase tracking-tight lg:text-left">
              2026
            </p>
          </div>

          <div className="mt-8 w-full max-w-lg rounded-3xl border-2 border-brand-yellow bg-brand-black/90 p-8 shadow-[8px_8px_0_0_#ffdf24] backdrop-blur-sm">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow shadow-[3px_3px_0_0_#ffdf24] lg:mx-0">
              <PhoneIcon />
            </div>

            <p className="font-display text-xs tracking-[0.25em] uppercase text-brand-yellow/70">
              Expérience mobile
            </p>
            <h1 className="mt-2 font-display text-4xl leading-none uppercase lg:text-5xl">
              Ouvrez sur votre téléphone
            </h1>
            <p className="mt-4 text-base leading-relaxed text-brand-yellow/80">
              Cette application est conçue pour smartphone. Scannez le QR code
              ou copiez l&apos;adresse ci-contre pour y accéder dans les
              meilleures conditions.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="rounded-3xl border-2 border-brand-yellow bg-brand-black p-4 shadow-[6px_6px_0_0_#ffdf24]">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSrc}
                alt="QR code pour ouvrir le site sur mobile"
                width={200}
                height={200}
                className="size-[200px]"
              />
            ) : (
              <div className="flex size-[200px] items-center justify-center font-display text-sm uppercase text-brand-yellow/50">
                Chargement…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
