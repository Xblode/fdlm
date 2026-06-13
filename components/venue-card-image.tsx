import Image from "next/image";
import {
  DEFAULT_VENUE_IMAGE_FOCUS,
  formatVenueImageObjectPosition,
  normalizeVenueImageFocus,
} from "@/lib/utils/venue-image-position";

type VenueCardImageProps = {
  src: string;
  alt?: string;
  focusX?: number;
  focusY?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function VenueCardImage({
  src,
  alt = "",
  focusX = DEFAULT_VENUE_IMAGE_FOCUS.x,
  focusY = DEFAULT_VENUE_IMAGE_FOCUS.y,
  className = "absolute inset-0 size-full object-cover",
  sizes = "(max-width: 767px) 100vw, 384px",
  priority = false,
}: VenueCardImageProps) {
  const focus = normalizeVenueImageFocus(focusX, focusY);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      style={{ objectPosition: formatVenueImageObjectPosition(focus.x, focus.y) }}
    />
  );
}
