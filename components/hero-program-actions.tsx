"use client";

import { useState } from "react";
import type { Artist } from "@/config/event";
import { artists } from "@/config/event";

function scrollToAgenda() {
  const agenda = document.getElementById("agenda");
  if (agenda) {
    agenda.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  document
    .getElementById("location-section")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroProgramActions() {
  const [randomPick, setRandomPick] = useState<Artist | null>(null);

  function handleCreateProgram() {
    setRandomPick(null);
    scrollToAgenda();
  }

  function handleRandomPick() {
    const artist = artists[Math.floor(Math.random() * artists.length)];
    setRandomPick(artist);
  }

  function handleGoToPick() {
    scrollToAgenda();
  }

  return (
    <div className="pointer-events-auto flex w-full flex-col items-start gap-2.5">
        <button
          type="button"
          onClick={handleCreateProgram}
          className="flex w-full items-center justify-between rounded-full border-2 border-brand-black bg-brand-yellow px-4 py-2 font-display text-xl leading-tight tracking-wide text-brand-black uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
        >
          <span>Créer mon programme</span>
          <span className="hero-btn-arrow" aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          onClick={handleRandomPick}
          className="flex w-full items-center justify-between rounded-full border-2 border-brand-yellow bg-brand-black px-4 py-2 font-display text-xl leading-tight tracking-wide text-brand-yellow uppercase transition-transform active:scale-[0.98]"
        >
          <span>Proposer un truc aléatoire</span>
          <span className="hero-btn-arrow" aria-hidden="true">→</span>
        </button>
        {randomPick ? (
          <div className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-brand-black bg-brand-yellow px-3 py-3 shadow-[3px_3px_0_0_#0a0a0a]">
            <div className="min-w-0 flex-1 text-left">
              <span className="font-display inline-block rounded-full bg-brand-black px-2 py-0.5 text-[0.65rem] tracking-[0.15em] text-brand-yellow uppercase">
                {randomPick.genre}
              </span>
              <p className="mt-1.5 font-display text-lg leading-none text-brand-black uppercase">
                {randomPick.name}
              </p>
              <p className="mt-1 text-xs uppercase text-brand-black/70">
                {randomPick.slot}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoToPick}
              className="shrink-0 rounded-full border-2 border-brand-black bg-brand-black px-3 py-2 font-display text-sm leading-none text-brand-yellow uppercase shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
            >
              Y aller
            </button>
          </div>
        ) : null}
    </div>
  );
}
