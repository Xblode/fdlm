"use client";

import { AddEventSheet } from "@/components/add-event-sheet";

type AddEventCtaSectionProps = {
  selectedCityId: string;
};

export function AddEventCtaSection({ selectedCityId }: AddEventCtaSectionProps) {
  return (
    <section
      id="add-event"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 rounded-t-3xl bg-brand-yellow px-4 pt-7 pb-14 text-brand-black"
    >
      <div className="rounded-3xl border-2 border-brand-black bg-white p-6 shadow-[6px_6px_0_0_#0a0a0a]">
        <h2 className="font-display text-3xl leading-none uppercase">
          Tu organises un concert ?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-brand-black/75">
          Propose ton événement ou ton lieu pour qu&apos;il apparaisse sur le site.
        </p>

        <div className="mt-6">
          <AddEventSheet defaultCityId={selectedCityId} />
        </div>
      </div>
    </section>
  );
}
