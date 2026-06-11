"use client";

import { useEffect } from "react";

const HERO_VISUEL_MAX_X = 6;
const HERO_VISUEL_MAX_Y = -2.5;

// Fraction of hero height at which the snap commits (38 % = seuil d'ancrage)
const SNAP_THRESHOLD = 0.38;
// Minimum swipe velocity (px/ms) to override position-based decision
const SNAP_VEL_MIN = 0.12;

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
    const heroSpacer = document.getElementById("hero-spacer");

    let raf = 0;
    let lastScrollY = -1;
    let isPageVisible = !document.hidden;

    // ── Snap state ──────────────────────────────────────────────────────────
    let isSnapping = false;
    let touchVelocityY = 0; // px/ms, positive = scrolling down
    let prevTouchClientY = 0;
    let prevTouchTime = 0;

    const snapTo = (targetY: number) => {
      if (isSnapping) return;
      isSnapping = true;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      window.setTimeout(() => {
        isSnapping = false;
      }, 700);
    };

    const evaluateSnap = () => {
      if (isSnapping || !heroSpacer) return;
      const scrollY = getScrollY();
      const height = heroSpacer.offsetHeight || 1;

      // Only act when in the transition zone
      if (scrollY <= 2 || scrollY >= height - 2) return;

      const vel = touchVelocityY;
      // Predict where momentum will carry the scroll (rough 250 ms estimate)
      const predictedProgress = Math.max(
        0,
        Math.min(1, (scrollY + vel * 250) / height),
      );

      let goDown: boolean;
      if (vel > SNAP_VEL_MIN) {
        goDown = true; // fast swipe down → snap to content
      } else if (vel < -SNAP_VEL_MIN) {
        goDown = false; // fast swipe up → snap to top
      } else {
        goDown = predictedProgress >= SNAP_THRESHOLD;
      }

      snapTo(goDown ? height : 0);
    };

    const onTouchStart = (e: TouchEvent) => {
      // Allow user to interrupt an in-progress snap
      isSnapping = false;
      const t = e.touches[0];
      if (t) {
        prevTouchClientY = t.clientY;
        prevTouchTime = Date.now();
        touchVelocityY = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      syncScroll();
      const t = e.touches[0];
      if (!t) return;
      const now = Date.now();
      const dt = now - prevTouchTime;
      if (dt > 0) {
        touchVelocityY = (prevTouchClientY - t.clientY) / dt;
      }
      prevTouchClientY = t.clientY;
      prevTouchTime = now;
    };

    const onTouchEnd = () => {
      evaluateSnap();
    };
    // ────────────────────────────────────────────────────────────────────────

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
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("orientationchange", onOrientationChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", syncScroll, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("orientationchange", onOrientationChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.style.removeProperty("--page-scroll-y");
      hero?.classList.remove("hero-inactive");
      heroUi?.classList.remove("hero-inactive");
      heroFrame?.classList.remove("hero-inactive");
      hero?.style.removeProperty("--hero-visuel-x");
      hero?.style.removeProperty("--hero-visuel-y");
    };
  }, []);

  return null;
}
