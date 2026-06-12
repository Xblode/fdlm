"use client";

import { usePathname } from "next/navigation";

const NO_HERO_PATHS = ["/lieux/", "/mentions-legales", "/confidentialite"];

export function useIsVenuePage() {
  const pathname = usePathname();
  return NO_HERO_PATHS.some((p) => pathname.startsWith(p));
}
