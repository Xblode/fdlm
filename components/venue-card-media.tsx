import { GradientMapImage } from "@/components/gradient-map-image";

type VenueCardMediaProps = {
  imageSrc?: string;
  rounded?: "top" | "all";
};

export function VenueCardMedia({
  imageSrc,
  rounded = "top",
}: VenueCardMediaProps) {
  const roundedClassName = rounded === "all" ? "rounded-2xl" : "rounded-t-2xl";

  return imageSrc ? (
    <div className={`absolute inset-0 overflow-hidden ${roundedClassName}`}>
      <GradientMapImage
        src={imageSrc}
        className="size-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-4/5 bg-gradient-to-r from-black/35 via-black/10 to-transparent"
        aria-hidden
      />
    </div>
  ) : null;
}
