"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ProgramPanel } from "@/components/program-panel";

const LOGO_WIDTH = 3354;
const LOGO_HEIGHT = 784;
const MENU_WIDTH = 83;
const MENU_HEIGHT = 49;

const EXPLORE_WIDTH = 47;
const EXPLORE_HEIGHT = 46;

function scrollToLocationSearch() {
  const search = document.getElementById("location-search");
  const section = document.getElementById("location-section");
  const header = document.querySelector(".mobile-app > header");
  if (!section || !header) return;

  const headerHeight = header.getBoundingClientRect().height;

  if (search) {
    const searchTop = search.getBoundingClientRect().top;
    const isSearchPinned =
      searchTop <= headerHeight + 12 &&
      section.getBoundingClientRect().top < headerHeight;

    if (isSearchPinned) {
      const top =
        section.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
  }

  if (search) {
    search.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function MobileHeader() {
  const [isCompact, setIsCompact] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [programPanelKey, setProgramPanelKey] = useState(0);

  useEffect(() => {
    const heroSpacer = document.getElementById("hero-spacer");

    const updateHeader = () => {
      const headerEl = document.querySelector(".mobile-app > header");
      const headerHeight = headerEl?.getBoundingClientRect().height ?? 64;

      if (!heroSpacer) {
        setIsCompact(true);
        return;
      }

      const contentEl = document.querySelector(".mobile-app > div.relative.z-10");
      const contentTop = contentEl?.getBoundingClientRect().top ?? Infinity;
      setIsCompact(contentTop <= headerHeight);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  return (
    <>
      <header
      className="fixed top-0 right-0 left-0 z-[60] grid h-[var(--mobile-header-height)] w-full shrink-0 grid-cols-3 items-center bg-brand-yellow px-4 transition-all duration-300 ease-out md:hidden"
    >
      <button
        type="button"
        aria-label="Ouvrir mon programme"
        aria-expanded={isProgramOpen}
        onClick={() => {
          setProgramPanelKey((current) => current + 1);
          setIsProgramOpen(true);
        }}
        className={`justify-self-start transition-all duration-300 ease-out ${
          isCompact ? "scale-95 opacity-90" : "scale-100 opacity-100"
        }`}
      >
        <Image
          src="/1x/Fichier 1.webp"
          alt=""
          width={MENU_WIDTH}
          height={MENU_HEIGHT}
          className="h-7 w-auto object-contain"
          aria-hidden
        />
      </button>

      <div
        className={`justify-self-center transition-transform duration-300 ease-out ${
          isCompact ? "scale-95" : "scale-100"
        }`}
      >
        <Image
          src="/logo.webp"
          alt="Fête de la musique"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
          sizes="(max-width: 767px) 40vw"
          className="h-9 w-auto max-w-[160px] object-contain brightness-0 mix-blend-screen"
        />
      </div>

      <button
        type="button"
        aria-label="Aller à la recherche"
        onClick={scrollToLocationSearch}
        className={`relative z-[1] justify-self-end transition-all duration-300 ease-out ${
          isCompact ? "scale-95 opacity-90" : "scale-100 opacity-100"
        }`}
      >
        <Image
          src="/1x/Fichier 3.webp"
          alt=""
          width={EXPLORE_WIDTH}
          height={EXPLORE_HEIGHT}
          className="h-7 w-auto object-contain"
          aria-hidden
        />
      </button>
      </header>

      <div
        className="h-[var(--mobile-header-height)] shrink-0 md:hidden"
        aria-hidden="true"
      />

      <ProgramPanel
        key={programPanelKey}
        isOpen={isProgramOpen}
        onClose={() => setIsProgramOpen(false)}
      />
    </>
  );
}
