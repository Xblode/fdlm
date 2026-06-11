import Image from "next/image";
import { eventInfo } from "@/config/event";
import { HeroProgramActions } from "@/components/hero-program-actions";

export function MobileHeroContent() {
  return (
    <>
      <div
        id="hero-root"
        className="mobile-hero-height pointer-events-none fixed top-[var(--mobile-header-height)] right-0 left-0 z-[5] md:hidden"
        aria-hidden="true"
      >
        {/* Visuel parallaxe — overflow clippé localement */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-visuel-drift absolute -inset-[9%]">
            <div className="hero-visuel-float relative h-full w-full">
              <Image
                src="/visuel 1.webp"
                alt=""
                priority
                fill
                sizes="100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Calque graphique (contenu 2) */}
        <div className="absolute inset-0">
          <Image
            src="/contenu 2.webp"
            alt=""
            priority
            fill
            sizes="100vw"
            className="h-full w-full object-fill"
          />
        </div>

        {/* UI : boutons + date */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-start px-6 pb-14">
          <div
            id="hero-ui-content"
            className="pointer-events-auto flex w-full max-w-[19rem] flex-col items-start gap-6"
          >
            <HeroProgramActions />
            <div
              className="inline-grid shrink-0 text-brand-yellow drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
              aria-hidden="false"
            >
              <p className="w-full text-left font-display text-[4.875rem] leading-[0.85] uppercase">
                {eventInfo.dateShort}
              </p>
              <p className="-mt-2 w-full text-left font-year text-8xl leading-[0.85] uppercase tracking-tight">
                2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="hero-spacer"
        className="mobile-hero-height shrink-0 md:hidden"
        aria-hidden="true"
      />
    </>
  );
}
