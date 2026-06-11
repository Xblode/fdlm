import {
  VENUE_GRADIENT_FILTER_ID,
  venueGradientChannelTables,
} from "@/lib/venue-gradient-map";

export function SharedGradientFilter() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute size-0 overflow-hidden"
    >
      <defs>
        <filter id={VENUE_GRADIENT_FILTER_ID} colorInterpolationFilters="sRGB">
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
            <feFuncR type="table" tableValues={venueGradientChannelTables.r} />
            <feFuncG type="table" tableValues={venueGradientChannelTables.g} />
            <feFuncB type="table" tableValues={venueGradientChannelTables.b} />
            <feFuncA type="identity" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
