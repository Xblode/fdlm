import { GradientMapImage } from "@/components/gradient-map-image";
import { VenuePlaceholderGradient } from "@/components/venue-placeholder-gradient";

type VenueCardMediaProps = {
  venueId: string;
  imageSrc?: string;
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
  rounded = "top",
}: VenueCardMediaProps) {
  const roundedClassName = rounded === "all" ? "rounded-2xl" : "rounded-t-2xl";

  return (
    <div className={`absolute inset-0 overflow-hidden ${roundedClassName}`}>
      {imageSrc ? (
        <GradientMapImage src={imageSrc} className="size-full object-cover" />
      ) : (
        <VenuePlaceholderGradient venueId={venueId} />
      )}
      <MediaScrim />
    </div>
  );
}
