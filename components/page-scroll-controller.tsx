"use client";

import { useEffect } from "react";
import { isIOSDevice } from "@/lib/device";

const HERO_VISUEL_MAX_X = 6;
const HERO_VISUEL_MAX_Y = -2.5;
const EDGE_PARALLAX = 0.4;
const SNAP_THRESHOLD = 0.38;
const SNAP_VEL_MIN = 0.12;

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function PageScrollController() {
  useEffect(() => {
    const root = document.documentElement;
    const heroRoot = document.getElementById("hero-root");
    const spacer = document.getElementById("hero-spacer");
    const edgeLeft = document.getElementById("edge-left");
    const edgeRight = document.getElementById("edge-right");

    if (!heroRoot || !spacer) return;

    const driftEl = heroRoot.querySelector<HTMLElement>(".hero-visuel-drift");
    const isIOS = isIOSDevice();
    const isMobile = isMobileViewport();

    const useNativeScrollAnim =
      !isIOS &&
      !isMobile &&
      CSS.supports("animation-timeline: scroll()");

    let spacerHeight = spacer.offsetHeight || 1;
    let scrollIdleTimer = 0;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        heroRoot.classList.toggle("hero-inactive", !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(spacer);

    let scrollRaf = 0;
    let lastScrollY = -1;

    const applyScroll = (scrollY: number) => {
      if (scrollY === lastScrollY) return;
      lastScrollY = scrollY;

      if (isMobile) {
        // transform direct sur les 2 immeubles = compositor-only, pas de recalc CSS
        const offset = Math.round(scrollY * EDGE_PARALLAX);
        if (edgeLeft) {
          edgeLeft.style.transform = `translate3d(0,${-offset}px,0)`;
        }
        if (edgeRight) {
          edgeRight.style.transform = `translate3d(0,${offset}px,0)`;
        }
        return;
      }

      if (!useNativeScrollAnim) {
        root.style.setProperty("--page-scroll-y", `${scrollY}px`);

        if (driftEl) {
          const progress = Math.min(Math.max(scrollY / spacerHeight, 0), 1);
          driftEl.style.transform = `scale(0.9) translate3d(${progress * HERO_VISUEL_MAX_X}%, ${progress * HERO_VISUEL_MAX_Y}%, 0)`;
        }
      }
    };

    const onScroll = () => {
      root.classList.add("is-scrolling");
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, 150);

      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        applyScroll(window.scrollY);
      });
    };

    let isSnapping = false;
    let velY = 0;
    let prevClientY = 0;
    let prevTime = 0;

    const snapTo = (target: number) => {
      if (isSnapping) return;
      isSnapping = true;
      window.scrollTo({ top: target, behavior: "auto" });
      window.setTimeout(() => {
        isSnapping = false;
      }, 300);
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
      if (isIOS || isSnapping) return;

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

    const onResize = () => {
      spacerHeight = spacer.offsetHeight || 1;
      lastScrollY = -1;
      applyScroll(window.scrollY);
    };

    applyScroll(window.scrollY);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.clearTimeout(scrollIdleTimer);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", onResize);
      root.classList.remove("is-scrolling");
      root.style.removeProperty("--page-scroll-y");
      heroRoot.classList.remove("hero-inactive");
      driftEl?.style.removeProperty("transform");
      edgeLeft?.style.removeProperty("transform");
      edgeRight?.style.removeProperty("transform");
    };
  }, []);

  return null;
}
