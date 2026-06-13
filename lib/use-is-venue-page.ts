"use client";

import { usePathname } from "next/navigation";

const NO_HERO_EXACT_PATHS = ["/artistes", "/lieux"];
const NO_HERO_PREFIX_PATHS = ["/lieux/", "/mentions-legales", "/confidentialite"];

export function useIsVenuePage() {
  const pathname = usePathname();
  return (
    NO_HERO_EXACT_PATHS.includes(pathname) ||
    NO_HERO_PREFIX_PATHS.some((path) => pathname.startsWith(path))
  );
}
