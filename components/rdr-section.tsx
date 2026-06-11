"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  preventionPosters,
  rdrContent,
} from "@/config/prevention";

const SWIPE_THRESHOLD = 80;
const STACK_OFFSET_Y = 16;
const STACK_SCALE_STEP = 0.06;

function ShieldIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function RdrSection() {
  const posters = preventionPosters;
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDir, setExitDir] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);

  if (posters.length === 0) return null;

  function handlePointerDown(e: React.PointerEvent) {
    if (exitDir !== 0) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    touchStartXRef.current = e.clientX;
    setIsDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging || touchStartXRef.current === null) return;
    const currentX = e.clientX;
    setDragX(currentX - touchStartXRef.current);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!isDragging) return;
    setIsDragging(false);
    
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignorer si la capture est déjà relâchée
    }

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      const dir = dragX > 0 ? 1 : -1;
      setExitDir(dir);
      setTimeout(() => {
        setActiveIndex((c) => (c + 1) % posters.length);
        setDragX(0);
        setExitDir(0);
      }, 300);
    } else {
      setDragX(0);
    }
    touchStartXRef.current = null;
  }

  return (
    <section
      id="rdr"
      className="scroll-mt-[var(--mobile-header-height)] relative z-10 -mt-6 rounded-t-3xl bg-brand-black px-4 pt-8 pb-20 text-brand-yellow"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-yellow text-brand-black">
          <ShieldIcon className="size-4" />
        </span>
        <p className="font-display text-sm tracking-[0.2em] uppercase text-brand-yellow/70">
          {rdrContent.eyebrow}
        </p>
      </div>

      <h2 className="mt-3 font-display text-4xl leading-[0.95] uppercase">
        {rdrContent.title}
      </h2>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-brand-yellow/80">
        {rdrContent.description}
      </p>

      <div className="mt-10 flex flex-col items-center">
        <div className="relative h-[320px] w-full max-w-[20rem]">
          {posters.map((poster, index) => {
            const order = (index - activeIndex + posters.length) % posters.length;
            const isTop = order === 0;
            const isSecond = order === 1;

            let translateX = "-50%";
            let translateY = 0;
            let rotate = 0;
            let scale = 1;
            const zIndex = 10 - order;
            let opacity = 1;
            let transition = "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease-out";

            if (isTop) {
              if (exitDir !== 0) {
                translateX = `calc(-50% + ${exitDir * 400}px)`;
                rotate = exitDir * 25;
                opacity = 0;
              } else {
                translateX = `calc(-50% + ${dragX}px)`;
                rotate = dragX * 0.06;
                if (isDragging) {
                  transition = "none";
                }
              }
            } else {
              const progress = (isDragging && isSecond) ? Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1) : 0;
              
              const baseScale = 1 - order * STACK_SCALE_STEP;
              const nextScale = 1 - (order - 1) * STACK_SCALE_STEP;
              scale = baseScale + (nextScale - baseScale) * progress;

              const baseY = order * STACK_OFFSET_Y;
              const nextY = (order - 1) * STACK_OFFSET_Y;
              translateY = baseY + (nextY - baseY) * progress;

              if (order > 2) {
                opacity = 0;
                transition = "none";
              }
            }

            const style: React.CSSProperties = {
              transform: `translate(${translateX}, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              transformOrigin: "bottom center",
              zIndex,
              opacity,
              transition,
            };

            return (
              <div
                key={poster.id}
                style={style}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
                className={`absolute bottom-6 left-1/2 block aspect-[2/3] w-[13rem] overflow-hidden rounded-2xl border-2 border-brand-yellow bg-brand-black shadow-[4px_4px_0_0_#ffdf24] will-change-transform ${
                  isTop ? "touch-none cursor-grab active:cursor-grabbing" : "pointer-events-none"
                }`}
              >
                <Image
                  src={poster.image}
                  alt=""
                  fill
                  sizes="208px"
                  className="pointer-events-none object-cover"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/90 via-brand-black/60 to-transparent px-4 pt-12 pb-5">
                  <span className="font-display block text-xl leading-none text-brand-yellow uppercase">
                    {poster.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-2" aria-hidden="true">
          {posters.map((poster, index) => (
            <div
              key={poster.id}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "w-8 bg-brand-yellow"
                  : "w-2 bg-brand-yellow/30"
              }`}
            />
          ))}
        </div>

        <p className="mt-4 text-center text-[0.65rem] tracking-[0.1em] text-brand-yellow/50 uppercase">
          GLISSE LES CARTES SUR LE CÔTÉ
        </p>
      </div>

      <a
        href={rdrContent.orderHref}
        className="mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-brand-yellow bg-brand-yellow px-5 text-center font-display text-lg tracking-wide text-brand-black uppercase transition-transform active:scale-[0.98]"
      >
        <ShieldIcon className="size-5" />
        {rdrContent.orderLabel}
      </a>
    </section>
  );
}
