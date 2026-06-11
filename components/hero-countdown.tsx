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
    { value: timeLeft.days, label: "j" },
    { value: timeLeft.hours, label: "h" },
    { value: timeLeft.minutes, label: "m" },
    { value: timeLeft.seconds, label: "s" },
  ];

  return (
    <div
      className="flex items-baseline gap-2.5 text-brand-yellow drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
      aria-label={`Compte à rebours : ${timeLeft.days} jours, ${timeLeft.hours} heures, ${timeLeft.minutes} minutes, ${timeLeft.seconds} secondes`}
      aria-live="off"
    >
      {units.map(({ value, label }) => (
        <div key={label} className="flex items-baseline">
          <span className="font-year text-[4.2rem] leading-[0.85] tabular-nums tracking-tight">
            {pad(value)}
          </span>
          <span className="ml-0.5 font-display text-2xl opacity-90 uppercase">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
