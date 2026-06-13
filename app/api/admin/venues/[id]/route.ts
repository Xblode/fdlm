import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { revalidateVenuePages } from "@/lib/data/revalidate-site";
import { deleteVenue, getVenueById, updateVenue } from "@/lib/data/venues";
import type { Venue } from "@/lib/data/types";
import type { VenueStyleEntry } from "@/lib/data/venue-styles";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type VenueUpdateBody = Partial<Venue> & {
  styleConfig?: VenueStyleEntry[];
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

  let body: VenueUpdateBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  delete body.musicStyles;

  try {
    const venue = await updateVenue(id, body);
    revalidateVenuePages(id);
    return NextResponse.json({ ok: true, data: venue });
  } catch (error) {
    console.error("Update venue failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de mettre à jour le lieu.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
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
    revalidateVenuePages(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete venue failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de supprimer le lieu." },
      { status: 500 },
    );
  }
}
