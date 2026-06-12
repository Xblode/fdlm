export type PreventionPoster = {
  id: string;
  title: string;
  image: string;
};

export const rdrContent = {
  title: "Réduction des risques",
  description:
    "On a créé une série d'affiches de prévention pour sensibiliser ton public. Commande-les gratuitement et affiche-les dans ton lieu pour une fête plus safe.",
  hint: "Touche les cartes pour les feuilleter",
  orderLabel: "Demander des affiches",
  orderHref:
    "mailto:contact@boomkoeur.fr?subject=Commande%20d'affiches%20de%20pr%C3%A9vention%20%E2%80%94%20FDLM%202026&body=Bonjour%2C%0A%0AJe%20souhaite%20commander%20les%20affiches%20de%20pr%C3%A9vention%20pour%20mon%20lieu.%0A%0ANom%20du%20lieu%20%3A%20%0AAdresse%20%3A%20%0AAffiches%20souhait%C3%A9es%20%3A%20%0A%0AMerci%20%21",
} as const;

function affiche(filename: string) {
  return `/affiche/${encodeURIComponent(filename)}`;
}

export const preventionPosters: PreventionPoster[] = [
  {
    id: "inclusion",
    title: "La nuit n'exclut personne",
    image: affiche("Plan de travail 1 copie 4.png"),
  },
  {
    id: "respect",
    title: "Pas de respect, pas de danse",
    image: affiche("Plan de travail 1 copie 6.png"),
  },
  {
    id: "consentement",
    title: "Ton envie ne vaut pas un consentement",
    image: affiche("Plan de travail 1.png"),
  },
  {
    id: "securite",
    title: "On protège la fête",
    image: affiche("Plan de travail 1 copie 2.png"),
  },
  {
    id: "lieux",
    title: "Sans lieux, pas de fêtes",
    image: affiche("Plan de travail 1 copie 7.png"),
  },
  {
    id: "scene",
    title: "La scène se construit honnêtement",
    image: affiche("Plan de travail 1 copie 5.png"),
  },
  {
    id: "sante",
    title: "Prendre soin, c'est aussi résister",
    image: affiche("Plan de travail 1 copie 3.png"),
  },
  {
    id: "ecoresponsabilite",
    title: "La fête ne laisse pas de traces",
    image: affiche("Plan de travail 1 copie.png"),
  },
];
