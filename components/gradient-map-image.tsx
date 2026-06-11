import Image from "next/image";

type GradientMapImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function GradientMapImage({
  src,
  alt = "",
  className = "absolute inset-0 size-full object-cover",
}: GradientMapImageProps) {
  return (
    <div className="relative size-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 100vw, 384px"
        quality={60}
        className={`${className} venue-card-gradient-map`}
      />
      {/* Sur mobile : overlay CSS léger à la place du filtre SVG coûteux */}
      <div
        className="venue-card-gradient-overlay pointer-events-none absolute inset-0 md:hidden"
        aria-hidden
      />
    </div>
  );
}
