import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { createArtist, getArtists } from "@/lib/data/artists";
import type { Artist } from "@/lib/data/types";

export async function GET(request: Request) {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get("venueId") ?? undefined;

  const artists = await getArtists({
    venueId,
    publishedOnly: false,
  });

  return NextResponse.json({ ok: true, data: artists });
}

export async function POST(request: Request) {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  let body: Partial<Artist> & { published?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  if (!body.name || !body.venueId) {
    return NextResponse.json(
      { ok: false, message: "Nom et lieu requis." },
      { status: 400 },
    );
  }

  try {
    const artist = await createArtist({
      name: body.name,
      venueId: body.venueId,
      slot: body.slot ?? "20h00",
      genre: body.genre ?? "",
      published: body.published ?? true,
    });

    return NextResponse.json({ ok: true, data: artist });
  } catch (error) {
    console.error("Create artist failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de créer l'artiste." },
      { status: 500 },
    );
  }
}
