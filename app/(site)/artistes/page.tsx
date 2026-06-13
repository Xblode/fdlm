import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtistsPageContent } from "@/components/artists-page-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Artistes — Fête de la musique",
  description: "Tous les artistes de la Fête de la musique 2026",
};

export default function ArtistsPage() {
  return (
    <Suspense>
      <ArtistsPageContent />
    </Suspense>
  );
}
