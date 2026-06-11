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

    const driftEl = heroRoot.querySelector<HTMLElement>(".hero-visuel-drift");

    // CSS scroll-driven animations handle parallax natively on modern browsers
    const useNativeScrollAnim = CSS.supports("animation-timeline: scroll()");

    // Cache spacer height — avoids layout thrashing on every scroll event
    let spacerHeight = spacer.offsetHeight || 1;

    // ── Visibility toggle via IntersectionObserver ──────────────────────
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        heroRoot.classList.toggle("hero-inactive", !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(spacer);

    // ── Parallax + edge parallax CSS var (fallback only) ─────────────────
    const onScroll = () => {
      const scrollY = window.scrollY;

      if (!useNativeScrollAnim) {
        // Edge parallax fallback (CSS scroll-driven handles it on modern browsers)
        root.style.setProperty("--page-scroll-y", `${scrollY}px`);

        // Hero visuel parallax: update transform directly — compositor-only,
        // avoids style recalculation that CSS vars would trigger
        if (driftEl) {
          const progress = Math.min(Math.max(scrollY / spacerHeight, 0), 1);
          driftEl.style.transform = `scale(0.9) translate3d(${progress * HERO_VISUEL_MAX_X}%, ${progress * HERO_VISUEL_MAX_Y}%, 0)`;
        }
      }
    };

    // ── Snap at touchend ──────────────────────────────────────────────────
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
      if (isSnapping) return;
      const scrollY = window.scrollY;
      if (scrollY <= 2 || scrollY >= spacerHeight - 2) return;
      const predicted = Math.min(
        1,
        Math.max(0, (scrollY + velY * 250) / spacerHeight),
      );
      let goDown: boolean;
      if (velY > SNAP_VEL_MIN) goDown = true;
      else if (velY < -SNAP_VEL_MIN) goDown = false;
      else goDown = predicted >= SNAP_THRESHOLD;
      snapTo(goDown ? spacerHeight : 0);
    };

    // Update cached height on resize / orientation change
    const onResize = () => {
      spacerHeight = spacer.offsetHeight || 1;
      onScroll();
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", onResize);
      root.style.removeProperty("--page-scroll-y");
      heroRoot.classList.remove("hero-inactive");
      driftEl?.style.removeProperty("transform");
    };
  }, []);

  return null;
}
