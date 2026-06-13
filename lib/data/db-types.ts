export type DbCity = {
  id: string;
  name: string;
  available: boolean | null;
};

export type DbVenue = {
  id: string;
  city_id: string;
  name: string;
  venue_type: string;
  address: string;
  hours_start: string;
  hours_end: string;
  music_styles: string[];
  style_config: unknown;
  maps_url: string;
  card_image: string | null;
  card_image_focus_x: number;
  card_image_focus_y: number;
  published: boolean;
  created_at: string;
};

export type DbArtist = {
  id: string;
  venue_id: string;
  name: string;
  slot: string;
  slot_end: string;
  genre: string;
  published: boolean;
  created_at: string;
};

export type DbSubmission = {
  id: string;
  status: "pending" | "approved" | "rejected";
  payload: unknown;
  created_at: string;
  reviewed_at: string | null;
};

export type DbProgramEntry = {
  id: string;
  user_uuid: string;
  artist_id: string;
  artist_name: string;
  slot: string;
  genre: string;
  venue_name: string;
  created_at: string;
};

export type DbPwaStandaloneUser = {
  user_uuid: string;
  first_seen_at: string;
  last_seen_at: string;
  open_count: number;
};
