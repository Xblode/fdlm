import type { StoredSubmission } from "@/config/submissions";

export function countPendingSubmissionsByCityId(
  submissions: StoredSubmission[],
) {
  const counts: Record<string, number> = {};

  for (const submission of submissions) {
    const { cityId } = submission.payload;
    counts[cityId] = (counts[cityId] ?? 0) + 1;
  }

  return counts;
}

export const ADMIN_SUBMISSIONS_CHANGED_EVENT = "admin:submissions-changed";
