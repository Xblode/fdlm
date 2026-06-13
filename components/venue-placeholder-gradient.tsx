import Image from "next/image";
import { getVenuePlaceholderGradientClass } from "@/lib/venue-placeholder-gradients";

type VenuePlaceholderGradientProps = {
  venueId: string;
  className?: string;
};

export function VenuePlaceholderGradient({
  venueId,
  className = "size-full",
}: VenuePlaceholderGradientProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/fond-0.webp"
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, 384px"
        quality={60}
        className="object-cover"
      />
      <div
        className={`venue-placeholder-gradient ${getVenuePlaceholderGradientClass(venueId)}`}
        aria-hidden="true"
      />
    </div>
  );
}
