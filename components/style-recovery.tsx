"use client";

import { useEffect } from "react";

function stylesLookBroken() {
  if (document.styleSheets.length === 0) return true;

  const probe = document.createElement("div");
  probe.className = "font-display";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.textContent = "x";
  document.body.appendChild(probe);

  const font = getComputedStyle(probe).fontFamily.toLowerCase();
  probe.remove();

  // font-display = Anton — si on retombe sur la serif par défaut, le CSS a sauté
  return !font.includes("anton") && !font.includes("bebas");
}

function recoverStylesIfNeeded() {
  if (!stylesLookBroken()) return;
  window.location.reload();
}

export function StyleRecovery() {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) recoverStylesIfNeeded();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") recoverStylesIfNeeded();
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
