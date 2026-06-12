import { NextResponse } from "next/server";
import {
  addProgramEntry,
  listProgramEntries,
  removeProgramEntry,
} from "@/lib/data/programs";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userUuid = searchParams.get("uuid");

  if (!isNonEmptyString(userUuid)) {
    return NextResponse.json(
      { ok: false, message: "UUID utilisateur requis." },
      { status: 400 },
    );
  }

  try {
    const entries = await listProgramEntries(userUuid.trim());
    return NextResponse.json({ ok: true, data: entries });
  } catch (error) {
    console.error("Program GET failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de charger le programme." },
      { status: 500 },
    );
  }
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

  const data = body as Record<string, unknown>;

  if (
    !isNonEmptyString(data.uuid) ||
    !isNonEmptyString(data.artistId) ||
    !isNonEmptyString(data.artistName) ||
    !isNonEmptyString(data.slot) ||
    !isNonEmptyString(data.genre) ||
    !isNonEmptyString(data.venueName)
  ) {
    return NextResponse.json(
      { ok: false, message: "Données de programme invalides." },
      { status: 400 },
    );
  }

  try {
    const entry = await addProgramEntry(data.uuid.trim(), {
      artistId: data.artistId.trim(),
      artistName: data.artistName.trim(),
      slot: data.slot.trim(),
      genre: data.genre.trim(),
      venueName: data.venueName.trim(),
    });

    return NextResponse.json({ ok: true, data: entry });
  } catch (error) {
    console.error("Program POST failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible d'ajouter au programme." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;

  if (!isNonEmptyString(data.uuid) || !isNonEmptyString(data.artistId)) {
    return NextResponse.json(
      { ok: false, message: "UUID et artistId requis." },
      { status: 400 },
    );
  }

  try {
    await removeProgramEntry(data.uuid.trim(), data.artistId.trim());
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Program DELETE failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de retirer du programme." },
      { status: 500 },
    );
  }
}
