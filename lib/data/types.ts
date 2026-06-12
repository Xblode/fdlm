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

export type Artist = {
  id: string;
  name: string;
  slot: string;
  genre: string;
  venueId: string;
};

export type EventInfo = {
  venue: string;
  venueType: string;
  city: string;
  date: string;
  dateShort: string;
  dateNumeric: string;
  hours: string;
  tagline: string;
  address: string;
  mapsUrl: string;
  venueMusicStyles: readonly string[];
};
