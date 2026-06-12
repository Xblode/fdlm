import { NextResponse } from "next/server";
import type { SubmissionStatus } from "@/config/submissions";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { publishApprovedSubmission } from "@/lib/data/publish-submission";
import {
  deleteSubmission,
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

  if (existing.status === "approved" && status === "approved") {
    return NextResponse.json({
      ok: true,
      message: "Demande déjà approuvée.",
      data: existing,
    });
  }

  if (status === "approved" && existing.status !== "approved") {
    try {
      await publishApprovedSubmission(existing.payload);
    } catch (error) {
      console.error("Publication automatique échouée:", error);
      return NextResponse.json(
        {
          ok: false,
          message: "Impossible de publier la demande approuvée.",
        },
        { status: 500 },
      );
    }
  }

  const updated = await updateSubmissionStatus(id, status as SubmissionStatus);

  return NextResponse.json({
    ok: true,
    message: "Statut mis à jour.",
    data: updated,
  });
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
  const existing = await getSubmission(id);

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Demande introuvable." },
      { status: 404 },
    );
  }

  try {
    await deleteSubmission(id);
    return NextResponse.json({ ok: true, message: "Demande supprimée." });
  } catch (error) {
    console.error("Delete submission failed:", error);
    return NextResponse.json(
      { ok: false, message: "Impossible de supprimer la demande." },
      { status: 500 },
    );
  }
}
