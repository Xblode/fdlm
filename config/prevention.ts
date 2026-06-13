export type PreventionPoster = {
  id: string;
  title: string;
  image: string;
};

export const rdrContent = {
  title: "Réduction des risques",
  description:
    "On a créé une série d'affiches de prévention pour sensibiliser ton public. Télécharge les fichiers d'impression et nos conseils pour les afficher dans ton lieu — c'est gratuit et ouvert à toutes et tous.",
  resourcesLabel: "Fichiers & conseils",
  printBundleFile: "/affiche/affiches-prevention-fdlm-2026.zip",
  printBundleDownloadName: "affiches-prevention-fdlm-2026.zip",
  printBundleLabel: "Télécharger toutes les affiches",
  printingTips: [
    "Imprime en A4 ou A3 sur papier mat ou satin, 170 g minimum — ça convient aussi au petit format A6, type carte postale.",
    "Pour des couleurs fidèles, passe par une imprimerie professionnelle.",
    "Laisse bien sécher les affiches avant de les coller.",
    "Varie les messages dans ton lieu pour toucher plus de monde.",
  ],
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
