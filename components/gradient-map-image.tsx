"use client";

import { useId, useMemo } from "react";
import Image from "next/image";

export type GradientMapStop = {
  offset: number;
  color: string;
};

type PhotoshopGradientStop = {
  position: number;
  color: string;
};

function normalizeHex(color: string) {
  return color.startsWith("#") ? color : `#${color}`;
}

/** Convertit un dégradé Photoshop (avec option « Inverser ») en stops de carte de dégradé. */
export function buildInvertedGradientMapStops(
  barStops: PhotoshopGradientStop[],
): GradientMapStop[] {
  const sortedBarStops = [...barStops]
    .map((stop) => ({
      position: stop.position,
      color: normalizeHex(stop.color),
    }))
    .sort((a, b) => a.position - b.position);

  const firstColor = sortedBarStops[0]?.color ?? "#000000";
  const lastColor = sortedBarStops[sortedBarStops.length - 1]?.color ?? "#ffffff";

  const bar = [
    { position: 0, color: firstColor },
    ...sortedBarStops,
    { position: 1, color: lastColor },
  ];

  const luminanceStops = bar.map((stop) => ({
    offset: Number((1 - stop.position).toFixed(4)),
    color: stop.color,
  }));

  return luminanceStops.sort((a, b) => a.offset - b.offset);
}

// Dégradé Photoshop : 7% #ffd200 · 47% #ff231f · 80% #222222 — avec « Inverser » activé.
export const venueCardGradientMap = buildInvertedGradientMapStops([
  { position: 0.07, color: "#ffd200" },
  { position: 0.47, color: "#ff231f" },
  { position: 0.8, color: "#222222" },
]);

function hexToChannel(hex: string, channel: "r" | "g" | "b") {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);

  if (channel === "r") return ((value >> 16) & 255) / 255;
  if (channel === "g") return ((value >> 8) & 255) / 255;
  return (value & 255) / 255;
}

function interpolateChannel(
  stops: GradientMapStop[],
  position: number,
  channel: "r" | "g" | "b",
) {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset);

  if (position <= sorted[0].offset) {
    return hexToChannel(sorted[0].color, channel);
  }

  if (position >= sorted[sorted.length - 1].offset) {
    return hexToChannel(sorted[sorted.length - 1].color, channel);
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const start = sorted[index];
    const end = sorted[index + 1];

    if (position >= start.offset && position <= end.offset) {
      const ratio = (position - start.offset) / (end.offset - start.offset);
      const startValue = hexToChannel(start.color, channel);
      const endValue = hexToChannel(end.color, channel);

      return startValue + (endValue - startValue) * ratio;
    }
  }

  return 0;
}

function buildChannelTable(
  stops: GradientMapStop[],
  channel: "r" | "g" | "b",
  steps = 32,
) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const position = index / steps;
    return interpolateChannel(stops, position, channel).toFixed(4);
  }).join(" ");
}

type GradientMapImageProps = {
  src: string;
  alt?: string;
  className?: string;
  stops?: GradientMapStop[];
};

export function GradientMapImage({
  src,
  alt = "",
  className = "absolute inset-0 size-full object-cover",
  stops = venueCardGradientMap,
}: GradientMapImageProps) {
  const reactId = useId();
  const filterId = `gradient-map-${reactId.replace(/:/g, "")}`;

  const channelTables = useMemo(
    () => ({
      r: buildChannelTable(stops, "r"),
      g: buildChannelTable(stops, "g"),
      b: buildChannelTable(stops, "b"),
    }),
    [stops],
  );

  return (
    <>
      <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0 0 0 1 0"
              result="luminance"
            />
            <feComponentTransfer in="luminance" result="gradient-map">
              <feFuncR type="table" tableValues={channelTables.r} />
              <feFuncG type="table" tableValues={channelTables.g} />
              <feFuncB type="table" tableValues={channelTables.b} />
              <feFuncA type="identity" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 100vw, 384px"
        quality={60}
        className={className}
        style={{ filter: `url(#${filterId})` }}
      />
    </>
  );
}
