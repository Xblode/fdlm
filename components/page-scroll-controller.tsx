"use client";

import { useEffect } from "react";

const HERO_VISUEL_MAX_X = 6;
const HERO_VISUEL_MAX_Y = -2.5;
const HERO_UI_CONTENT_LAG = 0.55;
const HERO_UI_CONTENT_DELAY_RATIO = 0.12;
const HERO_UI_CONTENT_MAX_RATIO = 0.45;

function getScrollY() {
  return (
    document.scrollingElement?.scrollTop ??
    window.scrollY ??
    document.documentElement.scrollTop ??
    0
  );
}

function setHeroActive(
  hero: HTMLElement,
  heroUi: HTMLElement | null,
  heroFrame: HTMLElement | null,
  active: boolean,
) {
  hero.classList.toggle("hero-inactive", !active);
  heroUi?.classList.toggle("hero-inactive", !active);
  heroFrame?.classList.toggle("hero-inactive", !active);
}

export function PageScrollController() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");
    const heroUi = document.getElementById("hero-ui");
    const heroFrame = document.getElementById("hero-frame");
    const heroUiContent = document.getElementById("hero-ui-content");
    const heroSpacer = document.getElementById("hero-spacer");

    let raf = 0;
    let lastScrollY = -1;
    let isPageVisible = !document.hidden;

    const applyScroll = (scrollY: number) => {
      root.style.setProperty("--page-scroll-y", `${scrollY}px`);

      if (!hero || !heroSpacer) return;

      const height = heroSpacer.offsetHeight || 1;
      const pastHero = scrollY >= height - 8;

      setHeroActive(hero, heroUi, heroFrame, !pastHero);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        hero.style.setProperty("--hero-visuel-x", "0%");
        hero.style.setProperty("--hero-visuel-y", "0%");
        heroUiContent?.style.setProperty("--hero-ui-content-y", "0px");
        return;
      }

      const progress = Math.min(Math.max(scrollY / height, 0), 1);
      hero.style.setProperty(
        "--hero-visuel-x",
        `${progress * HERO_VISUEL_MAX_X}%`,
      );
      hero.style.setProperty(
        "--hero-visuel-y",
        `${progress * HERO_VISUEL_MAX_Y}%`,
      );

      const delayedScroll = Math.max(
        0,
        scrollY - height * HERO_UI_CONTENT_DELAY_RATIO,
      );
      const contentOffset = Math.min(
        delayedScroll * HERO_UI_CONTENT_LAG,
        height * HERO_UI_CONTENT_MAX_RATIO,
      );
      heroUiContent?.style.setProperty(
        "--hero-ui-content-y",
        `${contentOffset}px`,
      );
    };

    const syncScroll = () => {
      const scrollY = getScrollY();

      if (scrollY !== lastScrollY) {
        lastScrollY = scrollY;
        applyScroll(scrollY);
      }
    };

    const tick = () => {
      if (isPageVisible) {
        syncScroll();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;

      if (isPageVisible) {
        lastScrollY = -1;
        applyScroll(getScrollY());
      }
    };

    const onOrientationChange = () => {
      window.setTimeout(() => {
        lastScrollY = -1;
        applyScroll(getScrollY());
      }, 150);
    };

    applyScroll(getScrollY());
    raf = requestAnimationFrame(tick);

    window.addEventListener("scroll", syncScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", syncScroll, { passive: true });
    window.addEventListener("orientationchange", onOrientationChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncScroll, { capture: true });
      window.removeEventListener("touchmove", syncScroll);
      window.removeEventListener("orientationchange", onOrientationChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.style.removeProperty("--page-scroll-y");
      hero?.classList.remove("hero-inactive");
      heroUi?.classList.remove("hero-inactive");
      heroFrame?.classList.remove("hero-inactive");
      hero?.style.removeProperty("--hero-visuel-x");
      hero?.style.removeProperty("--hero-visuel-y");
      heroUiContent?.style.removeProperty("--hero-ui-content-y");
    };
  }, []);

  return null;
}
