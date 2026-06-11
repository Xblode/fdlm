"use client";

import { useState } from "react";

type Poster = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  textColor: string;
  rotation: number;
};

const POSTERS: Poster[] = [
  {
    id: "p1",
    title: "Hydratez-vous",
    subtitle: "L'eau est gratuite au bar.",
    color: "bg-[#0088bb]", // Blue
    textColor: "text-white",
    rotation: -4,
  },
  {
    id: "p2",
    title: "Protégez vos oreilles",
    subtitle: "Bouchons d'oreilles disponibles.",
    color: "bg-[#ffdf24]", // Yellow
    textColor: "text-brand-black",
    rotation: 2,
  },
  {
    id: "p3",
    title: "Faites des pauses",
    subtitle: "Prenez l'air de temps en temps.",
    color: "bg-[#e53935]", // Red
    textColor: "text-white",
    rotation: -2,
  },
  {
    id: "p4",
    title: "Veillez ensemble",
    subtitle: "Alertez le staff en cas de souci.",
    color: "bg-[#43a047]", // Green
    textColor: "text-white",
    rotation: 5,
  },
];

export function RdrSection() {
  const [order, setOrder] = useState<string[]>(POSTERS.map((p) => p.id));

  function nextPoster() {
    setOrder((current) => {
      const next = [...current];
      const top = next.shift();
      if (top) next.push(top);
      return next;
    });
  }

  return (
    <section className="relative overflow-hidden bg-brand-black px-6 py-16 text-brand-yellow">
      {/* Texture de fond si nécessaire, ou on garde propre */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center">
          <p className="font-display text-sm tracking-[0.2em] uppercase text-brand-yellow/70">
            Prévention / RDR
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none uppercase">
            Faites tourner le message
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-brand-yellow/80">
            Nous avons préparé une série d&apos;affiches de réduction des risques (RDR). 
            Touchez les cartes pour les faire défiler.
          </p>
        </div>

        {/* Deck of cards */}
        <div 
          className="relative mt-12 mb-8 h-[360px] w-full max-w-[280px]"
          onClick={nextPoster}
        >
          {POSTERS.map((poster) => {
            const indexInStack = order.indexOf(poster.id);
            const isTop = indexInStack === 0;
            
            // Calculer les positions en fonction de l'ordre
            // index 0: devant, scale 1, translateY 0
            // index 1: derriere, scale 0.95, translateY 20px
            // index 2: encore derriere, scale 0.90, translateY 40px
            const translateY = indexInStack * 15;
            const scale = 1 - indexInStack * 0.04;
            const zIndex = POSTERS.length - indexInStack;
            const opacity = indexInStack < 3 ? 1 : 0; // On en affiche 3 max

            return (
              <div
                key={poster.id}
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-4 border-brand-black p-6 shadow-[4px_4px_0_0_#0a0a0a] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${poster.color} ${poster.textColor}`}
                style={{
                  zIndex,
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale}) rotate(${
                    isTop ? 0 : poster.rotation
                  }deg)`,
                  transformOrigin: "bottom center",
                  pointerEvents: isTop ? "auto" : "none",
                }}
              >
                {/* On pourrait mettre un composant Image ici pour les vraies affiches */}
                <div className="flex h-full w-full flex-col items-center justify-center text-center">
                  <span className="mb-4 text-6xl opacity-80 mix-blend-overlay">
                    {/* Placeholder icon/shape */}
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 22h20L12 2zm0 3.8L18.4 19H5.6L12 5.8zm-1 4.2v5h2v-5h-2zm0 6v2h2v-2h-2z"/>
                    </svg>
                  </span>
                  <h3 className="font-display text-3xl uppercase leading-none">
                    {poster.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium opacity-90">
                    {poster.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            // Action de commande d'affiches
            window.location.href = "mailto:contact@fetedelamusique.fr?subject=Commande d'affiches RDR";
          }}
          className="mt-6 rounded-full bg-brand-yellow px-8 py-4 font-display text-xl uppercase leading-none text-brand-black shadow-[4px_4px_0_0_rgba(255,223,36,0.4)] transition-transform active:scale-95"
        >
          Commander ces affiches
        </button>
        <p className="mt-4 text-center text-xs text-brand-yellow/60">
          Pour afficher dans votre lieu
        </p>
      </div>
    </section>
  );
}
