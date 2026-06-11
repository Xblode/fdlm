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

export const venueCardGradientMap = buildInvertedGradientMapStops([
  { position: 0.07, color: "#ffd200" },
  { position: 0.47, color: "#ff231f" },
  { position: 0.8, color: "#222222" },
]);

export const VENUE_GRADIENT_FILTER_ID = "venue-gradient-map";

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

export const venueGradientChannelTables = {
  r: buildChannelTable(venueCardGradientMap, "r"),
  g: buildChannelTable(venueCardGradientMap, "g"),
  b: buildChannelTable(venueCardGradientMap, "b"),
};
