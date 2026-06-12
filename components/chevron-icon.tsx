const CHEVRON_MASK =
  "[mask-image:url('/1x/Fichier%207.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]";

type ChevronDirection = "right" | "left" | "up" | "down";

const directionClass: Record<ChevronDirection, string> = {
  right: "",
  left: "rotate-180",
  down: "rotate-90",
  up: "-rotate-90",
};

type ChevronIconProps = {
  className?: string;
  direction?: ChevronDirection;
};

export function ChevronIcon({
  className = "size-4",
  direction = "right",
}: ChevronIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${directionClass[direction]} ${CHEVRON_MASK} ${className}`}
    />
  );
}
