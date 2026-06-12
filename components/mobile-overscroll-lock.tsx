"use client";

import { useEffect } from "react";

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getScrollableAncestor(node: EventTarget | null): HTMLElement | null {
  if (!(node instanceof Element)) return null;

  let el: Element | null = node;
  while (el && el !== document.documentElement) {
    if (!(el instanceof HTMLElement)) {
      el = el.parentElement;
      continue;
    }

    const { overflowY } = window.getComputedStyle(el);
    if (
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

export function MobileOverscrollLock() {
  useEffect(() => {
    if (!isMobileViewport()) return;

    let touchStartY = 0;

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;
      if (touchY == null) return;

      const deltaY = touchY - touchStartY;
      if (deltaY === 0) return;

      const scrollable = getScrollableAncestor(event.target);
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >=
          scrollable.scrollHeight - 1;

        if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
          event.preventDefault();
        }
        return;
      }

      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollTop <= 0 && deltaY > 0) {
        event.preventDefault();
        return;
      }

      if (scrollTop >= maxScroll - 1 && deltaY < 0) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return null;
}
