import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Fête de la musique 2026",
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

export default function MentionsLegalesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative z-10 -mt-0 min-h-screen bg-brand-black px-4 pt-24 pb-16 text-brand-yellow">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-brand-yellow/50 transition-colors hover:text-brand-yellow"
        >
          ← Retour
        </Link>

        <h1 className="font-display text-4xl leading-none uppercase">
          Mentions légales
        </h1>
        <p className="mt-2 text-xs text-brand-yellow/40">
          En vigueur au 1er juin 2026
        </p>

        <Section title="Éditeur du site">
          <p>
            Le présent site <strong className="text-brand-yellow">fdlm.boomkoeur.fr</strong> est édité par :
          </p>
          <p>
            <strong className="text-brand-yellow">Benjamin Planchon</strong><br />
            Le Havre, France<br />
            Contact : <a href="mailto:planchon.benjamin@outlook.fr" className="underline underline-offset-2">planchon.benjamin@outlook.fr</a>
          </p>
        </Section>

        <Section title="Directeur de la publication">
          <p>Benjamin Planchon</p>
        </Section>

        <Section title="Hébergement">
          <p>
            Ce site est hébergé par :<br />
            <strong className="text-brand-yellow">Vercel Inc.</strong><br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723, États-Unis<br />
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">vercel.com</a>
          </p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>
            L'ensemble des contenus présents sur ce site (textes, visuels, affiches, code) sont protégés par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
          <p>
            Les affiches de prévention sont réalisées par Thomas Argentin &amp; Benjamin Planchon. Tous droits réservés.
          </p>
          <p>
            Les logos des partenaires et des artistes restent la propriété de leurs titulaires respectifs.
          </p>
        </Section>

        <Section title="Responsabilité">
          <p>
            Les informations diffusées sur ce site (horaires, lieux, artistes) sont fournies à titre indicatif et peuvent être modifiées sans préavis. L'éditeur ne saurait être tenu responsable d'éventuelles inexactitudes.
          </p>
        </Section>

        <Section title="Droit applicable">
          <p>
            Le présent site est soumis au droit français. Tout litige relatif à son utilisation relève de la compétence des tribunaux français.
          </p>
        </Section>
      </section>
    </main>
  );
}
