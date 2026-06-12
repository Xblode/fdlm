import type { Artist, Venue } from "../lib/data/types";

/** Données initiales pour `pnpm run db:seed` uniquement. */
export const seedVenues: Venue[] = [
  {
    id: "eau-tarie",
    cityId: "le-havre",
    name: "L'EAU TARIE",
    venueType: "Bar/Restaurant",
    address: "Adresse à compléter",
    hoursStart: "20H00",
    hoursEnd: "00H00",
    musicStyles: ["Techno", "House", "Electro", "Minimal"],
    mapsUrl: "https://maps.google.com/?q=L'eau+tarie",
    cardImage: "/R.webp",
  },
  {
    id: "le-tetris",
    cityId: "le-havre",
    name: "LE TETRIS",
    venueType: "Salle de concert",
    address: "Adresse à compléter",
    hoursStart: "19H00",
    hoursEnd: "01H00",
    musicStyles: ["Rock", "Indie", "Pop"],
    mapsUrl: "https://maps.google.com/?q=Le+Tetris+Le+Havre",
    cardImage: "/Tetris.webp",
  },
  {
    id: "le-news",
    cityId: "le-havre",
    name: "LE NEWS",
    venueType: "Bar",
    address: "Adresse à compléter",
    hoursStart: "18H00",
    hoursEnd: "02H00",
    musicStyles: ["Rock", "Pop", "Indie"],
    mapsUrl: "https://maps.google.com/?q=Le+News+Le+Havre",
  },
  {
    id: "trappist",
    cityId: "le-havre",
    name: "TRAPPIST",
    venueType: "Bar",
    address: "Adresse à compléter",
    hoursStart: "18H00",
    hoursEnd: "02H00",
    musicStyles: ["Electro", "House", "Techno"],
    mapsUrl: "https://maps.google.com/?q=Trappist+Le+Havre",
  },
  {
    id: "la-colombe",
    cityId: "le-havre",
    name: "LA COLOMBE",
    venueType: "Bar",
    address: "Adresse à compléter",
    hoursStart: "18H00",
    hoursEnd: "02H00",
    musicStyles: ["Jazz", "Soul", "Funk"],
    mapsUrl: "https://maps.google.com/?q=La+Colombe+Le+Havre",
  },
];

export const seedArtists: Omit<Artist, "id">[] = [
  { name: "Flowtapage", slot: "22h00", genre: "Techno", venueId: "eau-tarie" },
  { name: "Noctyra", slot: "23h30", genre: "Techno", venueId: "eau-tarie" },
];
