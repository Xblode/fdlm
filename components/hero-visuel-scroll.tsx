import Image from "next/image";

export function HeroVisuelScroll() {
  return (
    <div className="hero-visuel-drift absolute -inset-[9%]">
      <div className="hero-visuel-float relative h-full w-full">
        <Image
          src="/visuel 1.png"
          alt=""
          priority
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
