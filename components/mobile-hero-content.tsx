import Image from "next/image";
import { HeroProgramActions } from "@/components/hero-program-actions";
import { HeroCountdown } from "@/components/hero-countdown";

const heroLayerClassName =
  "mobile-hero-height pointer-events-none fixed top-[var(--mobile-header-height)] right-0 left-0 md:hidden";

export function MobileHeroContent() {
  return (
    <>
      {/* Enfant direct de #hero-root — z-index vs immeubles latéraux (display: contents) */}
      <div id="hero-root" className="contents md:contents">
        {/* 3. Visuel central */}
        <div className={`${heroLayerClassName} z-[3]`} aria-hidden="true">
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
        </div>

        {/* 5. Contour */}
        <div className={`${heroLayerClassName} z-[5]`} aria-hidden="true">
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
        </div>

        {/* 6. Chrono + bouton */}
        <div className={`${heroLayerClassName} z-[6]`}>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div
              id="hero-ui-content"
              className="pointer-events-auto flex w-full max-w-[19rem] translate-y-[25px] flex-col items-center gap-6"
            >
              <HeroCountdown />
              <HeroProgramActions />
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
