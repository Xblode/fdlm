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

export function IosButtonTapFix() {
  useEffect(() => {
    if (!isIosTouchDevice()) return;

    let suppressClickUntil = 0;

    const onTouchEnd = (event: TouchEvent) => {
      const button = findButton(event.target);
      if (!button) return;

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

    document.addEventListener("touchend", onTouchEnd, {
      capture: true,
      passive: false,
    });
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("touchend", onTouchEnd, { capture: true });
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
