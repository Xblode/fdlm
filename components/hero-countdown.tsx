"use client";

import { useState, useEffect } from "react";

const EVENT_DATE = new Date("2026-06-21T18:00:00");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null;

function getTimeLeft(): TimeLeft {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) {
    return (
      <p className="font-display text-3xl leading-tight text-brand-yellow uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
        C&apos;est la fête&nbsp;!
      </p>
    );
  }

  const units = [
    { value: timeLeft.days, label: "J" },
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "M" },
    { value: timeLeft.seconds, label: "S" },
  ];

  return (
    <div
      className="flex items-end gap-1 text-brand-yellow drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
      aria-label={`Compte à rebours : ${timeLeft.days} jours, ${timeLeft.hours} heures, ${timeLeft.minutes} minutes, ${timeLeft.seconds} secondes`}
      aria-live="off"
    >
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-end">
          <div className="flex flex-col items-center leading-none">
            <span className="font-year text-[3.75rem] leading-[0.88] tabular-nums tracking-tight">
              {pad(value)}
            </span>
            <span className="font-display text-[0.6rem] tracking-[0.2em] opacity-70 uppercase">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="mb-[1.65rem] px-0.5 font-year text-[1.5rem] leading-none opacity-50">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
