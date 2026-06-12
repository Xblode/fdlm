import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité — Fête de la musique 2026",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 first:mt-0">
      <h2 className="font-display text-xl uppercase text-brand-yellow">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-brand-yellow/75">
        {children}
      </div>
    </div>
  );
}

export default function ConfidentialitePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative z-10 min-h-screen bg-brand-black px-4 pt-24 pb-16 text-brand-yellow">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-brand-yellow/50 transition-colors hover:text-brand-yellow"
        >
          ← Retour
        </Link>

        <h1 className="font-display text-4xl leading-none uppercase">
          Confidentialité
        </h1>
        <p className="mt-2 text-xs text-brand-yellow/40">
          Politique de protection des données — En vigueur au 1er juin 2026
        </p>

        <Section title="Responsable du traitement">
          <p>
            <strong className="text-brand-yellow">Benjamin Planchon</strong><br />
            Le Havre, France<br />
            Contact : <a href="mailto:planchon.benjamin@outlook.fr" className="underline underline-offset-2">planchon.benjamin@outlook.fr</a>
          </p>
        </Section>

        <Section title="Données collectées">
          <p>
            Ce site collecte uniquement les données que vous saisissez volontairement via le formulaire de dépôt d'événement :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Nom de l'événement ou de l'artiste</li>
            <li>Lieu et horaires</li>
            <li>Genre musical</li>
            <li>Coordonnées de contact éventuelles</li>
          </ul>
          <p>
            Aucun compte utilisateur n'est créé. Aucune donnée personnelle n'est collectée lors de la simple navigation sur le site.
          </p>
        </Section>

        <Section title="Finalité du traitement">
          <p>
            Les données soumises via le formulaire sont utilisées exclusivement pour :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Valider et afficher les événements sur le site</li>
            <li>Vous recontacter si nécessaire pour compléter votre soumission</li>
          </ul>
        </Section>

        <Section title="Conservation des données">
          <p>
            Les données sont conservées pendant la durée de l'événement (Fête de la musique 2026) et supprimées au plus tard le <strong className="text-brand-yellow">31 août 2026</strong>.
          </p>
        </Section>

        <Section title="Cookies et traceurs">
          <p>
            Ce site n'utilise aucun cookie de tracking, de publicité ou d'analyse comportementale. Aucun bandeau de consentement n'est requis.
          </p>
          <p>
            Des données techniques minimales peuvent être conservées par l'hébergeur (Vercel Inc.) à des fins de sécurité et de performance, conformément à leur propre politique de confidentialité.
          </p>
        </Section>

        <Section title="Vos droits (RGPD)">
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants sur vos données :
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li><strong className="text-brand-yellow">Accès</strong> : obtenir une copie de vos données</li>
            <li><strong className="text-brand-yellow">Rectification</strong> : corriger des données inexactes</li>
            <li><strong className="text-brand-yellow">Suppression</strong> : demander l'effacement de vos données</li>
            <li><strong className="text-brand-yellow">Opposition</strong> : vous opposer à un traitement</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:planchon.benjamin@outlook.fr" className="underline underline-offset-2">
              planchon.benjamin@outlook.fr
            </a>
          </p>
          <p>
            Vous pouvez également adresser une réclamation à la{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              CNIL
            </a>.
          </p>
        </Section>

        <Section title="Partage de données">
          <p>
            Vos données ne sont jamais vendues, louées ou transmises à des tiers à des fins commerciales. Elles peuvent être partagées avec l'hébergeur Vercel dans le cadre strict de l'exécution du service.
          </p>
        </Section>
      </section>
    </main>
  );
}
