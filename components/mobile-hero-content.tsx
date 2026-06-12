import Image from "next/image";
import { HeroProgramActions } from "@/components/hero-program-actions";
import { HeroCountdown } from "@/components/hero-countdown";

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
                quality={50}
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
            fill
            quality={55}
            sizes="100vw"
            className="h-full w-full object-fill"
          />
        </div>

        {/* UI : chrono + bouton, centré */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div
            id="hero-ui-content"
            className="pointer-events-auto flex w-full max-w-[19rem] flex-col items-center gap-6"
          >
            <HeroCountdown />
            <HeroProgramActions />
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
