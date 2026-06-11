import { NextResponse } from "next/server";
import type { SubmissionStatus } from "@/config/submissions";
import { ensureAdmin } from "@/lib/auth/ensure-admin";
import { listSubmissions } from "@/lib/data/submissions-store";

const VALID_STATUSES = new Set<SubmissionStatus>([
  "pending",
  "approved",
  "rejected",
]);

export async function GET(request: Request) {
  const authError = await ensureAdmin();

  if (authError) {
    return NextResponse.json(
      { ok: false, message: authError.error },
      { status: authError.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.has(statusParam as SubmissionStatus)
      ? (statusParam as SubmissionStatus)
      : undefined;

  const submissions = await listSubmissions(status);

  return NextResponse.json({
    ok: true,
    data: submissions,
  });
}
