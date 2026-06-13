import { VenueCardImage } from "@/components/venue-card-image";
import { VenuePlaceholderGradient } from "@/components/venue-placeholder-gradient";
import { DEFAULT_VENUE_IMAGE_FOCUS } from "@/lib/utils/venue-image-position";

type VenueCardMediaProps = {
  venueId: string;
  imageSrc?: string;
  focusX?: number;
  focusY?: number;
  rounded?: "top" | "all";
};

function MediaScrim() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 w-4/5 bg-gradient-to-r from-black/35 via-black/10 to-transparent"
      aria-hidden="true"
    />
  );
}

export function VenueCardMedia({
  venueId,
  imageSrc,
  focusX = DEFAULT_VENUE_IMAGE_FOCUS.x,
  focusY = DEFAULT_VENUE_IMAGE_FOCUS.y,
  rounded = "top",
}: VenueCardMediaProps) {
  const roundedClassName = rounded === "all" ? "rounded-2xl" : "rounded-t-2xl";

  return (
    <div className={`absolute inset-0 overflow-hidden ${roundedClassName}`}>
      {imageSrc ? (
        <VenueCardImage
          src={imageSrc}
          focusX={focusX}
          focusY={focusY}
        />
      ) : (
        <VenuePlaceholderGradient venueId={venueId} />
      )}
      <MediaScrim />
    </div>
  );
}
