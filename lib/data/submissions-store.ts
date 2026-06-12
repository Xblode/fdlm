import type {
  EventSubmission,
  StoredSubmission,
  SubmissionStatus,
} from "@/config/submissions";
import type { DbSubmission } from "@/lib/data/db-types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function mapSubmission(row: DbSubmission): StoredSubmission {
  return {
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at ?? undefined,
    payload: row.payload as EventSubmission,
  };
}

export async function createSubmission(payload: EventSubmission) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("event_submissions")
    .insert({ payload, status: "pending" })
    .select("*")
    .single();

  if (error) throw error;

  return mapSubmission(data as DbSubmission);
}

export async function listSubmissions(status?: SubmissionStatus) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("event_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as DbSubmission[]).map(mapSubmission);
}

export async function getSubmission(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapSubmission(data as DbSubmission);
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("event_submissions")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  return mapSubmission(data as DbSubmission);
}
