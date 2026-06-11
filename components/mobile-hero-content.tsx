import Image from "next/image";
import { eventInfo } from "@/config/event";
import { HeroProgramActions } from "@/components/hero-program-actions";
import { HeroVisuelScroll } from "@/components/hero-visuel-scroll";

export function MobileHeroContent() {
  return (
    <>
      <div
        id="hero"
        className="mobile-hero-height pointer-events-none fixed top-[var(--mobile-header-height)] right-0 left-0 z-[1] w-full overflow-hidden md:hidden"
      >
        <HeroVisuelScroll />
      </div>
      <div
        id="hero-spacer"
        className="mobile-hero-height shrink-0 md:hidden"
        aria-hidden="true"
      />
      <div
        id="hero-frame"
        className="mobile-hero-height pointer-events-none fixed top-[var(--mobile-header-height)] right-0 left-0 z-[3] md:hidden"
        aria-hidden="true"
      >
        <Image
          src="/contenu 2.png"
          alt="Fête de la musique — L'eau tarie, 21 juin 2026"
          priority
          fill
          sizes="100vw"
          className="h-full w-full object-fill"
        />
      </div>
      <div
        id="hero-ui"
        className="mobile-hero-height pointer-events-none fixed top-[var(--mobile-header-height)] right-0 left-0 z-[5] flex items-center justify-start px-6 md:hidden"
      >
        <div
          id="hero-ui-content"
          className="pointer-events-auto flex w-full max-w-[19rem] flex-col items-start gap-6"
        >
          <div className="inline-grid shrink-0 text-brand-yellow drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
            <p className="w-full text-left font-display text-[4.875rem] leading-[0.85] uppercase">
              {eventInfo.dateShort}
            </p>
            <p className="-mt-2 w-full text-left font-year text-8xl leading-[0.85] uppercase tracking-tight">
              2026
            </p>
          </div>
          <HeroProgramActions />
        </div>
      </div>
    </>
  );
}
