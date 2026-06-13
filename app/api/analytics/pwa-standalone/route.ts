import { NextResponse } from "next/server";
import { isValidUserUuid } from "@/lib/anonymous-user";
import { recordPwaStandaloneOpen } from "@/lib/data/pwa-standalone-users";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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
  const userUuid = isNonEmptyString(data.uuid) ? data.uuid.trim() : "";

  if (!isValidUserUuid(userUuid)) {
    return NextResponse.json(
      { ok: false, message: "UUID utilisateur invalide." },
      { status: 400 },
    );
  }

  try {
    await recordPwaStandaloneOpen(userUuid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PWA standalone tracking failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible d'enregistrer l'ouverture PWA." },
      { status: 500 },
    );
  }
}
