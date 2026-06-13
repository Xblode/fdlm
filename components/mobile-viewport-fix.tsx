"use client";

import { useEffect } from "react";

function applyMobileVh() {
  document.documentElement.style.setProperty(
    "--mobile-vh",
    `${window.innerHeight}px`,
  );
}

export function MobileViewportFix() {
  useEffect(() => {
    applyMobileVh();

    const onOrientationChange = () => {
      window.setTimeout(applyMobileVh, 150);
    };

    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("resize", applyMobileVh);

    return () => {
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("resize", applyMobileVh);
      document.documentElement.style.removeProperty("--mobile-vh");
    };
  }, []);

  return null;
}
