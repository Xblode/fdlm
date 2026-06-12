import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { deleteArtist, getArtistById, updateArtist } from "@/lib/data/artists";
import type { Artist } from "@/lib/data/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  const { id } = await context.params;
  const existing = await getArtistById(id);

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Artiste introuvable." },
      { status: 404 },
    );
  }

  let body: Partial<Artist>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  try {
    const artist = await updateArtist(id, body);
    return NextResponse.json({ ok: true, data: artist });
  } catch (error) {
    console.error("Update artist failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de mettre à jour l'artiste." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  const { id } = await context.params;

  try {
    await deleteArtist(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete artist failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de supprimer l'artiste." },
      { status: 500 },
    );
  }
}
