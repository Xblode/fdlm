"use client";

import Link from "next/link";
import type { Partner } from "@/config/partners";
import { partners } from "@/config/partners";
import { eventInfo } from "@/config/event";
import { siteConfig } from "@/config/site";
import { AddEventSheet } from "@/components/add-event-sheet";
import { CityPicker } from "@/components/city-picker";

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (id === "agenda") {
    document
      .getElementById("location-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function InstagramIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BehanceIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z" />
    </svg>
  );
}

const partnerLogoMaskStyle = (logoSrc: string, width: number, height: number) =>
  ({
    aspectRatio: `${width} / ${height}`,
    maskImage: `url('${logoSrc}')`,
    WebkitMaskImage: `url('${logoSrc}')`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "left center",
    WebkitMaskPosition: "left center",
  }) as const;

const partnerLogoOutlineFilter =
  "drop-shadow(1px 0 0 #ffdf24) drop-shadow(-1px 0 0 #ffdf24) drop-shadow(0 1px 0 #ffdf24) drop-shadow(0 -1px 0 #ffdf24)";

function PartnerLogo({ partner }: { partner: Partner }) {
  const isVertical = partner.height > partner.width;
  const logo = (
    <div
      role="img"
      aria-label={partner.name}
      className={`${isVertical ? "h-16" : "h-12"} max-w-[11rem] bg-brand-yellow`}
      style={{
        ...partnerLogoMaskStyle(partner.logoSrc, partner.width, partner.height),
        filter: partnerLogoOutlineFilter,
      }}
    />
  );

  const className =
    "flex items-center justify-start transition-transform active:scale-[0.98]";

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={partner.name}
      >
        {logo}
      </a>
    );
  }

  return <div className={className}>{logo}</div>;
}

export function MobileFooter({
  selectedCityId,
  onCityChange,
}: {
  selectedCityId: string;
  onCityChange: (cityId: string) => void;
}) {
  const { author, instagram, behance } = siteConfig.credits;

  return (
    <footer className="relative z-10 -mt-6 overflow-hidden rounded-t-3xl bg-brand-black text-brand-yellow">
      <div className="px-4 pt-14 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div
            role="img"
            aria-label="Fête de la musique"
            className="aspect-[3354/784] h-10 max-w-[45%] shrink-0 bg-brand-yellow [mask-image:url('/logo.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left]"
          />

          <p className="font-display text-3xl leading-none uppercase text-right">
            {eventInfo.dateShort} 2026
          </p>
        </div>

        <CityPicker value={selectedCityId} onChange={onCityChange} />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => scrollToSection("location-section")}
            className="rounded-full border-2 border-brand-yellow bg-brand-black px-4 py-2.5 font-display text-base tracking-wide uppercase shadow-[3px_3px_0_0_#ffdf24] transition-transform active:scale-[0.98]"
          >
            Lieux
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("agenda")}
            className="rounded-full border-2 border-brand-yellow bg-brand-black px-4 py-2.5 font-display text-base tracking-wide text-brand-yellow uppercase shadow-[3px_3px_0_0_#ffdf24] transition-transform active:scale-[0.98]"
          >
            Agenda
          </button>
          <AddEventSheet defaultCityId={selectedCityId} />
        </div>

        <Link
          href="/login"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full border-2 border-brand-yellow px-4 text-center font-display text-base tracking-wide text-brand-yellow uppercase shadow-[3px_3px_0_0_#ffdf24] transition-transform active:scale-[0.98]"
        >
          Connexion
        </Link>

        {partners.length > 0 ? (
          <div className="mt-8 border-t border-brand-yellow/15 pt-4">
            <p className="mb-5 text-center font-display text-2xl leading-none uppercase text-brand-yellow">
              Partenaires
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 px-3">
              {partners.map((partner) => (
                <PartnerLogo key={partner.logoSrc} partner={partner} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram — ${author}`}
              className="p-1.5 text-brand-yellow transition-transform active:scale-[0.98]"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={behance}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Behance — ${author}`}
              className="p-1.5 text-brand-yellow transition-transform active:scale-[0.98]"
            >
              <BehanceIcon className="size-5" />
            </a>
          </div>
          <p className="font-display text-sm leading-none uppercase text-brand-yellow">
            © 2026 {author}
          </p>
        </div>
      </div>
    </footer>
  );
}
