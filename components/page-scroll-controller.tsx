"use client";

import { useEffect } from "react";

const HERO_VISUEL_MAX_X = 6;
const HERO_VISUEL_MAX_Y = -2.5;
const SNAP_THRESHOLD = 0.38;
const SNAP_VEL_MIN = 0.12;

export function PageScrollController() {
  useEffect(() => {
    const root = document.documentElement;
    const heroRoot = document.getElementById("hero-root");
    const spacer = document.getElementById("hero-spacer");

    if (!heroRoot || !spacer) return;

    // ── Masquer le hero quand le spacer sort du viewport ──────────────────
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        heroRoot.classList.toggle("hero-inactive", !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(spacer);

    // ── Parallaxe visuel (CSS var mise à jour au scroll) ──────────────────
    const onScroll = () => {
      const scrollY = window.scrollY;
      root.style.setProperty("--page-scroll-y", `${scrollY}px`);

      const height = spacer.offsetHeight || 1;
      const progress = Math.min(Math.max(scrollY / height, 0), 1);
      heroRoot.style.setProperty(
        "--hero-visuel-x",
        `${progress * HERO_VISUEL_MAX_X}%`,
      );
      heroRoot.style.setProperty(
        "--hero-visuel-y",
        `${progress * HERO_VISUEL_MAX_Y}%`,
      );
    };

    // ── Snap au touchend ──────────────────────────────────────────────────
    let isSnapping = false;
    let velY = 0;
    let prevClientY = 0;
    let prevTime = 0;

    const snapTo = (target: number) => {
      if (isSnapping) return;
      isSnapping = true;
      window.scrollTo({ top: target, behavior: "smooth" });
      window.setTimeout(() => {
        isSnapping = false;
      }, 700);
    };

    const onTouchStart = (e: TouchEvent) => {
      isSnapping = false;
      const t = e.touches[0];
      if (t) {
        prevClientY = t.clientY;
        prevTime = Date.now();
        velY = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const dt = Date.now() - prevTime;
      if (dt > 0) velY = (prevClientY - t.clientY) / dt;
      prevClientY = t.clientY;
      prevTime = Date.now();
    };

    const onTouchEnd = () => {
      if (isSnapping || !spacer) return;
      const scrollY = window.scrollY;
      const height = spacer.offsetHeight || 1;
      if (scrollY <= 2 || scrollY >= height - 2) return;

      const predicted = Math.min(
        1,
        Math.max(0, (scrollY + velY * 250) / height),
      );
      let goDown: boolean;
      if (velY > SNAP_VEL_MIN) goDown = true;
      else if (velY < -SNAP_VEL_MIN) goDown = false;
      else goDown = predicted >= SNAP_THRESHOLD;

      snapTo(goDown ? height : 0);
    };

    // ── Réorientation et visibilité ───────────────────────────────────────
    const onOrientationChange = () => {
      window.setTimeout(onScroll, 150);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("orientationchange", onOrientationChange);
      root.style.removeProperty("--page-scroll-y");
      heroRoot.classList.remove("hero-inactive");
      heroRoot.style.removeProperty("--hero-visuel-x");
      heroRoot.style.removeProperty("--hero-visuel-y");
    };
  }, []);

  return null;
}
