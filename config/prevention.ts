export type PreventionPoster = {
  id: string;
  title: string;
  image: string;
};

export const rdrContent = {
  title: "Fais la fête en sécurité",
  description:
    "On a créé une série d'affiches de prévention pour sensibiliser ton public. Commande-les gratuitement et affiche-les dans ton lieu pour une fête plus safe.",
  hint: "Touche les cartes pour les feuilleter",
  orderLabel: "Demander des affiches",
  orderHref:
    "mailto:contact@boomkoeur.fr?subject=Commande%20d'affiches%20de%20pr%C3%A9vention%20%E2%80%94%20FDLM%202026&body=Bonjour%2C%0A%0AJe%20souhaite%20commander%20les%20affiches%20de%20pr%C3%A9vention%20pour%20mon%20lieu.%0A%0ANom%20du%20lieu%20%3A%20%0AAdresse%20%3A%20%0AAffiches%20souhait%C3%A9es%20%3A%20%0A%0AMerci%20%21",
} as const;

// NOTE : images de remplacement — à remplacer par les vrais visuels d'affiches.
export const preventionPosters: PreventionPoster[] = [
  { id: "alcool", title: "Alcool & hydratation", image: "/R.webp" },
  { id: "sons", title: "Protège tes oreilles", image: "/Tetris.webp" },
  { id: "consentement", title: "Respect & consentement", image: "/R2.webp" },
  { id: "retour", title: "Rentrer en sécurité", image: "/H2.webp" },
  { id: "produits", title: "Infos produits", image: "/R3.webp" },
];
