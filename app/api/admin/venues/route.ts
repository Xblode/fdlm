import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { createVenue, getVenues, venueExists } from "@/lib/data/venues";
import { ensureUniqueVenueId } from "@/lib/utils/slugify";
import type { Venue } from "@/lib/data/types";

export async function GET() {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  const venues = await getVenues({ publishedOnly: false });
  return NextResponse.json({ ok: true, data: venues });
}

export async function POST(request: Request) {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  let body: Partial<Venue> & { id?: string; published?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  if (!body.name || !body.cityId) {
    return NextResponse.json(
      { ok: false, message: "Nom et ville requis." },
      { status: 400 },
    );
  }

  const id =
    body.id?.trim() ||
    (await ensureUniqueVenueId(body.name, venueExists));

  try {
    const venue = await createVenue({
      id,
      cityId: body.cityId,
      name: body.name,
      venueType: body.venueType ?? "Lieu",
      address: body.address ?? "",
      hoursStart: body.hoursStart ?? "18H00",
      hoursEnd: body.hoursEnd ?? "02H00",
      musicStyles: body.musicStyles ?? [],
      mapsUrl: body.mapsUrl ?? "",
      cardImage: body.cardImage,
      published: body.published ?? true,
    });

    return NextResponse.json({ ok: true, data: venue });
  } catch (error) {
    console.error("Create venue failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de créer le lieu." },
      { status: 500 },
    );
  }
}
