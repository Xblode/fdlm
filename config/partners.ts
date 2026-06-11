export type Partner = {
  name: string;
  logoSrc: string;
  width: number;
  height: number;
  href?: string;
};

export const partners: Partner[] = [
  {
    name: "Boomkoeur",
    logoSrc: "/partners/boomkoeur.svg",
    width: 206,
    height: 113,
    href: "https://boomkoeur.fr",
  },
  {
    name: "R",
    logoSrc: "/R3.png",
    width: 1078,
    height: 368,
  },
  {
    name: "Hop Café",
    logoSrc: "/H3.png",
    width: 500,
    height: 700,
  },
  {
    name: "N",
    logoSrc: "/N2.png",
    width: 524,
    height: 278,
  },
];
