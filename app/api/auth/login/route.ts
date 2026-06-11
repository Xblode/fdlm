import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth/credentials";
import { createSession } from "@/lib/auth/session";

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

  const data = body as { username?: string; password?: string };
  const username = data.username?.trim() ?? "";
  const password = data.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, message: "Identifiant et mot de passe requis." },
      { status: 400 },
    );
  }

  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, message: "Identifiants incorrects." },
      { status: 401 },
    );
  }

  await createSession();

  return NextResponse.json({ ok: true, message: "Connexion réussie." });
}
