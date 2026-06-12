"use client";

import { useEffect } from "react";
import { isIOSDevice } from "@/lib/device";

function applyMobileVh() {
  document.documentElement.style.setProperty(
    "--mobile-vh",
    `${window.innerHeight}px`,
  );
}

export function MobileViewportFix() {
  useEffect(() => {
    applyMobileVh();

    if (isIOSDevice()) {
      document.documentElement.classList.add("ios");
    }

    const onOrientationChange = () => {
      window.setTimeout(applyMobileVh, 150);
    };

    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("resize", applyMobileVh);

    return () => {
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("resize", applyMobileVh);
      document.documentElement.style.removeProperty("--mobile-vh");
      document.documentElement.classList.remove("ios");
    };
  }, []);

  return null;
}
