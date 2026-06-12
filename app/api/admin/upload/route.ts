import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { uploadVenueImage } from "@/lib/storage/venue-images";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "Fichier requis." },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { ok: false, message: "Format d'image non supporté." },
      { status: 400 },
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, message: "Image trop lourde (max 5 Mo)." },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadVenueImage(buffer, file.name, file.type);
    return NextResponse.json({ ok: true, data: { url } });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible d'envoyer l'image." },
      { status: 500 },
    );
  }
}
