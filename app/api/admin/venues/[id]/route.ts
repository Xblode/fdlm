import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { deleteVenue, getVenueById, updateVenue } from "@/lib/data/venues";
import type { Venue } from "@/lib/data/types";

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
  const existing = await getVenueById(id, false);

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Lieu introuvable." },
      { status: 404 },
    );
  }

  let body: Partial<Venue>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  try {
    const venue = await updateVenue(id, body);
    return NextResponse.json({ ok: true, data: venue });
  } catch (error) {
    console.error("Update venue failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de mettre à jour le lieu." },
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
    await deleteVenue(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete venue failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de supprimer le lieu." },
      { status: 500 },
    );
  }
}
