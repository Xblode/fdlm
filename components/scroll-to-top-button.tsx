"use client";

import { useEffect, useState } from "react";

function ArrowUpIcon() {
  return (
    <svg
      className="size-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5M12 5l-6 6M12 5l6 6" />
    </svg>
  );
}

const BOTTOM_THRESHOLD_PX = 160;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      const scrollY = window.scrollY;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const pageHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const heroSpacer = document.getElementById("hero-spacer");
      const heroHeight = heroSpacer?.offsetHeight ?? 0;
      const scrollBottom = Math.ceil(scrollY + viewportHeight);
      const nearBottom =
        scrollBottom >= Math.floor(pageHeight) - BOTTOM_THRESHOLD_PX;
      const pastHero = scrollY > heroHeight * 0.35;

      setIsVisible(pastHero && nearBottom);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    document.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    window.visualViewport?.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      document.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      window.visualViewport?.removeEventListener("resize", updateVisibility);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Remonter en haut de la page"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed right-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[35] inline-flex size-12 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-black text-brand-yellow shadow-[3px_3px_0_0_#ffdf24] transition-[transform,opacity] duration-300 ease-out active:scale-95 md:hidden ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUpIcon />
    </button>
  );
}
