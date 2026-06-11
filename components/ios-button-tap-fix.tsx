"use client";

import { useEffect } from "react";

function isIosTouchDevice() {
  if (typeof window === "undefined") return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function findButton(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const button = target.closest("button");
  if (!button || button.disabled) return null;
  if (button.getAttribute("aria-disabled") === "true") return null;

  return button;
}

const SCROLL_THRESHOLD_PX = 8;

export function IosButtonTapFix() {
  useEffect(() => {
    if (!isIosTouchDevice()) return;

    let suppressClickUntil = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (!findButton(event.target)) return;
      const t = event.touches[0];
      if (t) {
        touchStartX = t.clientX;
        touchStartY = t.clientY;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const button = findButton(event.target);
      if (!button) return;

      // If the finger moved more than the threshold, the user was scrolling —
      // don't fire a click.
      const t = event.changedTouches[0];
      if (t) {
        const dx = Math.abs(t.clientX - touchStartX);
        const dy = Math.abs(t.clientY - touchStartY);
        if (dx > SCROLL_THRESHOLD_PX || dy > SCROLL_THRESHOLD_PX) return;
      }

      event.preventDefault();
      suppressClickUntil = Date.now() + 400;
      button.click();
    };

    const onClick = (event: MouseEvent) => {
      // Let synthetic .click() calls through — only suppress trusted ghost clicks.
      if (!event.isTrusted) return;
      if (Date.now() > suppressClickUntil) return;
      if (!findButton(event.target)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
    };

    document.addEventListener("touchstart", onTouchStart, {
      capture: true,
      passive: true,
    });
    document.addEventListener("touchend", onTouchEnd, {
      capture: true,
      passive: false,
    });
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart, {
        capture: true,
      });
      document.removeEventListener("touchend", onTouchEnd, { capture: true });
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
