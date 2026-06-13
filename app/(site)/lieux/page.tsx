import type { Metadata } from "next";
import { Suspense } from "react";
import { VenuesPageContent } from "@/components/venues-page-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lieux — Fête de la musique",
  description: "Tous les lieux de la Fête de la musique 2026",
};

export default function VenuesPage() {
  return (
    <Suspense>
      <VenuesPageContent />
    </Suspense>
  );
}
