export type Venue = {
  id: string;
  cityId: string;
  name: string;
  venueType: string;
  address: string;
  hoursStart: string;
  hoursEnd: string;
  musicStyles: string[];
  mapsUrl: string;
  cardImage?: string;
};

export const venues: Venue[] = [
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

export type Artist = {
  name: string;
  slot: string;
  genre: string;
  venueId: string;
};

export const artists: Artist[] = [
  { name: "Flowtapage", slot: "22h00", genre: "Techno", venueId: "eau-tarie" },
  { name: "Noctyra", slot: "23h30", genre: "Techno", venueId: "eau-tarie" },
];

export function getArtistsForVenue(venueId: string) {
  return artists.filter((artist) => artist.venueId === venueId);
}

const priorityMusicStyles = ["Techno", "Rock", "House"];

export const musicFilterStyles = [
  ...new Set([
    ...venues.flatMap((venue) => venue.musicStyles),
    ...artists.map((artist) => artist.genre),
  ]),
].sort((a, b) => {
  const aIndex = priorityMusicStyles.indexOf(a);
  const bIndex = priorityMusicStyles.indexOf(b);

  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return a.localeCompare(b, "fr");
});

export const featuredVenue = venues[0];

export const eventInfo = {
  venue: featuredVenue.name,
  venueType: featuredVenue.venueType,
  city: "Le Havre",
  date: "21 juin 2026",
  dateShort: "21 JUIN",
  dateNumeric: "21/06",
  hours: `${featuredVenue.hoursStart.toLowerCase()} – ${featuredVenue.hoursEnd.toLowerCase()}`,
  tagline: "Vivre de techno et d'eau fraîches",
  address: featuredVenue.address,
  mapsUrl: featuredVenue.mapsUrl,
  venueMusicStyles: featuredVenue.musicStyles,
} as const;
