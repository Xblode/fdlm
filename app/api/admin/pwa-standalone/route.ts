import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { getPwaStandaloneStats } from "@/lib/data/pwa-standalone-users";

export async function GET() {
  const authError = await ensureAdmin();
  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  try {
    const stats = await getPwaStandaloneStats();
    return NextResponse.json({ ok: true, data: stats });
  } catch (error) {
    console.error("PWA standalone stats failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de charger les stats PWA." },
      { status: 500 },
    );
  }
}
