/**
 * Mode mobile uniquement : bloque tablette et desktop avec un message dédié.
 * Passez à `false` (ou `NEXT_PUBLIC_MOBILE_ONLY=false`) pour ouvrir l'app à tous les écrans.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    "",
  );
  if (productionHost) return `https://${productionHost}`;

  const vercelHost = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercelHost) return `https://${vercelHost}`;

  return "http://localhost:3000";
}

export const siteConfig = {
  url: getSiteUrl(),
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
