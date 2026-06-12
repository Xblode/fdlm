import { NextResponse } from "next/server";
import type { EventSubmission } from "@/config/submissions";
import { createSubmission } from "@/lib/data/submissions-store";
import { normalizeGenreField } from "@/lib/utils/music-style";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

function validateSubmission(body: unknown): EventSubmission | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;

  if (data.type === "artist") {
    if (
      !isNonEmptyString(data.name) ||
      !isNonEmptyString(data.venue) ||
      !isNonEmptyString(data.hoursStart) ||
      !isNonEmptyString(data.hoursEnd) ||
      !isNonEmptyString(data.style) ||
      !isNonEmptyString(data.cityId)
    ) {
      return null;
    }

    const hoursStart = data.hoursStart.trim();
    const hoursEnd = data.hoursEnd.trim();

    if (!isValidTime(hoursStart) || !isValidTime(hoursEnd)) return null;

    return {
      type: "artist",
      name: data.name.trim(),
      venue: data.venue.trim(),
      hoursStart,
      hoursEnd,
      style: normalizeGenreField(data.style),
      cityId: data.cityId.trim(),
    };
  }

  if (data.type === "venue") {
    if (
      !isNonEmptyString(data.venueName) ||
      !isNonEmptyString(data.hoursStart) ||
      !isNonEmptyString(data.hoursEnd) ||
      !isNonEmptyString(data.cityId) ||
      !Array.isArray(data.artists)
    ) {
      return null;
    }

    const hoursStart = data.hoursStart.trim();
    const hoursEnd = data.hoursEnd.trim();

    if (!isValidTime(hoursStart) || !isValidTime(hoursEnd)) return null;

    const artists = data.artists
      .filter(
        (artist): artist is Record<string, unknown> =>
          !!artist && typeof artist === "object",
      )
      .map((artist) => ({
        name: typeof artist.name === "string" ? artist.name.trim() : "",
        hoursStart:
          typeof artist.hoursStart === "string" ? artist.hoursStart.trim() : "",
        hoursEnd:
          typeof artist.hoursEnd === "string" ? artist.hoursEnd.trim() : "",
        style:
          typeof artist.style === "string"
            ? normalizeGenreField(artist.style)
            : "",
      }))
      .filter(
        (artist) =>
          artist.name &&
          artist.hoursStart &&
          artist.hoursEnd &&
          artist.style &&
          isValidTime(artist.hoursStart) &&
          isValidTime(artist.hoursEnd),
      );

    if (artists.length === 0) return null;

    return {
      type: "venue",
      venueName: data.venueName.trim(),
      hoursStart,
      hoursEnd,
      cityId: data.cityId.trim(),
      artists,
    };
  }

  return null;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const submission = validateSubmission(body);

  if (!submission) {
    return NextResponse.json(
      { ok: false, message: "Données de soumission invalides." },
      { status: 400 },
    );
  }

  const stored = await createSubmission(submission);

  return NextResponse.json({
    ok: true,
    message: "Soumission enregistrée pour validation.",
    data: { id: stored.id },
  });
}
