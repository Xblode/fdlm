/**
 * Mode mobile uniquement : bloque tablette et desktop avec un message dédié.
 * Passez à `false` (ou `NEXT_PUBLIC_MOBILE_ONLY=false`) pour ouvrir l'app à tous les écrans.
 */
export const siteConfig = {
  mobileOnly:
    process.env.NEXT_PUBLIC_MOBILE_ONLY !== "false" &&
    process.env.NEXT_PUBLIC_MOBILE_ONLY !== "0",
  credits: {
    author: "Benjamin Planchon",
    instagram: "https://www.instagram.com/benjaminplch/",
    behance: "https://www.behance.net/Xblode76",
    addEventUrl: "https://boomkoeur.fr",
  },
} as const;
