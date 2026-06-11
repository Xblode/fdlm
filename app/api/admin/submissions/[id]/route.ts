import { NextResponse } from "next/server";
import type { SubmissionStatus } from "@/config/submissions";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import {
  getSubmission,
  updateSubmissionStatus,
} from "@/lib/data/submissions-store";

const VALID_STATUSES = new Set<SubmissionStatus>(["approved", "rejected"]);

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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const status = (body as { status?: string }).status;

  if (!status || !VALID_STATUSES.has(status as SubmissionStatus)) {
    return NextResponse.json(
      { ok: false, message: "Statut invalide." },
      { status: 400 },
    );
  }

  const existing = await getSubmission(id);

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Demande introuvable." },
      { status: 404 },
    );
  }

  const updated = await updateSubmissionStatus(id, status as SubmissionStatus);

  return NextResponse.json({
    ok: true,
    message: "Statut mis à jour.",
    data: updated,
  });
}
