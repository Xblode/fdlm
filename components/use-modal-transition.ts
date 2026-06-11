"use client";

import { useEffect, useState } from "react";

export function useModalTransition(isOpen: boolean, durationMs = 500) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      void Promise.resolve().then(() => setIsMounted(true));

      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });

      return () => cancelAnimationFrame(frame);
    }

    void Promise.resolve().then(() => setIsVisible(false));

    const timer = window.setTimeout(() => setIsMounted(false), durationMs);

    return () => clearTimeout(timer);
  }, [isOpen, durationMs]);

  return { isMounted, isVisible };
}
