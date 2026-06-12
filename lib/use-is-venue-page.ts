"use client";

import { usePathname } from "next/navigation";

export function useIsVenuePage() {
  const pathname = usePathname();
  return pathname.startsWith("/lieux/");
}
