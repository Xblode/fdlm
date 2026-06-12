-- Fête de la musique 2026 — schéma Supabase

CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  available BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id),
  name TEXT NOT NULL,
  venue_type TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  hours_start TEXT NOT NULL DEFAULT '',
  hours_end TEXT NOT NULL DEFAULT '',
  music_styles TEXT[] NOT NULL DEFAULT '{}',
  style_config JSONB NOT NULL DEFAULT '[]',
  maps_url TEXT NOT NULL DEFAULT '',
  card_image TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slot TEXT NOT NULL DEFAULT '',
  slot_end TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uuid TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  slot TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  venue_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_uuid, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_venues_city_id ON venues(city_id);
CREATE INDEX IF NOT EXISTS idx_venues_published ON venues(published);
CREATE INDEX IF NOT EXISTS idx_artists_venue_id ON artists(venue_id);
CREATE INDEX IF NOT EXISTS idx_artists_published ON artists(published);
CREATE INDEX IF NOT EXISTS idx_event_submissions_status ON event_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_programs_user_uuid ON user_programs(user_uuid);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'venue-images',
  'venue-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE venues ADD COLUMN IF NOT EXISTS style_config JSONB NOT NULL DEFAULT '[]';
ALTER TABLE artists ADD COLUMN IF NOT EXISTS slot_end TEXT NOT NULL DEFAULT '';
