import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { Globe } from "lucide-react";
import type { Venue } from "@/lib/data/types";
import { ChevronIcon } from "@/components/chevron-icon";
import { VenueCardMedia } from "@/components/venue-card-media";

type VenueDetailSectionProps = {
  venue: Venue;
  artistCount: number;
};

type SocialIcon = ComponentType<{ className?: string }>;

function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.318.92.598s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.92c-.11-.281-.24-.705-.276-1.485-.038-.843-.046-1.096-.046-3.232s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.318-.64.598-.92s.547-.453.92-.598c.282-.11.705-.24 1.485-.275.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92M8 3.892a4.108 4.108 0 1 0 0 8.216 4.108 4.108 0 0 0 0-8.216m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
    </svg>
  );
}

function getCreditLinkLabel(url: string) {
  try {
    return new URL(url).hostname.includes("instagram.com")
      ? "Instagram"
      : "Site web";
  } catch {
    return "Lien";
  }
}

function VenueDetail({ venue, artistCount }: VenueDetailSectionProps) {
  const hours = `${venue.hoursStart.toLowerCase()} – ${venue.hoursEnd.toLowerCase()}`;
  const concertLabel = artistCount <= 1 ? "concert" : "concerts";
  const creditLinkLabel = venue.cardImageCreditUrl
    ? getCreditLinkLabel(venue.cardImageCreditUrl)
    : null;
  const venueSocialLinks: { label: string; href: string; icon: SocialIcon }[] = [];

  if (venue.instagramUrl) {
    venueSocialLinks.push({
      label: "Instagram",
      href: venue.instagramUrl,
      icon: InstagramIcon,
    });
  }

  if (venue.websiteUrl) {
    venueSocialLinks.push({
      label: "Site web",
      href: venue.websiteUrl,
      icon: Globe,
    });
  }

  return (
    <>
      <div>
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-black shadow-[6px_6px_0_0_#0a0a0a]">
          <VenueCardMedia
            venueId={venue.id}
            imageSrc={venue.cardImage}
            focusX={venue.cardImageFocusX}
            focusY={venue.cardImageFocusY}
            rounded="all"
          />
          <div className="relative z-10 flex min-h-[200px] flex-col justify-end gap-1.5 p-4">
            <p className="font-display w-fit rounded-full bg-brand-black px-2.5 py-0.5 text-xs tracking-[0.2em] text-brand-yellow uppercase">
              {venue.venueType}
            </p>
            <h1 className="font-display text-5xl leading-[0.9] text-brand-yellow uppercase">
              {venue.name}
            </h1>
          </div>
        </div>

        {venue.cardImageCredit || venue.cardImageCreditUrl ? (
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-brand-black/60">
            <p className="text-left">
              {venue.cardImageCredit ? `© ${venue.cardImageCredit}` : "Crédit photo"}
            </p>
            {venue.cardImageCreditUrl && creditLinkLabel ? (
              <a
                href={venue.cardImageCreditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display shrink-0 rounded-full border border-brand-black bg-brand-black px-2 py-0.5 text-[10px] tracking-[0.16em] text-brand-yellow uppercase"
              >
                {creditLinkLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight text-brand-black uppercase pr-2 mt-1">
            {venue.address}
          </p>
        </div>

        {venueSocialLinks.length > 0 ? (
          <div className="shrink-0 text-right">
            <div className="flex justify-end gap-2">
              {venueSocialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="flex size-10 items-center justify-center rounded-full border-2 border-brand-black bg-brand-black text-brand-yellow shadow-[2px_2px_0_0_#0a0a0a] transition-transform active:scale-[0.96]"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-brand-black bg-brand-black p-4 text-brand-yellow shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]">
          <p className="font-display text-xs tracking-[0.2em] uppercase opacity-70">
            Concerts
          </p>
          <p className="mt-2 font-display text-2xl leading-none uppercase tabular-nums">
            {artistCount}
          </p>
          <p className="mt-1 text-xs uppercase opacity-70">{concertLabel}</p>
        </div>

        <div className="rounded-2xl border-2 border-brand-black bg-white p-4 shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]">
          <p className="font-display text-xs tracking-[0.2em] uppercase opacity-60">
            Horaires
          </p>
          <p className="mt-2 font-display text-2xl leading-none uppercase">
            {hours}
          </p>
          <p className="mt-1 text-xs uppercase opacity-60">Accès libre</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {venue.musicStyles.map((style, index) => (
          <span
            key={style}
            className={`rounded-full border-2 border-brand-black px-3 py-1 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] ${
              index % 2 === 0
                ? "bg-white text-brand-black"
                : "bg-brand-black text-brand-yellow"
            }`}
          >
            {style}
          </span>
        ))}
      </div>

      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-5 flex h-14 w-full items-center justify-between rounded-2xl border-2 border-brand-black bg-white px-5 font-display text-lg tracking-wide text-brand-black uppercase shadow-[4px_4px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
      >
        <span>Y aller sur Maps</span>
        <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </a>
    </>
  );
}

export function VenueDetailSection({ venue, artistCount }: VenueDetailSectionProps) {
  return (
    <section
      id="location-section"
      className="scroll-mt-[var(--mobile-header-height)] bg-brand-yellow px-4 pt-6 pb-10 text-brand-black"
    >
      <div className="location-sticky-toolbar sticky top-[var(--mobile-header-height)] z-[15] -mx-4 bg-brand-yellow px-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/1x/Fichier 4.webp"
              alt=""
              width={49}
              height={49}
              className="h-5 w-auto shrink-0 object-contain"
              aria-hidden
            />
            <h2 className="font-display text-3xl leading-none uppercase">Lieux</h2>
          </div>
          <Link
            href="/"
            className="group inline-flex shrink-0 items-center gap-2 bg-transparent font-display text-lg tracking-wide text-brand-black uppercase"
          >
            Fermer
            <ChevronIcon direction="down" className="size-4" />
          </Link>
        </div>
      </div>

      <div id="venue-detail" className="pt-2">
        <VenueDetail venue={venue} artistCount={artistCount} />
      </div>
    </section>
  );
}
