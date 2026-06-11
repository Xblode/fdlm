"use client";

function scrollToAgenda() {
  const agenda = document.getElementById("agenda");
  if (agenda) {
    agenda.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  document
    .getElementById("location-section")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroProgramActions() {
  return (
    <button
      type="button"
      onClick={scrollToAgenda}
      className="flex w-full items-center justify-between rounded-full border-2 border-brand-black bg-brand-yellow px-4 py-2 font-display text-xl leading-tight tracking-wide text-brand-black uppercase shadow-[3px_3px_0_0_#0a0a0a] transition-transform active:scale-[0.98]"
    >
      <span>Créer mon programme</span>
      <span className="hero-btn-arrow" aria-hidden="true">→</span>
    </button>
  );
}
