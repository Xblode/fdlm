import Image from "next/image";
import { ChevronIcon } from "@/components/chevron-icon";

const transports = [
  {
    id: "lia-bus",
    name: "LiA Bus",
    description: "Réseau de bus du Havre · Horaires et itinéraires sur le site LiA",
    href: "https://www.transports-lia.fr",
  },
  {
    id: "lia-nuit",
    name: "LiA de Nuit",
    description:
      "Transport à la demande · 0h30–5h00 · Réservation entre 24 h et 30 min à l'avance",
    href: "https://liadenuit.transports-lia.fr",
  },
  {
    id: "voi",
    name: "Voi",
    description: "Trottinettes et vélos électriques en libre-service au Havre",
    href: "https://www.voi.com",
  },
] as const;

export function TransportSection() {
  return (
    <section
      id="transport"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 rounded-t-3xl bg-brand-yellow px-4 pt-7 pb-2 text-brand-black"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/1x/Fichier 8.png"
          alt=""
          width={44}
          height={49}
          className="h-5 w-auto shrink-0 object-contain"
          aria-hidden
        />
        <h2 className="font-display text-3xl leading-none uppercase">Infos pratiques</h2>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-brand-black/75">
        Bus, navettes de nuit et trottinettes pour te déplacer entre les lieux et
        rentrer en sécurité après la fête.
      </p>

      <div className="hide-scrollbar -mx-4 mt-6 overflow-x-auto pb-4">
        <ul className="flex w-max snap-x snap-mandatory gap-4 px-4 py-1.5">
          {transports.map((transport) => (
            <li
              key={transport.id}
              className="w-[72vw] max-w-[16rem] shrink-0 snap-start"
            >
            <a
              href={transport.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between gap-4 rounded-3xl border-2 border-brand-black bg-white p-5 shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
            >
              <div className="min-w-0">
                <p className="font-display text-2xl leading-none uppercase">
                  {transport.name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-black/75">
                  {transport.description}
                </p>
              </div>
              <div className="mt-2 flex justify-end">
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-brand-black bg-brand-yellow text-brand-black shadow-[2px_2px_0_0_#0a0a0a] transition-colors group-hover:bg-brand-black group-hover:text-brand-yellow">
                  <ChevronIcon className="size-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          </li>
        ))}
        </ul>
      </div>
    </section>
  );
}
